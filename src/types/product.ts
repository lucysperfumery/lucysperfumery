export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  description: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  categories: string[];
  brands: string[];
  search: string;
  sortBy: SortOption;
}
