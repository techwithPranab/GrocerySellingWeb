import apiClient from '@/lib/api';
import { Product, ProductCategory } from '@/types';

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

interface GetProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: ProductCategory;
  unit?: string;
  images?: Array<{ url: string; alt: string }>;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  expiryDays?: number;
}

export const productService = {
  // Get all products with optional filtering and pagination
  async getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    console.log('Fetching products with params:', searchParams.toString());
    const response = await apiClient.get(`/products?${searchParams.toString()}`);
    console.log('Products response:', response);
    // Wrap the response in ProductsResponse format
    return {
      products: response.products,
      total: response.total,
      page: response.page,
      totalPages: response.totalPages
    };
  },

  // Get a single product by ID
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.product;
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products?featured=true&limit=8');
    return response.products;
  },

  // Search products by query
  async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    const response = await apiClient.get(`/products/search/query?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.products;
  },

  // Create a new product
  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiClient.post('/products', productData);
    return response.product;
  },

  // Update an existing product
  async updateProduct(id: string, updateData: UpdateProductData): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, updateData);
    return response.product;
  },

  // Delete a product
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  // Get products by category
  async getProductsByCategory(category: ProductCategory, limit: number = 20): Promise<Product[]> {
    const response = await apiClient.get(`/products?category=${category}&limit=${limit}`);
    return response.products;
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get('/products/meta/categories');
    return response.categories;
  },

  // Update product stock
  async updateStock(id: string, stock: number): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}/stock`, { stock });
    return response.product;
  },

  // Toggle product featured status
  async toggleFeatured(id: string): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}/featured`);
    return response.product;
  },

  // Toggle product active status
  async toggleActive(id: string): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}/active`);
    return response.product;
  }
};
