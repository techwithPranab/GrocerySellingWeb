import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useForm } from 'react-hook-form';
import { MagnifyingGlassIcon, CheckCircleIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline';

interface TrackOrderFormData {
  orderNumber: string;
  email?: string;
}

interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
  timeline: Array<{
    status: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }>;
}

const TrackOrder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TrackOrderFormData>();

  const onSubmit = async (data: TrackOrderFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setOrderStatus(null);
      // Replace with actual API call
      console.log('Tracking order with data:', data);
      const apiClient = (await import('@/lib/api')).default;
      const response = await apiClient.get(`/orders/track?orderNumber=${encodeURIComponent(data.orderNumber)}${data.email ? `&email=${encodeURIComponent(data.email)}` : ''}`);
      if (response && response.order) {
        setOrderStatus(response.order);
      } else {
        setError('Order not found. Please check your order number and try again.');
      }
    } catch (err) {
        setError('Failed to track order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    }
    
    switch (status) {
      case 'Out for Delivery':
        return <TruckIcon className="h-6 w-6 text-primary-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Layout title="Track Your Order - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Track Your Order
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Enter your order number to check the status of your delivery
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Track Order Form */}
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                    Order Number *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('orderNumber', { required: 'Order number is required' })}
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your order number (e.g., 12345)"
                    />
                  </div>
                  {errors.orderNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.orderNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      {...register('email', {
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  {isLoading ? 'Tracking...' : 'Track Order'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Order Status */}
          {orderStatus && (
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderStatus.status)}`}>
                    {formatStatus(orderStatus.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                    <p className="text-lg font-semibold text-gray-900">#{orderStatus.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p className="text-lg text-gray-900">{formatDate(orderStatus.orderDate)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                    <p className="text-lg text-gray-900">{formatDate(orderStatus.estimatedDelivery)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                    <p className="text-lg font-semibold text-gray-900">₹{orderStatus.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                  <p className="text-gray-900">{orderStatus.deliveryAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {orderStatus.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Timeline</h2>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {orderStatus.timeline.map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== orderStatus.timeline.length - 1 ? (
                            <span
                              className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                                event.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>{getStatusIcon(event.status, event.completed)}</div>
                            <div className="flex-1 min-w-0">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{event.status}</p>
                                <p className="text-sm text-gray-500">{event.description}</p>
                                {event.timestamp && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(event.timestamp)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
            <p className="mt-2 text-gray-600">
              If you have any questions about your order, don't hesitate to contact us.
            </p>
            <div className="mt-4 space-x-4">
              <a
                href="/contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Contact Support
              </a>
              <a
                href="tel:1-800-GROCERY"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
