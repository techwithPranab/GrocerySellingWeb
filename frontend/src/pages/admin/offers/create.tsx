import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/utils/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  CalendarIcon,
  TagIcon,
  PercentBadgeIcon
} from '@heroicons/react/24/outline';

interface OfferForm {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  applicableProducts: string[];
  applicableCategories: string[];
  code?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

const CreateEditOffer: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OfferForm>({
    defaultValues: {
      discountType: 'percentage',
      isActive: true,
      applicableProducts: [],
      applicableCategories: []
    }
  });

  const discountType = watch('discountType');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (isEdit) {
      fetchOffer();
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Mock categories for demo
      setCategories([
        { _id: '1', name: 'Fruits & Vegetables' },
        { _id: '2', name: 'Dairy & Eggs' },
        { _id: '3', name: 'Pantry Staples' },
        { _id: '4', name: 'Snacks & Beverages' }
      ]);
    }
  };

  const fetchOffer = async () => {
    try {
      const response = await api.get(`/admin/offers/${id}`);
      const offer = response.data;
      
      // Format dates for input fields
      setValue('title', offer.title);
      setValue('description', offer.description);
      setValue('discountType', offer.discountType);
      setValue('discountValue', offer.discountValue);
      setValue('minOrderAmount', offer.minOrderAmount);
      setValue('maxDiscountAmount', offer.maxDiscountAmount);
      setValue('startDate', new Date(offer.startDate).toISOString().split('T')[0]);
      setValue('endDate', new Date(offer.endDate).toISOString().split('T')[0]);
      setValue('isActive', offer.isActive);
      setValue('usageLimit', offer.usageLimit);
      setValue('applicableProducts', offer.applicableProducts || []);
      setValue('applicableCategories', offer.applicableCategories || []);
      setValue('code', offer.code);
    } catch (error) {
      console.error('Failed to fetch offer:', error);
      toast.error('Failed to load offer details');
    }
  };

  const onSubmit = async (data: OfferForm) => {
    try {
      setLoading(true);
      
      const offerData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };

      if (isEdit) {
        await api.put(`/admin/offers/${id}`, offerData);
        toast.success('Offer updated successfully!');
      } else {
        await api.post('/admin/offers', offerData);
        toast.success('Offer created successfully!');
      }
      
      router.push('/admin/offers');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update offer' : 'Failed to create offer');
      console.error('Error saving offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const code = 'SAVE' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setValue('code', code);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/offers')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Offer' : 'Create New Offer'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEdit ? 'Update offer details' : 'Add a new promotional offer'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Offer Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Summer Sale - 20% Off"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Describe the offer details..."
                  />
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Offer Code
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      {...register('code')}
                      type="text"
                      id="code"
                      className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="SAVE20"
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Offer
                  </label>
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">
                    Discount Type *
                  </label>
                  <select
                    {...register('discountType', { required: 'Discount type is required' })}
                    id="discountType"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                    Discount Value *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      {...register('discountValue', { 
                        required: 'Discount value is required',
                        min: { value: 0, message: 'Value must be positive' }
                      })}
                      type="number"
                      id="discountValue"
                      step="0.01"
                      className="block w-full pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {discountType === 'percentage' ? '%' : '₹'}
                      </span>
                    </div>
                  </div>
                  {errors.discountValue && (
                    <p className="mt-2 text-sm text-red-600">{errors.discountValue.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700">
                    Minimum Order Amount (₹)
                  </label>
                  <input
                    {...register('minOrderAmount', { 
                      min: { value: 0, message: 'Amount must be positive' }
                    })}
                    type="number"
                    id="minOrderAmount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div>
                    <label htmlFor="maxDiscountAmount" className="block text-sm font-medium text-gray-700">
                      Maximum Discount Amount (₹)
                    </label>
                    <input
                      {...register('maxDiscountAmount', { 
                        min: { value: 0, message: 'Amount must be positive' }
                      })}
                      type="number"
                      id="maxDiscountAmount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="No limit"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                    Usage Limit
                  </label>
                  <input
                    {...register('usageLimit', { 
                      min: { value: 1, message: 'Usage limit must be at least 1' }
                    })}
                    type="number"
                    id="usageLimit"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Unlimited"
                  />
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Validity Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    {...register('startDate', { required: 'Start date is required' })}
                    type="date"
                    id="startDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.startDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date *
                  </label>
                  <input
                    {...register('endDate', { required: 'End date is required' })}
                    type="date"
                    id="endDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  {errors.endDate && (
                    <p className="mt-2 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Applicable Products & Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Applicable Items</h3>
              <p className="text-sm text-gray-500 mb-4">
                Leave empty to apply to all products
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Products
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {products.map((product) => (
                      <label key={product._id} className="flex items-center space-x-2 p-1">
                        <input
                          {...register('applicableProducts')}
                          type="checkbox"
                          value={product._id}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category._id} className="flex items-center space-x-2">
                        <input
                          {...register('applicableCategories')}
                          type="checkbox"
                          value={category._id}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/offers')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEdit ? 'Update Offer' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateEditOffer;
