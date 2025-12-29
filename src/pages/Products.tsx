import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { Product, ProductFilters as FilterType } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import productService from "@/services/productService";
import { toast } from "sonner";

export default function Products() {
  const { categoryName, brandName } = useParams<{
    categoryName?: string;
    brandName?: string;
  }>();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterType>({
    categories: categoryName ? [decodeURIComponent(categoryName)] : [],
    brands: brandName ? [decodeURIComponent(brandName)] : [],
    search: "",
    sortBy: "name-asc",
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: 1,
          limit: 100,
        });

        // Add slug for routing
        const productsWithSlug = (response.data || []).map((product) => ({
          ...product,
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
        }));

        setAllProducts(productsWithSlug);
      } catch (error) {
        toast.error("Error loading products", {
          description:
            error instanceof Error ? error.message : "Failed to fetch products",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, filters]);

  // Page title based on route
  const pageTitle = useMemo(() => {
    if (categoryName) {
      return `${decodeURIComponent(categoryName)} Products`;
    }
    if (brandName) {
      return `${decodeURIComponent(brandName)} Products`;
    }
    return "All Products";
  }, [categoryName, brandName]);

  return (
    <div className="bg-white dark:bg-neutral-950">
      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{pageTitle}</h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Filters */}
        <ProductFilters filters={filters} onFiltersChange={setFilters} />

        {/* Products Grid */}
        <div className="mt-6 sm:mt-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400">
                Loading products...
              </p>
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              emptyTitle="No products available"
              emptyDescription="Check back soon for our curated collection of premium perfumes."
            />
          )}
        </div>
      </main>
    </div>
  );
}
