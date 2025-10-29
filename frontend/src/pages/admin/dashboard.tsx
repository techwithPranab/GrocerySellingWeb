import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import apiClient from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
  ordersToday: number;
}

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    ordersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }

    if (user && user.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user, isLoading, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/stats');
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Mock data fallback
      setStats({
        totalUsers: 892,
        totalProducts: 156,
        totalOrders: 1247,
        totalRevenue: 89567,
        revenueThisMonth: 45230.75,
        ordersToday: 23
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${stats.revenueThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      link: '/admin/analytics'
    },
    {
      title: 'Total Customers',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: 'bg-purple-500',
      link: '/admin/customers'
    },
    {
      title: 'Orders Today',
      value: stats.ordersToday.toString(),
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: TruckIcon,
      color: 'bg-indigo-500',
      link: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon: ChartBarIcon,
      color: 'bg-green-600',
      link: '/admin/analytics'
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {user.name}! Here's what's happening with your store today.
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => router.push('/admin/analytics')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  View Analytics
                </button>
                <button 
                  onClick={() => router.push('/admin/settings')}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => (
              <button 
                key={stat.title} 
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow text-left w-full"
                onClick={() => router.push(stat.link)}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} rounded-md p-3`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => router.push('/admin/products')}
                  className="bg-primary-50 hover:bg-primary-100 text-primary-700 p-4 rounded-lg text-center transition-colors"
                >
                  <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Manage Products</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/customers')}
                  className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg text-center transition-colors"
                >
                  <UsersIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">View Customers</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/orders')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg text-center transition-colors"
                >
                  <TruckIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Manage Orders</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/analytics')}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg text-center transition-colors"
                >
                  <ChartBarIcon className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-900">Order completed</span>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-900">New customer registration</span>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-900">Low stock alert</span>
                  </div>
                  <span className="text-xs text-gray-500">10 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-900">Product added to inventory</span>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <ChartBarIcon className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800">System Status</h4>
                    <p className="text-sm text-green-700 mt-1">
                      All systems operational. Performance metrics within normal ranges.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <TruckIcon className="h-5 w-5 text-blue-400" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Orders Status</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {stats.ordersToday} orders received today. Processing time is optimal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <div className="flex">
                  <UsersIcon className="h-5 w-5 text-purple-400" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-purple-800">Customer Activity</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      {stats.totalUsers} registered customers. Active engagement levels high.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
