import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PromotionalCard from './PromotionalCard';

interface PromotionalProduct {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  discountType: 'percentage' | 'fixed' | 'buy_one_get_one' | 'free_shipping';
  discountValue: number;
  originalPrice?: number;
  discountedPrice?: number;
  buttonText: string;
  buttonLink: string;
  priority: number;
  validFrom: string;
  validUntil?: string;
  targetAudience: string;
  clickCount: number;
}

interface PromotionalCarouselProps {
  promotionalProducts: PromotionalProduct[];
  title?: string;
  subtitle?: string;
}

const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({
  promotionalProducts,
  title = "Special Promotions",
  subtitle = "Limited time offers on premium products"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= promotionalProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? promotionalProducts.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), promotionalProducts.length - 1));
  };

  if (promotionalProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Navigation Buttons */}
        {promotionalProducts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex === 0 && promotionalProducts.length <= 1}
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentIndex >= promotionalProducts.length - 1}
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-600" />
            </button>
          </>
        )}

        {/* Promotional Card */}
        <div className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {promotionalProducts.map((promotionalProduct) => (
              <div
                key={promotionalProduct._id}
                className="flex-shrink-0 w-full"
              >
                <PromotionalCard promotionalProduct={promotionalProduct} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {promotionalProducts.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {promotionalProducts.map((promotionalProduct, index) => (
              <button
                key={promotionalProduct._id}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-primary-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalCarousel;
