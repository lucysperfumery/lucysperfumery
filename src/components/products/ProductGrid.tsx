import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ProductGrid({
  products,
  emptyTitle,
  emptyDescription,
}: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
