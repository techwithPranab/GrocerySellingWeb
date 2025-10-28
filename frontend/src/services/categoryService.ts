import apiClient from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  message: string;
  categories: Category[];
}

interface CategoryResponse {
  message: string;
  category: Category;
}

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response: CategoriesResponse = await apiClient.get('/categories');
    return response.categories;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response: CategoryResponse = await apiClient.get(`/categories/${slug}`);
    return response.category;
  }
};
