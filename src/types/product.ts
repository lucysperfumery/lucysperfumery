export interface Product {
  _id: string;
  name: string;
  slug?: string; // Generated on frontend for routing
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  categories: string[];
  search: string;
  sortBy: SortOption;
}
