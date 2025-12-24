import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductDetailDialog from "./ProductDetailDialog";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
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
        className="pt-0 pb-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="px-4">
          <p className="font-semibold text-base mb-1 hover:text-primary transition-colors text-clip overflow-hidden whitespace-nowrap">
            {product.name}
          </p>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="font-medium">{product.brand}</span>
          </div>
          <p className="text-base font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="flex items-center justify-between px-2.5 w-full"
            size="lg"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
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
