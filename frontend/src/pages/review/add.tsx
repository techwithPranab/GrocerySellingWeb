import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { ReviewFormData, Product } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const AddReviewPage: React.FC = () => {
  const router = useRouter();
  const { productId, orderId } = router.query;
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      title: '',
      comment: ''
    }
  });

  const watchedRating = watch('rating');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!productId || !orderId) {
      return;
    }
    fetchProduct();
  }, [isAuthenticated, productId, orderId, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/${productId}`);
      setProduct(response.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (data.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/reviews', {
        productId,
        orderId,
        ...data
      });
      
      toast.success('Review submitted successfully!');
      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setValue('rating', rating);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Layout title="Write Review - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout title="Write Review - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Review ${product.name} - Fresh Grocery Store`}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
            >
              ← Back to Order
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
            <p className="text-gray-600 mt-2">Share your experience with this product</p>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0]?.url || '/placeholder-product.png'}
                alt={product.name}
                className="h-16 w-16 object-cover rounded-md"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                <input
                  {...register('rating', { required: 'Rating is required' })}
                  type="hidden"
                  id="rating"
                />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      {star <= watchedRating ? (
                        <StarIcon className="h-8 w-8 text-yellow-400 hover:text-yellow-500" />
                      ) : (
                        <StarOutlineIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {watchedRating > 0 && (
                      <>
                        {watchedRating} out of 5 stars
                      </>
                    )}
                  </span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-600">Rating is required</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Review Title *
                </label>
                <input
                  {...register('title', { 
                    required: 'Review title is required',
                    maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                  })}
                  type="text"
                  id="title"
                  placeholder="Summarize your experience"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                  Your Review *
                </label>
                <textarea
                  {...register('comment', { 
                    required: 'Review comment is required',
                    maxLength: { value: 1000, message: 'Comment must be less than 1000 characters' }
                  })}
                  id="comment"
                  rows={6}
                  placeholder="Tell others about your experience with this product..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.comment && (
                  <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Review Guidelines</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be honest and helpful to other customers</li>
                  <li>• Focus on the product's features and your experience</li>
                  <li>• Avoid inappropriate language or personal information</li>
                  <li>• Reviews are moderated and may take time to appear</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddReviewPage;
