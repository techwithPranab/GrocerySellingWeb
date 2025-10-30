import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Order, OrderStatus } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  CheckIcon,
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type AdminOrder = {
  _id: string;
  orderNumber: string;
  userId: {
    name: string;
    email?: string;
    phone?: string;
  } | string;
  items: Array<any>;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/orders');
      setOrders(response.orders || []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.userId?.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="Orders - Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders - Admin Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">Manage customer orders and delivery status</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.userId && typeof order.userId === 'object' && order.userId.name ? order.userId.name : 'Guest Customer'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value as OrderStatus)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="packed">Packed</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'No orders found matching your criteria.'
                  : 'No orders found.'
                }
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Delivered</div>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Revenue</div>
            <div className="text-2xl font-bold text-blue-600">
              ₹{orders.filter(o => o.status === 'delivered')
                      .reduce((sum, o) => sum + o.total, 0)
                      .toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
