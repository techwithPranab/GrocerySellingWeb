import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon, HeartIcon, ShareIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
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
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
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
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
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
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product images */}
          <div className="lg:max-w-lg lg:self-end">
            <nav aria-label="Breadcrumb" className="mb-8">
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
              <div className="mt-4 grid grid-cols-4 gap-4">
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
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="lg:max-w-lg">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
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

              <div className="mt-4">
                <p className="text-3xl tracking-tight text-gray-900">
                  ₹{product.price.toFixed(2)}
                  <span className="text-base text-gray-500 ml-1">per {product.unit}</span>
                </p>
              </div>

              {/* Stock status */}
              <div className="mt-4">
                {product.stock > 0 ? (
                  <p className="text-green-600">
                    ✓ In stock ({product.stock} {product.unit} available)
                  </p>
                ) : (
                  <p className="text-red-600">✗ Out of stock</p>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <div className="mt-2 space-y-6">
                  <p className="text-base text-gray-900">{product.description}</p>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
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
              <div className="mt-8">
                <div className="flex items-center space-x-4 mb-4">
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
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
