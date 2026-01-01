import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      onOpenChange(false);
      setQuantity(1);
    }
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  to={`/products/brand/${encodeURIComponent(product.brand)}`}
                  onClick={() => onOpenChange(false)}
                  className="hover:text-primary transition-colors font-medium"
                >
                  {product.brand}
                </Link>
                <span>•</span>
                <Link
                  to={`/products/category/${encodeURIComponent(
                    product.category
                  )}`}
                  onClick={() => onOpenChange(false)}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
              </div>
              <h2 className="text-xl font-bold mb-1">{product.name}</h2>
              <p className="text-xl font-semibold text-primary mb-4">
                GH₵{product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <Card className="p-3 bg-neutral-50 dark:bg-neutral-900">
              <p className="font-semibold">Description</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </Card>

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
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full" size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart - GH₵{(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
