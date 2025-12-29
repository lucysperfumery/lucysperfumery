import api, { handleApiError } from "../lib/api";
import type { Product } from "../types/product";

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

class ProductService {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.minPrice !== undefined)
        params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice !== undefined)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters?.inStock !== undefined)
        params.append("inStock", filters.inStock.toString());

      const response = await api.get(`/api/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await api.get(`/api/products/category/${category}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await api.get("/api/products/categories/list");
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }
}

export default new ProductService();
