import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Product, Review, ReviewsResponse } from '@/types';
import { productService } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, HeartIcon, ShareIcon, TruckIcon, ShieldCheckIcon, StarIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string>('');
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    totalReviews: 0
  });
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: {} as Record<string, number>
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError('');
      const fetchedProduct = await productService.getProduct(productId);
      setProduct(fetchedProduct);
      
      // Fetch reviews after product is loaded
      await fetchReviews(productId);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string, page: number = 1) => {
    try {
      setReviewsLoading(true);
      setReviewsError('');
      const response: ReviewsResponse = await reviewService.getProductReviews(productId, {
        page,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setReviews(response.reviews);
      setReviewsPagination(response.pagination);
      setRatingStats(response.ratingStats);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviewsError('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Save to favorites logic here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: globalThis.location.href,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(globalThis.location.href);
      alert('Product URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout title="Product Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
            <Link
              href="/products"
              className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.name} - Fresh Grocery Store`}>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-end">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="font-medium text-gray-500 hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <Link 
                    href={`/category/${product.category}`}
                    className="font-medium text-gray-500 hover:text-gray-900 capitalize"
                  >
                    {product.category}
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li className="font-medium text-gray-900">{product.name}</li>
              </ol>
            </nav>

            <div className="overflow-hidden rounded-lg">
              <div className="aspect-w-1 aspect-h-1">
                <Image
                  src={product.images[selectedImageIndex]?.url || '/placeholder-product.png'}
                  alt={product.images[selectedImageIndex]?.alt || product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={`${product._id}-image-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg ${
                      selectedImageIndex === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={100}
                      height={100}
                      className="h-20 w-20 object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mt-6 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="lg:max-w-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-2xl tracking-tight text-gray-900">
                  ₹{product.price.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-1">per {product.unit}</span>
                </p>
              </div>

              {/* Stock status */}
              <div className="mt-3">
                {product.stock > 0 ? (
                  <p className="text-green-600">
                    ✓ In stock ({product.stock} {product.unit} available)
                  </p>
                ) : (
                  <p className="text-red-600">✗ Out of stock</p>
                )}
              </div>

              {/* About the product */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About the product</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                  
                  {/* Additional product info */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                      <p className="text-sm text-gray-900 capitalize mt-1">{product.category}</p>
                    </div>
                    {product.brand && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand</span>
                        <p className="text-sm text-gray-900 mt-1">{product.brand}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={`${product._id}-tag-${tag}-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mt-6">
                <div className="flex items-center space-x-4 mb-3">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                    Quantity ({product.unit})
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md border border-gray-300 py-1.5 px-3 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Add to Cart
                </button>
              </div>

              {/* Features */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Free delivery on orders over ₹500</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Quality guaranteed</span>
                  </div>
                  {product.expiryDays && (
                    <div className="flex items-center sm:col-span-2">
                      <span className="text-sm text-gray-500">
                        Best before: {product.expiryDays} days from delivery
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            
            {/* Reviews Statistics */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Rating */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {ratingStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(ratingStats.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {ratingStats.totalReviews} reviews
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingStats.ratingBreakdown[rating.toString()] || 0;
                      const percentage = ratingStats.totalReviews > 0 
                        ? (count / ratingStats.totalReviews) * 100 
                        : 0;
                      
                      return (
                        <div key={rating} className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 w-12">
                            <span className="text-sm text-gray-600">{rating}</span>
                            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Write Review Button */}
            <div className="mb-8">
              <Link
                href={`/review/add?productId=${product._id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Write a Review
              </Link>
            </div>

            {/* Reviews List */}
            {reviewsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewsError && !reviewsLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500">{reviewsError}</p>
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                            {review.isVerifiedPurchase && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarSolidIcon
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image) => (
                          <div key={image.url} className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Helpful Count */}
                    <div className="flex items-center justify-between">
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        👍 Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {reviewsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-700">
                  Showing {reviews.length} of {reviewsPagination.totalReviews} reviews
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchReviews(product!._id, reviewsPagination.currentPage - 1)}
                    disabled={!reviewsPagination.hasPrev}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {reviewsPagination.currentPage} of {reviewsPagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchReviews(product!._id, reviewsPagination.currentPage + 1)}
                    disabled={!reviewsPagination.hasNext}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
