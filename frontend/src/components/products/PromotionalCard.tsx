import React from 'react';
import Link from 'next/link';

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

interface PromotionalCardProps {
  promotionalProduct: PromotionalProduct;
}

const PromotionalCard: React.FC<PromotionalCardProps> = ({ promotionalProduct }) => {
  const getDiscountText = () => {
    switch (promotionalProduct.discountType) {
      case 'percentage':
        return `${promotionalProduct.discountValue}% OFF`;
      case 'fixed':
        return `₹${promotionalProduct.discountValue} OFF`;
      case 'buy_one_get_one':
        return 'BUY 1 GET 1 FREE';
      case 'free_shipping':
        return 'FREE SHIPPING';
      default:
        return '';
    }
  };

  const handleClick = async () => {
    try {
      // Track click (optional - can be implemented later)
      // await fetch(`/api/promotional-products/${promotionalProduct._id}/click`, {
      //   method: 'POST'
      // });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg group">
      {/* Background Image */}
      <img
        src={promotionalProduct.image.url}
        alt={promotionalProduct.image.alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-center">
          {/* Discount Badge */}
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            {getDiscountText()}
          </div>

          {/* Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {promotionalProduct.title}
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-md leading-relaxed">
            {promotionalProduct.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <Link
            href={promotionalProduct.buttonLink}
            onClick={handleClick}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
          >
            {promotionalProduct.buttonText}
          </Link>
        </div>
      </div>

      {/* Priority Indicator (for admin/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Priority: {promotionalProduct.priority}
        </div>
      )}
    </div>
  );
};

export default PromotionalCard;
