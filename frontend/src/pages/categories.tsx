import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
  itemCount: number;
}

const categories: Category[] = [
  {
    name: 'Fresh Fruits',
    slug: 'fruits',
    description: 'Crisp, juicy and fresh fruits from local farms',
    icon: '🍎',
    itemCount: 25
  },
  {
    name: 'Fresh Vegetables',
    slug: 'vegetables',
    description: 'Farm-fresh vegetables rich in nutrients',
    icon: '🥬',
    itemCount: 30
  },
  {
    name: 'Dairy Products',
    slug: 'dairy',
    description: 'Fresh milk, cheese, yogurt and dairy products',
    icon: '🥛',
    itemCount: 15
  },
  {
    name: 'Meat & Seafood',
    slug: 'meat',
    description: 'Fresh meat, poultry and seafood',
    icon: '🥩',
    itemCount: 20
  },
  {
    name: 'Grains & Cereals',
    slug: 'grains',
    description: 'Rice, wheat, oats and other grains',
    icon: '🌾',
    itemCount: 18
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Juices, soft drinks, tea, coffee and more',
    icon: '🥤',
    itemCount: 22
  },
  {
    name: 'Snacks',
    slug: 'snacks',
    description: 'Healthy snacks, biscuits and treats',
    icon: '🍪',
    itemCount: 35
  },
  {
    name: 'Household Items',
    slug: 'household',
    description: 'Cleaning supplies, toiletries and home essentials',
    icon: '🧽',
    itemCount: 40
  }
];

const CategoriesPage: React.FC = () => {
  return (
    <Layout title="Categories - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Shop by Category
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Browse our wide selection of fresh groceries organized by category. 
                Find everything you need for your kitchen and home.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {category.itemCount} items
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 group-hover:bg-primary-50 transition-colors">
                  <div className="text-center">
                    <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-lg text-gray-600">
                Most loved categories by our customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-8xl">🍎</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Fruits</h3>
                  <p className="text-gray-600 mb-4">
                    Hand-picked fresh fruits delivered daily from local farms
                  </p>
                  <Link
                    href="/category/fruits"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Shop Fruits
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <span className="text-8xl">🥬</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Vegetables</h3>
                  <p className="text-gray-600 mb-4">
                    Crisp, nutritious vegetables grown with care and love
                  </p>
                  <Link
                    href="/category/vegetables"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Shop Vegetables
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-8xl">🥛</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Dairy Products</h3>
                  <p className="text-gray-600 mb-4">
                    Fresh milk, cheese, and dairy products from trusted sources
                  </p>
                  <Link
                    href="/category/dairy"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Shop Dairy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-primary-600 rounded-lg overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-primary-100 text-lg mb-8">
                Browse all our products or use our search feature to find exactly what you need.
              </p>
              <div className="space-x-4">
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  View All Products
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 transition-colors"
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
