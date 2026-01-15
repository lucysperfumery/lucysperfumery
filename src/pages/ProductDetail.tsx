import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmptyState from "@/components/products/EmptyState";
import productService from "@/services/productService";
import type { Product } from "@/types/product";
import { toast } from "sonner";

export default function ProductDetail() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch all products and find by slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: 1,
          limit: 1000,
        });

        // Find product by slug
        const foundProduct = response.products.find(
          (p) => p.name.toLowerCase().replace(/\s+/g, "-") === productSlug
        );

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            slug: foundProduct.name.toLowerCase().replace(/\s+/g, "-"),
          });
        }
      } catch (error) {
        toast.error("Error loading product", {
          description:
            error instanceof Error ? error.message : "Failed to fetch product",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleAddToCart = () => {
    if (product) {
      const result = addItem(product, quantity);
      if (result.success) {
        toast.success("Added to cart", {
          description: `${product.name} (${quantity}) added to your cart`,
        });
        setQuantity(1);
      } else {
        toast.error("Cannot add to cart", {
          description: result.message || "Failed to add item to cart",
        });
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else if (product) {
      toast.error("Stock limit reached", {
        description: `Only ${product.stock} items available`,
      });
    }
  };

  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              Loading product...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white dark:bg-neutral-950">
        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <EmptyState
            title="Product not found"
            description="The product you're looking for doesn't exist or has been removed."
          />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6 sm:mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <Card className="overflow-hidden">
            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <Link
                  to={`/products/category/${encodeURIComponent(
                    product.category
                  )}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                {product.name}
              </h1>
              <p className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">
                GH₵{product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                Description
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <Card className="p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-900">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Product Details
              </h3>
              <dl className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <dt className="text-neutral-600 dark:text-neutral-400">
                    Category
                  </dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-600 dark:text-neutral-400">
                    Stock
                  </dt>
                  <dd
                    className={`font-medium ${
                      product.stock <= 5 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Quantity
              </h3>
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
            <div className="pt-2 sm:pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto sm:px-12"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !product.isActive}
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {product.stock === 0 || !product.isActive
                  ? "Out of Stock"
                  : `Add to Cart - GH₵${(product.price * quantity).toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
