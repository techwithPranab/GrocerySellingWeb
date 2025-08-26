import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';
import { Product, ProductCategory } from '@/types';
import { productService } from '@/services/productService';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const categories: { value: ProductCategory | ''; label: string }[] = [
    { value: '', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'grains', label: 'Grains' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'household', label: 'Household' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Newest' },
    { value: 'rating', label: 'Rating' },
  ];

  const [error, setError] = useState<string>('');

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters: any = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (priceRange.min > 0) filters.minPrice = priceRange.min;
      if (priceRange.max < 1000) filters.maxPrice = priceRange.max;
      if (searchQuery) filters.search = searchQuery;
      
      const sort = `${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
      
      const response = await productService.getProducts({
        ...filters,
        sort,
        limit: 50
      });
      setProducts(response.products);
      console.log('Fetched products:', response.products);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      // Fallback to sample products for development
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, sortBy, sortOrder]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        fetchProducts();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    if (searchQuery === '') {
      fetchProducts();
    }
  }, []);

  const filteredProducts = products;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the filter effect
  };

  return (
    <Layout title="Products - Fresh Grocery Store">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-gray-600">Discover fresh groceries and household essentials</p>
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      id="search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </form>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 mb-2"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setPriceRange({ min: 0, max: 1000 });
                        setSortBy('name');
                        setSortOrder('asc');
                      }}
                      className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle & Results Count */}
              {/* <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                </button>
              </div> */}

              {/* Products Grid */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <ProductList products={filteredProducts} />
              )}

              {/* No Results */}
              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <FunnelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or browse all categories.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setPriceRange({ min: 0, max: 1000 });
                      }}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
