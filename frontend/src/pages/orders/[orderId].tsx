import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import { 
  ClockIcon, 
  CheckIcon, 
  TruckIcon, 
  XMarkIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const OrderDetailsPage: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch order from API
  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await import('@/lib/api').then(mod => mod.default.get(`/orders/${id}`));
      setOrder(response.order || null);
    } catch (error) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!orderId) {
      return;
    }
    fetchOrder(orderId as string);
  }, [isAuthenticated, orderId, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
      case 'packed':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'out_for_delivery':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'delivered':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XMarkIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
      case 'packed':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Layout title="Order Details - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout title="Order Details - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => router.push('/orders')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              View All Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Order ${order.orderNumber} - Fresh Grocery Store`}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h3>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.status)}
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {formatStatus(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Tracking */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Tracking</h2>
                <div className="space-y-4">
                  {order.trackingUpdates.map((update) => (
                    <div key={`${update.status}-${update.timestamp}`} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(update.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {formatStatus(update.status)}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{update.message}</p>
                        {update.location && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            {update.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.status === 'out_for_delivery' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Your order is on the way!
                        </p>
                        <p className="text-sm text-blue-600">
                          Expected delivery: {new Date(order.estimatedDelivery!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src="/placeholder-product.png"
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            ₹{item.price.toFixed(2)} per {item.unit} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Add Review Button for delivered orders */}
                {order.status === 'delivered' && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Rate your experience</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={`review-${item.productId}`} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.name}</span>
                          <button
                            onClick={() => router.push(`/review/add?productId=${item.productId}&orderId=${order._id}`)}
                            className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 transition-colors"
                          >
                            Write Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.deliveryAddress.street}<br />
                        {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Delivery Slot</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.deliverySlot.date} • {order.deliverySlot.timeSlot}
                      </p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="flex items-start space-x-3">
                      <div className="h-5 w-5 flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 bg-gray-600 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Delivery Notes</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-base font-semibold text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.paymentMethod.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: <span className="capitalize">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    View All Orders
                  </button>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => router.push(`/track-order?orderNumber=${order.orderNumber}`)}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Track Order
                    </button>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Need help with your order?</p>
                    <button
                      onClick={() => router.push('/contact')}
                      className="w-full flex items-center justify-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetailsPage;
