import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/utils/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  UserIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  taxRate: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerSignups: boolean;
  dailyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
}

const Settings: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('store');
  const [loading, setLoading] = useState(false);

  const storeForm = useForm<StoreSettings>({
    defaultValues: {
      storeName: 'Fresh Grocery Store',
      storeEmail: 'admin@grocery.com',
      storePhone: '+91 9876543210',
      storeAddress: '123 Market Street, City, State 12345',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      taxRate: 18,
      deliveryFee: 50,
      freeDeliveryThreshold: 500
    }
  });

  const notificationForm = useForm<NotificationSettings>({
    defaultValues: {
      emailNotifications: true,
      orderNotifications: true,
      lowStockAlerts: true,
      customerSignups: false,
      dailyReports: true
    }
  });

  const securityForm = useForm<SecuritySettings>({
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90,
      loginAttempts: 5
    }
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
      return;
    }

    // Only fetch settings if user is confirmed admin
    if (user && user.role === 'admin' && !isLoading) {
      fetchSettings();
    }
  }, [user, isLoading, router]);

  const fetchSettings = async () => {
    // Don't fetch if user is not confirmed as admin
    if (!user || user.role !== 'admin') {
      console.log('⏸️ Skipping settings fetch - user not admin:', user);
      return;
    }
    
    console.log('🚀 Fetching settings for admin user:', user.email);
    try {
      const response = await api.get('/admin/settings');
      console.log('✅ Settings fetched successfully:', response);
      const { store, notifications, security } = response.data;
      storeForm.reset(store);
      notificationForm.reset(notifications);
      securityForm.reset(security);
    } catch (error) {
      console.error('❌ Failed to fetch settings:', error);
    }
  };

  const saveStoreSettings = async (data: StoreSettings) => {
    try {
      setLoading(true);
      await api.put('/admin/settings/store', data);
      toast.success('Store settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save store settings');
      console.error('Error saving store settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async (data: NotificationSettings) => {
    try {
      setLoading(true);
      await api.put('/admin/settings/notifications', data);
      toast.success('Notification settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save notification settings');
      console.error('Error saving notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSecuritySettings = async (data: SecuritySettings) => {
    try {
      setLoading(true);
      await api.put('/admin/settings/security', data);
      toast.success('Security settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save security settings');
      console.error('Error saving security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'store', name: 'Store Settings', icon: BuildingStorefrontIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Store Settings Tab */}
        {activeTab === 'store' && (
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={storeForm.handleSubmit(saveStoreSettings)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Store Name</label>
                  <input
                    {...storeForm.register('storeName', { required: 'Store name is required' })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Store Email</label>
                  <input
                    {...storeForm.register('storeEmail', { required: 'Store email is required' })}
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Store Phone</label>
                  <input
                    {...storeForm.register('storePhone', { required: 'Store phone is required' })}
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    {...storeForm.register('currency')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input
                    {...storeForm.register('taxRate', { required: 'Tax rate is required' })}
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Fee (₹)</label>
                  <input
                    {...storeForm.register('deliveryFee', { required: 'Delivery fee is required' })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Store Address</label>
                  <textarea
                    {...storeForm.register('storeAddress', { required: 'Store address is required' })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Free Delivery Threshold (₹)</label>
                  <input
                    {...storeForm.register('freeDeliveryThreshold', { required: 'Free delivery threshold is required' })}
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={notificationForm.handleSubmit(saveNotificationSettings)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input
                    {...notificationForm.register('emailNotifications')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Order Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                  </div>
                  <input
                    {...notificationForm.register('orderNotifications')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-500">Alert when products are running low</p>
                  </div>
                  <input
                    {...notificationForm.register('lowStockAlerts')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Customer Signups</h3>
                    <p className="text-sm text-gray-500">Notify when new customers register</p>
                  </div>
                  <input
                    {...notificationForm.register('customerSignups')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Daily Reports</h3>
                    <p className="text-sm text-gray-500">Receive daily summary reports</p>
                  </div>
                  <input
                    {...notificationForm.register('dailyReports')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={securityForm.handleSubmit(saveSecuritySettings)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <input
                    {...securityForm.register('twoFactorAuth')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
                    <input
                      {...securityForm.register('sessionTimeout', { required: 'Session timeout is required' })}
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password Expiry (days)</label>
                    <input
                      {...securityForm.register('passwordExpiry', { required: 'Password expiry is required' })}
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Login Attempts</label>
                    <input
                      {...securityForm.register('loginAttempts', { required: 'Login attempts is required' })}
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Settings;
