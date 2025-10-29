import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import MultipleImageUpload from '@/components/common/MultipleImageUpload';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  unit: string;
  images: { url: string; publicId?: string; alt?: string }[];
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
  expiryDays?: number;
}

const ProductEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ProductFormData>();

  // Generate slug from product name for folder structure
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      .replace(/[^a-z0-9]+/g, '-')
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      .replace(/(?:^-+|-+$)/g, '');
  };

  // Get product slug for current product
  const getProductSlug = () => {
    const productName = watch('name') || currentProduct?.name || 'unknown-product';
    return generateSlug(productName);
  };

  const categories = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat & Seafood' },
    { value: 'grains', label: 'Grains & Pulses' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'household', label: 'Household' }
  ];

  const units = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'l', label: 'Litre' },
    { value: 'ml', label: 'Millilitre' },
    { value: 'piece', label: 'Piece' },
    { value: 'pack', label: 'Pack' }
  ];

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setInitialLoading(true);
      const response = await apiClient.get(`/admin/products/${productId}`);
      const product = response.product || response.data || response;
      
      // Store the current product data
      setCurrentProduct(product);
      
      // Convert tags string to array if needed
      let tagsString = '';
      if (Array.isArray(product.tags)) {
        tagsString = product.tags.join(', ');
      } else if (typeof product.tags === 'string') {
        tagsString = product.tags;
      }
      
      reset({
        ...product,
        tags: tagsString,
        images: product.images || [{ url: '', alt: '' }]
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      
      // Convert tags string to array
      const tagsArray = data.tags
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];

      const productData = {
        ...data,
        tags: tagsArray,
        images: data.images.filter(img => img.url) // Remove empty images
      };

      await apiClient.put(`/admin/products/${id}`, productData);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information with Cloudinary image upload</p>
          </div>
        </div>

        {/* Cloudinary Setup Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Cloudinary Integration Setup</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>To enable image uploads, configure your Cloudinary settings in <code className="bg-blue-100 px-1 rounded">.env.local</code>:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> - Your Cloudinary cloud name</li>
                  <li><code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> - Your unsigned upload preset</li>
                </ul>
                <p className="mt-2">
                  Create an unsigned upload preset in your Cloudinary dashboard for this to work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  id="category"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit *
                </label>
                <select
                  {...register('unit', { required: 'Unit is required' })}
                  id="unit"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-2 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  type="number"
                  step="0.01"
                  id="price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  {...register('stock', { 
                    required: 'Stock is required',
                    min: { value: 0, message: 'Stock must be positive' }
                  })}
                  type="number"
                  id="stock"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                {errors.stock && (
                  <p className="mt-2 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700">
                  Expiry Days (optional)
                </label>
                <input
                  {...register('expiryDays')}
                  type="number"
                  id="expiryDays"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  {...register('tags')}
                  type="text"
                  id="tags"
                  placeholder="organic, fresh, local"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Images Section */}
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-4">
                Product Images
              </div>
              <MultipleImageUpload
                currentImages={watch('images') || []}
                onImagesChange={(images) => setValue('images', images)}
                productSlug={getProductSlug()}
                maxImages={8}
                className="mb-6"
              />
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  id="isActive"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active (visible to customers)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  {...register('isFeatured')}
                  type="checkbox"
                  id="isFeatured"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
