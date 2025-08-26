import React from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product._id}>
          {/* ProductCard displays individual product details */}
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
