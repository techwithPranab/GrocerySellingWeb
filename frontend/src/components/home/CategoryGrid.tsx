import React from 'react';
import Link from 'next/link';

export interface Category {
  name: string;
  icon?: React.ReactNode;
  slug: string;
}

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map(category => (
            <Link key={category.slug} href={`/products?category=${category.slug}`}>
              <span className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 text-center cursor-pointer">
                <div className="mb-3 flex justify-center">
                  {category.icon ? (
                    <span className="text-3xl">{category.icon}</span>
                  ) : (
                    <span className="text-3xl">🍎</span>
                  )}
                </div>
                <span className="text-lg font-medium text-gray-900">{category.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
