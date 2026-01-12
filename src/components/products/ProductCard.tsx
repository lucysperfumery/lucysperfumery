import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductDetailDialog from "./ProductDetailDialog";
import { toast } from "sonner";
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock === 0 || !product.isActive;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isOutOfStock) {
      toast.error("Out of stock", {
        description: "This product is currently unavailable",
      });
      return;
    }

    const result = addItem(product, 1);
    if (result.success) {
      toast.success("Added to cart", {
        description: `${product.name} added to your cart`,
      });
    } else {
      toast.error("Cannot add to cart", {
        description: result.message || "Failed to add item",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open dialog if not clicking on the "Add to Cart" button
    if (!(e.target as HTMLElement).closest("button")) {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Card
        className={`pt-0 pb-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
          isOutOfStock ? "opacity-75" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800 relative">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? "grayscale" : ""
            }`}
          />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-orange-500 text-white"
            >
              Only {product.stock} left
            </Badge>
          )}
        </div>
        <CardContent className="px-4">
          <p className="font-semibold text-base mb-1 hover:text-primary transition-colors text-clip overflow-hidden whitespace-nowrap">
            {product.name}
          </p>
          <p className="text-base font-semibold text-primary">
            GH₵{product.price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="flex items-center justify-between px-2.5 w-full"
            size="lg"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailDialog
        product={product}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
