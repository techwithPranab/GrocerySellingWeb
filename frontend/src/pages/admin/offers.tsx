import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import { Offer } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const AdminOffersPage: React.FC = () => {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/offers');
      setOffers(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch offers:', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      await apiClient.delete(`/offers/${offerId}`);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error: any) {
      console.error('Failed to delete offer:', error);
      toast.error('Failed to delete offer');
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/offers/${offerId}`, { isActive: !currentStatus });
      toast.success('Offer status updated');
      fetchOffers();
    } catch (error: any) {
      console.error('Failed to update offer status:', error);
      toast.error('Failed to update offer status');
    }
  };

  const formatDiscount = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.value}% OFF`;
    }
    return `₹${offer.value} OFF`;
  };

  const isExpired = (offer: Offer) => {
    return new Date(offer.validUntil) < new Date();
  };

  if (loading) {
    return (
      <AdminLayout title="Offers - Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Offers - Admin Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offers & Promotions</h1>
            <p className="text-gray-600">Manage discount codes and promotional offers</p>
          </div>
          <button
            onClick={() => router.push('/admin/offers/new')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Offer
          </button>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {offer.code}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleOfferStatus(offer._id, offer.isActive)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        offer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </button>
                    {isExpired(offer) && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {offer.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Discount:</span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatDiscount(offer)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Min. Order:</span>
                    <span className="text-sm font-medium">₹{offer.minimumOrder}</span>
                  </div>

                  {offer.maximumDiscount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Max. Discount:</span>
                      <span className="text-sm font-medium">₹{offer.maximumDiscount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Usage:</span>
                    <span className="text-sm font-medium">
                      {offer.usedCount} / {offer.usageLimit || '∞'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Valid Until:</span>
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Created {new Date(offer.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/offers/edit/${offer._id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 mb-4">
              No offers available. Create your first promotional offer to get started.
            </div>
            <button
              onClick={() => router.push('/admin/offers/new')}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Create First Offer
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Offers</div>
            <div className="text-2xl font-bold text-gray-900">{offers.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Offers</div>
            <div className="text-2xl font-bold text-green-600">
              {offers.filter(o => o.isActive && !isExpired(o)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Expired Offers</div>
            <div className="text-2xl font-bold text-red-600">
              {offers.filter(o => isExpired(o)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Usage</div>
            <div className="text-2xl font-bold text-blue-600">
              {offers.reduce((sum, o) => sum + o.usedCount, 0)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOffersPage;
