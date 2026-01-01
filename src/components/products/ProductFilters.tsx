import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  type ProductFilters as FilterType,
  type SortOption,
} from "@/types/product";
import { categories, brands } from "@/lib/consts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      search: "",
      sortBy: "name-asc",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.search;

  return (
    <div className="space-y-2">
      {/* Search and Sort Bar */}
      <div className="flex flex-col items-center sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                sortBy: e.target.value as SortOption,
              })
            }
            className="px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto px-4 py-5 "
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {filters.categories.length + filters.brands.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-medium mb-3">Brands</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
