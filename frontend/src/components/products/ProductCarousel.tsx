import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title, subtitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const carouselRef = useRef<HTMLDivElement>(null);
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1); // Mobile: 1 card
      } else if (width < 768) {
        setItemsPerView(2); // Small tablet: 2 cards
      } else if (width < 1024) {
        setItemsPerView(3); // Tablet: 3 cards
      } else if (width < 1280) {
        setItemsPerView(4); // Small desktop: 4 cards
      } else {
        setItemsPerView(5); // Large desktop: 5 cards
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / products.length;
      carouselRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(newIndex);
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / products.length;
      carouselRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
        )}

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-hidden scroll-smooth gap-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div 
              key={product._id} 
              className="flex-none"
              style={{ 
                width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)`,
                minWidth: '200px'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {currentIndex < maxIndex && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={`carousel-dot-${index}-${itemsPerView}`}
              onClick={() => {
                setCurrentIndex(index);
                if (carouselRef.current) {
                  const itemWidth = carouselRef.current.scrollWidth / products.length;
                  carouselRef.current.scrollTo({
                    left: index * itemWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
