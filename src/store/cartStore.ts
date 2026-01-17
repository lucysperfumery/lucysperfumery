import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductOption } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
  selectedOption?: {
    optionId: string;
    optionName: string;
    optionPrice: number;
  };
  // Unique identifier combining product ID and option ID
  cartItemId?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedOption?: ProductOption) => { success: boolean; message?: string };
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  validateStock: (product: Product, requestedQuantity: number, selectedOption?: ProductOption) => { valid: boolean; message?: string };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      validateStock: (product, requestedQuantity, selectedOption) => {
        if (!product.isActive) {
          return { valid: false, message: 'This product is no longer available' };
        }

        // Check stock for selected option or base product
        const availableStock = selectedOption ? selectedOption.stock : product.stock;

        if (availableStock <= 0) {
          const stockMsg = selectedOption
            ? `${selectedOption.name} is out of stock`
            : 'This product is out of stock';
          return { valid: false, message: stockMsg };
        }

        if (requestedQuantity > availableStock) {
          const stockMsg = selectedOption
            ? `Only ${availableStock} items available for ${selectedOption.name}`
            : `Only ${availableStock} items available in stock`;
          return { valid: false, message: stockMsg };
        }

        return { valid: true };
      },

      addItem: (product, quantity = 1, selectedOption) => {
        // Validate option requirement
        if ((product.hasOptions || (product.options && product.options.length > 0)) && !selectedOption) {
          return { success: false, message: 'Please select an option for this product' };
        }

        // Create unique cart item ID
        const cartItemId = selectedOption
          ? `${product._id}-${selectedOption._id}`
          : product._id;

        // Find existing cart item with same product and option
        const existingItem = get().items.find((item) => item.cartItemId === cartItemId);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentQuantity + quantity;

        // Validate stock
        const stockValidation = get().validateStock(product, totalQuantity, selectedOption);
        if (!stockValidation.valid) {
          return { success: false, message: stockValidation.message };
        }

        set((state) => {
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.cartItemId === cartItemId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Create new cart item
          const newCartItem: CartItem = {
            ...product,
            quantity,
            cartItemId,
          };

          // Add selected option details if provided
          if (selectedOption) {
            newCartItem.selectedOption = {
              optionId: selectedOption._id!,
              optionName: selectedOption.name,
              optionPrice: selectedOption.price,
            };
          }

          return {
            items: [...state.items, newCartItem],
          };
        });

        return { success: true };
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return { success: true };
        }

        // Find the cart item to validate stock
        const cartItem = get().items.find((item) => item.cartItemId === cartItemId);
        if (!cartItem) {
          return { success: false, message: 'Product not found in cart' };
        }

        // Get the selected option if exists
        const selectedOption = cartItem.selectedOption
          ? cartItem.options?.find(opt => opt._id === cartItem.selectedOption?.optionId)
          : undefined;

        // Validate stock
        const stockValidation = get().validateStock(cartItem, quantity, selectedOption);
        if (!stockValidation.valid) {
          return { success: false, message: stockValidation.message };
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));

        return { success: true };
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => {
            // Use selected option price if available, otherwise base price
            const itemPrice = item.selectedOption
              ? item.selectedOption.optionPrice
              : item.price;
            return total + itemPrice * item.quantity;
          },
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
