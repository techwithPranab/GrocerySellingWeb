import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const currentQuantity = getItemQuantity(product._id);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      console.log('Adding to cart:', product);
      // Use discounted price if available, otherwise use regular price
      const productWithPrice = {
        ...product,
        price: product.discountedPrice && product.discountedPrice < product.price ? product.discountedPrice : product.price
      };
      if (currentQuantity === 0) {
        await addToCart(productWithPrice, 1);
      } else {
        await updateQuantity(product._id, currentQuantity + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    try {
      if (currentQuantity > 1) {
        await updateQuantity(product._id, currentQuantity - 1);
      } else {
        await updateQuantity(product._id, 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex flex-col text-xs">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative">
          <img
            src={product.images?.[0]?.url || '/placeholder-product.png'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors line-clamp-2 h-10 leading-tight">
            {product.name}
          </h3>
          
          {/* Rating Display */}
          {product.averageRating && product.averageRating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs font-medium text-gray-900">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
              {product.totalReviews && product.totalReviews > 0 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              {product.discountedPrice && product.discountedPrice < product.price ? (
                <>
                  <span className="text-primary-600 font-bold text-base">
                    ₹{product.discountedPrice.toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
                  </span>
                  <div className="flex items-center space-x-2 h-4">
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-primary-600 font-bold text-base">
                    ₹{product.price.toFixed(2)}
                    <span className="text-xs text-gray-500 font-normal ml-1">/{product.unit}</span>
                  </span>
                  <div className="h-4"></div>
                </>
              )}
            </div>
            {product.stock > 0 ? (
              <span className="text-[10px] text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-[10px] text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {currentQuantity === 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Add to Cart'
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={handleRemoveFromCart}
              disabled={isLoading}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-base font-medium">{currentQuantity}</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= currentQuantity || isLoading}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
