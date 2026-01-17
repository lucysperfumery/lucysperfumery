import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product, ProductOption } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const hasOptions = product?.hasOptions || (product?.options && product.options.length > 0);

  // Reset selected option when dialog opens/closes or product changes
  const handleOpenChangeWrapper = (newOpen: boolean) => {
    if (!newOpen) {
      setQuantity(1);
      setSelectedOption(null);
    }
    onOpenChange(newOpen);
  };

  // Set default option when product changes
  useState(() => {
    if (product && hasOptions && product.options && product.options.length > 0) {
      setSelectedOption(product.options[0]);
    } else {
      setSelectedOption(null);
    }
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Validate option selection for products with options
    if (hasOptions && !selectedOption) {
      toast.error("Please select an option");
      return;
    }

    const result = addItem(product, quantity, selectedOption || undefined);
    if (result.success) {
      toast.success("Added to cart", {
        description: `${product.name}${selectedOption ? ` - ${selectedOption.name}` : ''} added to your cart`,
      });
      handleOpenChangeWrapper(false);
    } else {
      toast.error("Cannot add to cart", {
        description: result.message || "Failed to add item",
      });
    }
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (!product) return null;

  // Calculate current price based on selection
  const currentPrice = selectedOption ? selectedOption.price : product.price;
  const availableStock = selectedOption ? selectedOption.stock : product.stock;

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <Link
                  to={`/products/category/${encodeURIComponent(
                    product.category
                  )}`}
                  onClick={() => handleOpenChangeWrapper(false)}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
              </div>
              <h2 className="text-xl font-bold mb-1">{product.name}</h2>
              <p className="text-xl font-semibold text-primary mb-4">
                GH₵{currentPrice.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <Card className="p-3 bg-neutral-50 dark:bg-neutral-900">
              <p className="font-semibold">Description</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </Card>

            {/* Product Options */}
            {hasOptions && product.options && product.options.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Select Option</h3>
                <RadioGroup
                  value={selectedOption?._id || ''}
                  onValueChange={(value) => {
                    const option = product.options?.find(opt => opt._id === value);
                    if (option) setSelectedOption(option);
                  }}
                  className="space-y-2"
                >
                  {product.options.map((option) => (
                    <div
                      key={option._id}
                      className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedOption?._id === option._id
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/50'
                      } ${
                        option.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => {
                        if (option.stock > 0) setSelectedOption(option);
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <RadioGroupItem
                          value={option._id!}
                          id={option._id}
                          disabled={option.stock === 0}
                        />
                        <Label
                          htmlFor={option._id}
                          className="flex items-center justify-between flex-1 cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{option.name}</p>
                            {option.sku && (
                              <p className="text-xs text-neutral-500">SKU: {option.sku}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">GH₵{option.price.toFixed(2)}</p>
                            {option.stock === 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            ) : option.stock <= 5 ? (
                              <Badge variant="secondary" className="text-xs bg-orange-500 text-white">
                                {option.stock} left
                              </Badge>
                            ) : (
                              <p className="text-xs text-neutral-500">In Stock</p>
                            )}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={decrementQuantity}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={incrementQuantity}
                  disabled={quantity >= availableStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {availableStock <= 5 && availableStock > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Only {availableStock} available
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={availableStock === 0 || (hasOptions && !selectedOption)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {availableStock === 0
                ? 'Out of Stock'
                : `Add to Cart - GH₵${(currentPrice * quantity).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
