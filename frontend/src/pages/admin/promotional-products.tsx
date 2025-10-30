import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import { PromotionalProduct } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminPromotionalProductsPage: React.FC = () => {
  const router = useRouter();
  const [promotionalProducts, setPromotionalProducts] = useState<PromotionalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Audiences' },
    { value: 'all', label: 'All Customers' },
    { value: 'new_customers', label: 'New Customers' },
    { value: 'returning_customers', label: 'Returning Customers' },
    { value: 'premium_members', label: 'Premium Members' }
  ];

  useEffect(() => {
    fetchPromotionalProducts();
  }, []);

  const fetchPromotionalProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/promotional-products?limit=100');
      setPromotionalProducts(response.promotionalProducts || []);
    } catch (error: any) {
      console.error('Failed to fetch promotional products:', error);
      toast.error('Failed to load promotional products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this promotional product?')) return;

    try {
      await apiClient.delete(`/promotional-products/${productId}`);
      toast.success('Promotional product deleted successfully');
      fetchPromotionalProducts();
    } catch (error: any) {
      console.error('Failed to delete promotional product:', error);
      toast.error('Failed to delete promotional product');
    }
  };

  const toggleProductStatus = async (productId: string) => {
    try {
      const product = promotionalProducts.find(p => p._id === productId);
      if (!product) return;

      await apiClient.put(`/promotional-products/${productId}`, {
        ...product,
        isActive: !product.isActive
      });
      toast.success('Product status updated');
      fetchPromotionalProducts();
    } catch (error: any) {
      console.error('Failed to update product status:', error);
      toast.error('Failed to update product status');
    }
  };

  const getDiscountDisplay = (product: PromotionalProduct) => {
    switch (product.discountType) {
      case 'percentage':
        return `${product.discountValue}% off`;
      case 'fixed':
        return `₹${product.discountValue} off`;
      case 'buy_one_get_one':
        return 'Buy 1 Get 1 Free';
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return 'Special Offer';
    }
  };

  const getAudienceDisplay = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'All Customers';
      case 'new_customers':
        return 'New Customers';
      case 'returning_customers':
        return 'Returning Customers';
      case 'premium_members':
        return 'Premium Members';
      default:
        return audience;
    }
  };

  const filteredProducts = promotionalProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && product.isActive) ||
                         (selectedStatus === 'inactive' && !product.isActive);
    const matchesAudience = selectedAudience === 'all' || product.targetAudience === selectedAudience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  if (loading) {
    return (
      <AdminLayout title="Promotional Products - Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Promotional Products - Admin Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotional Products</h1>
            <p className="text-gray-600">Manage your promotional campaigns and offers</p>
          </div>
          <button
            onClick={() => router.push('/admin/promotional-products/new')}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Promotion
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Audience Filter */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {audienceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Promotional Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image?.url || '/placeholder-product.png'}
                          alt={product.image?.alt || product.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getDiscountDisplay(product)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getAudienceDisplay(product.targetAudience)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {product.clickCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleProductStatus(product._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/promotional-products/${product._id}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchQuery || selectedStatus !== 'all' || selectedAudience !== 'all'
                  ? 'No promotional products found matching your criteria.'
                  : 'No promotional products available. Create your first promotion to get started.'
                }
              </div>
              {!searchQuery && selectedStatus === 'all' && selectedAudience === 'all' && (
                <button
                  onClick={() => router.push('/admin/promotional-products/new')}
                  className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Create First Promotion
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Promotions</div>
            <div className="text-2xl font-bold text-gray-900">{promotionalProducts.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Promotions</div>
            <div className="text-2xl font-bold text-green-600">
              {promotionalProducts.filter(p => p.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Clicks</div>
            <div className="text-2xl font-bold text-blue-600">
              {promotionalProducts.reduce((sum, p) => sum + p.clickCount, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Avg. Priority</div>
            <div className="text-2xl font-bold text-purple-600">
              {promotionalProducts.length > 0
                ? Math.round(promotionalProducts.reduce((sum, p) => sum + p.priority, 0) / promotionalProducts.length)
                : 0
              }
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromotionalProductsPage;
