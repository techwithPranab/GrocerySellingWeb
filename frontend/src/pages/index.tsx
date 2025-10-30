import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import ProductCarousel from '@/components/products/ProductCarousel';
import PromotionalCarousel from '@/components/products/PromotionalCarousel';
import HeroSection from '@/components/home/HeroSection';
import apiClient from '@/lib/api';

interface Offer {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const sampleCategories = [
    { name: 'Fruits', slug: 'fruits', icon: '🍎' },
    { name: 'Vegetables', slug: 'vegetables', icon: '🥦' },
    { name: 'Dairy', slug: 'dairy', icon: '🥛' },
    { name: 'Bakery', slug: 'bakery', icon: '🍞' },
    { name: 'Meat', slug: 'meat', icon: '🍗' },
    { name: 'Snacks', slug: 'snacks', icon: '🍪' }
  ];

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredResult, promotionalResult, offersResult] = await Promise.all([
          productService.getProducts({ featured: true, limit: 8 }),
          productService.getPromotionalProducts(12),
          apiClient.get('/offers')
        ]);
        setFeaturedProducts(featuredResult.products);
        setPromotionalProducts(promotionalResult);
        setOffers(offersResult.offers || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFeaturedProducts([]);
        setPromotionalProducts([]);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title="Fresh Grocery Store - Your one-stop shop for fresh groceries">
      <HeroSection />
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Browse our wide range of fresh products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sampleCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group text-center p-6 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Products Carousel */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <PromotionalCarousel
              promotionalProducts={promotionalProducts}
              title="Special Promotions"
              subtitle="Limited time offers on premium products"
            />
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ProductCarousel 
              products={featuredProducts} 
              title="Featured Products"
              subtitle="Hand-picked fresh products for you"
            />
          )}
        </div>
      </section>
      
      {/* Special Offers Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-gray-600">Don't miss out on these amazing deals!</p>
          </div>
          
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.slice(0, 6).map((offer) => (
                <div key={offer._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {offer.code}
                    </span>
                    <span className="text-primary-600 font-bold text-lg">
                      {offer.discountType === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                  {offer.minimumOrder > 0 && (
                    <p className="text-xs text-gray-500">
                      Minimum order: ₹{offer.minimumOrder}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No special offers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Fresh Grocery?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your groceries delivered within 2 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Fresh products handpicked by our experts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices with regular discounts</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
