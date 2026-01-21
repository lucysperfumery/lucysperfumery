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

  const hasOptions = product.hasOptions || (product.options && product.options.length > 0);

  // Calculate stock: sum of options or base stock
  const totalStock = hasOptions
    ? product.options?.reduce((sum, opt) => sum + opt.stock, 0) || 0
    : product.stock;

  const isOutOfStock = totalStock === 0 || !product.isActive;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  // Get minimum price for products with options
  const minPrice = hasOptions && product.options && product.options.length > 0
    ? Math.min(...product.options.map(opt => opt.price))
    : product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    // Products with options must be added through detail dialog
    if (hasOptions) {
      setShowDialog(true);
      return;
    }

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
              Only {totalStock} left
            </Badge>
          )}
        </div>
        <CardContent className="px-4 lg:px-6 py-4 lg:py-5">
          <p className="font-semibold text-base lg:text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </p>
          <p className="mb-3 lg:mb-4">
            <span className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
              {product.category}
            </span>
          </p>
          <p className="text-base lg:text-xl font-semibold text-primary">
            {hasOptions ? `From GH₵${minPrice.toFixed(2)}` : `GH₵${product.price.toFixed(2)}`}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 lg:px-6 lg:pb-6">
          <Button
            className="flex items-center justify-between px-3 lg:px-4 w-full"
            size="lg"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
            {isOutOfStock ? "Out of Stock" : hasOptions ? "Select Options" : "Add to Cart"}
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
