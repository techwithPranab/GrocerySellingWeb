import apiClient from '@/lib/api';
import { Review, ReviewFormData, ReviewsResponse } from '@/types';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ReviewsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get(`/reviews/product/${productId}?${searchParams.toString()}`);
    return response;
  },

  // Get user's reviews
  getUserReviews: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ reviews: Review[]; pagination: any }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`/reviews/user?${searchParams.toString()}`);
    return response;
  },

  // Create a new review
  createReview: async (data: ReviewFormData & { productId: string; orderId: string }): Promise<Review> => {
    const response = await apiClient.post('/reviews', data);
    return response.review;
  },

  // Update a review
  updateReview: async (reviewId: string, data: Partial<ReviewFormData>): Promise<Review> => {
    const response = await apiClient.put(`/reviews/${reviewId}`, data);
    return response.review;
  },

  // Delete a review
  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },

  // Mark review as helpful
  markHelpful: async (reviewId: string): Promise<{ helpfulCount: number }> => {
    const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return response;
  }
};

export default reviewService;
