import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  validateStock: (product: Product, requestedQuantity: number) => { valid: boolean; message?: string };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      validateStock: (product, requestedQuantity) => {
        if (!product.isActive) {
          return { valid: false, message: 'This product is no longer available' };
        }

        if (product.stock <= 0) {
          return { valid: false, message: 'This product is out of stock' };
        }

        if (requestedQuantity > product.stock) {
          return { valid: false, message: `Only ${product.stock} items available in stock` };
        }

        return { valid: true };
      },

      addItem: (product, quantity = 1) => {
        // Validate stock before adding
        const existingItem = get().items.find((item) => item._id === product._id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const totalQuantity = currentQuantity + quantity;

        const stockValidation = get().validateStock(product, totalQuantity);
        if (!stockValidation.valid) {
          return { success: false, message: stockValidation.message };
        }

        set((state) => {
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity }],
          };
        });

        return { success: true };
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return { success: true };
        }

        // Find the product in cart to validate stock
        const cartItem = get().items.find((item) => item._id === productId);
        if (!cartItem) {
          return { success: false, message: 'Product not found in cart' };
        }

        // Validate stock
        const stockValidation = get().validateStock(cartItem, quantity);
        if (!stockValidation.valid) {
          return { success: false, message: stockValidation.message };
        }

        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity } : item
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
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
