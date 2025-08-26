import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Offer } from '@/types';
import apiClient from '@/lib/api';
import { TagIcon, CalendarIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/offers');
      console.log('Fetched offers:', response);
      setOffers(response.offers || []);
      console.log('Offers state updated:', offers);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyOfferCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success(`Offer code "${code}" copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy offer code');
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDiscountText = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.value}% OFF`;
    }
    return `₹${offer.value} OFF`;
  };

  const isOfferValid = (offer: Offer) => {
    const now = new Date();
    const validFrom = new Date(offer.validFrom);
    const validUntil = new Date(offer.validUntil);
    return now >= validFrom && now <= validUntil && offer.isActive;
  };

  return (
    <Layout title="Offers & Deals - Fresh Grocery Store">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Offers & Deals
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Save more on your favorite products with our exclusive offers
            </p>
          </div>

          {/* Offers Grid */}
          {loading && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={`offer-skeleton-${index.toString()}`} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && offers.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${
                    isOfferValid(offer)
                      ? 'from-primary-500 to-primary-600'
                      : 'from-gray-400 to-gray-500'
                  } p-6 text-white shadow-lg transition-transform hover:scale-105`}
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm font-semibold">
                      {getDiscountText(offer)}
                    </div>
                  </div>

                  {/* Offer Content */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <TagIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">{offer.code}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-bold">{offer.title}</h3>
                      <p className="mt-2 text-sm opacity-90">{offer.description}</p>

                      {/* Minimum Order */}
                      {offer.minimumOrder > 0 && (
                        <p className="mt-2 text-xs opacity-75">
                          Min. order: ₹{offer.minimumOrder}
                        </p>
                      )}

                      {/* Maximum Discount */}
                      {offer.maximumDiscount && (
                        <p className="mt-1 text-xs opacity-75">
                          Max. discount: ₹{offer.maximumDiscount}
                        </p>
                      )}

                      {/* Valid Until */}
                      <div className="mt-4 flex items-center text-xs opacity-75">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Valid until {formatDate(offer.validUntil)}
                      </div>

                      {/* Usage Limit */}
                      {offer.usageLimit && (
                        <div className="mt-1 text-xs opacity-75">
                          {offer.usageLimit - offer.usedCount} uses remaining
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copy Button */}
                  {isOfferValid(offer) && (
                    <button
                      onClick={() => copyOfferCode(offer.code)}
                      className="mt-4 w-full rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500"
                    >
                      <ClipboardIcon className="inline h-4 w-4 mr-2" />
                      Copy Code
                    </button>
                  )}

                  {/* Expired Overlay */}
                  {!isOfferValid(offer) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <span className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                        {offer.isActive ? 'Expired' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && offers.length === 0 && (
            <div className="mt-12 text-center">
              <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No offers available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for exciting offers and deals!
              </p>
            </div>
          )}

          {/* How to Use Section */}
          <div className="mt-16 rounded-lg bg-gray-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900">How to Use Offers</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <span className="text-lg font-bold text-primary-600">1</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Copy Code</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Click on any offer card to copy the discount code
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <span className="text-lg font-bold text-primary-600">2</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Shop Products</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Add products to your cart and proceed to checkout
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <span className="text-lg font-bold text-primary-600">3</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Apply & Save</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Paste the code at checkout and enjoy your discount
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OffersPage;
