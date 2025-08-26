import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Product, ProductCategory } from '@/types';
import { productService } from '@/services/productService';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const categoryNames: Record<ProductCategory, string> = {
    fruits: 'Fresh Fruits',
    vegetables: 'Fresh Vegetables',
    dairy: 'Dairy Products',
    meat: 'Meat & Seafood',
    grains: 'Grains & Pulses',
    beverages: 'Beverages',
    snacks: 'Snacks & Packaged Foods',
    household: 'Household Items'
  };

  useEffect(() => {
    if (category) {
      fetchCategoryProducts();
    }
  }, [category, sortBy, priceRange]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        category: category as ProductCategory,
        sort: sortBy,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        limit: 50
      });
      setProducts(response.products);
      console.log('Fetched products:', response.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: '-name', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low to High' },
    { value: '-price', label: 'Price High to Low' },
    { value: '-createdAt', label: 'Newest First' }
  ];

  if (!category || !categoryNames[category as ProductCategory]) {
    return (
      <Layout title="Category Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
            <p className="mt-2 text-gray-600">The category you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryName = categoryNames[category as ProductCategory];

  return (
    <Layout title={`${categoryName} - Fresh Grocery Store`}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{categoryName}</h1>
            <p className="mt-4 text-base text-gray-500">
              Fresh and high-quality {categoryName.toLowerCase()} delivered to your doorstep
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 pt-6">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              <p className="ml-4 text-sm text-gray-500">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          {showFilters && (
            <div className="border-b border-gray-200 py-6">
              <div className="max-w-xs">
                <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                <div className="mt-4 flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">₹0 - ₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={`skeleton-loading-${index.toString()}`} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
