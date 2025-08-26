import React from 'react';
import { Product } from '@/types';
import ProductList from '@/components/products/ProductList';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Products</h2>
        <ProductList products={products} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
