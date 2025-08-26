import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-primary-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Fresh Groceries Delivered to Your Doorstep
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl">
          Shop the best selection of fresh produce, dairy, bakery, and household essentials. Fast delivery, great prices, and quality you can trust.
        </p>
        <Link href="/products">
          <span className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-primary-50 transition-colors text-lg">
            Shop Now
          </span>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
