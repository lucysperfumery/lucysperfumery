import { Search } from "lucide-react";
import {
  type ProductFilters as FilterType,
  type SortOption,
} from "@/types/product";
import { categories } from "@/lib/consts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleCategoryChange = (value: string) => {
    // If "all" is selected, clear categories, otherwise set the selected category
    const newCategories = value === "all" ? [] : [value];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  // Get current selected category value for the dropdown
  const currentCategory =
    filters.categories.length > 0 ? filters.categories[0] : "all";

  return (
    <div className="space-y-2">
      {/* Search, Category, and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
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

        {/* Category Select */}
        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">All Categories</SelectItem>
            {categories
              .sort((a, b) => a.localeCompare(b))
              .map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              sortBy: value as SortOption,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
