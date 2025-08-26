import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ClockIcon, 
  CheckIcon, 
  TruckIcon, 
  XMarkIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');


  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch orders from backend API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/orders');
        setOrders(response.orders || []);
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const getStatusIcon = (status: OrderStatus) => {
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

  const formatStatus = (status: OrderStatus) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Layout title="My Orders - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Orders - Fresh Grocery Store">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <button
              onClick={() => router.push('/products')}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'preparing', label: 'Preparing' },
                  { key: 'out_for_delivery', label: 'Out for Delivery' },
                  { key: 'delivered', label: 'Delivered' },
                  { key: 'cancelled', label: 'Cancelled' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as OrderStatus | 'all')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="max-w-md mx-auto">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No orders with status "${formatStatus(filter)}".`}
                </p>
                <button
                  onClick={() => router.push('/products')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.productId} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src="/placeholder-product.png"
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded-md"
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} {item.unit}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-600">
                          and {order.items.length - 2} more items...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Delivery:</span> {order.deliverySlot.date} • {order.deliverySlot.timeSlot}
                        </p>
                        <p>
                          <span className="font-medium">Payment:</span> {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/orders/${order._id}`)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => router.push(`/track-order?orderNumber=${order.orderNumber}`)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <TruckIcon className="h-4 w-4 mr-1" />
                            Track Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
