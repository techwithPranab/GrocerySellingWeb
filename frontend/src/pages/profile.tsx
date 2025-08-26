import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import {
  UserIcon,
  MapPinIcon,
  KeyIcon,
  ChartBarIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface AddressData {
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategory: string;
  memberSince: string;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, refreshUser, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);

  const profileForm = useForm<ProfileData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const addressForm = useForm<AddressData>({
    defaultValues: {
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    }
  });

  const passwordForm = useForm<PasswordData>();

  useEffect(() => {
    fetchUserStats();
    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, profileForm]);

  const fetchUserStats = async () => {
    try {
      const response = await apiClient.get('/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await apiClient.get('/user/address');
      if (response.data) {
        addressForm.reset(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user address:', error);
    }
  };

  const updateProfile = async (data: ProfileData) => {
    try {
      setLoading(true);
      await apiClient.put('/user/profile', data);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (data: AddressData) => {
    try {
      setLoading(true);
      await apiClient.put('/user/address', data);
      toast.success('Address updated successfully');
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: PasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await apiClient.put('/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'address', name: 'Address', icon: MapPinIcon },
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'stats', name: 'Statistics', icon: ChartBarIcon },
  ];

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return (
      <Layout title="My Profile - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout title="My Profile - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
            <button
              onClick={() => router.push('/login')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile - Fresh Grocery Store">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
                    <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            {...profileForm.register('name', { required: 'Name is required' })}
                            id="profile-name"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            {...profileForm.register('email', { required: 'Email is required' })}
                            id="profile-email"
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            {...profileForm.register('phone')}
                            id="profile-phone"
                            type="tel"
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
                          {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'address' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Delivery Address</h2>
                    <form onSubmit={addressForm.handleSubmit(updateAddress)} className="space-y-6">
                      <div>
                        <label htmlFor="address-type" className="block text-sm font-medium text-gray-700">Address Type</label>
                        <select
                          {...addressForm.register('type', { required: 'Address type is required' })}
                          id="address-type"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="address-street" className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          {...addressForm.register('street', { required: 'Street address is required' })}
                          id="address-street"
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="address-city" className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            {...addressForm.register('city', { required: 'City is required' })}
                            id="address-city"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="address-state" className="block text-sm font-medium text-gray-700">State</label>
                          <input
                            {...addressForm.register('state', { required: 'State is required' })}
                            id="address-state"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="address-zip" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                          <input
                            {...addressForm.register('zipCode', { required: 'ZIP code is required' })}
                            id="address-zip"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="address-country" className="block text-sm font-medium text-gray-700">Country</label>
                          <select
                            {...addressForm.register('country', { required: 'Country is required' })}
                            id="address-country"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          >
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Address'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-6">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
                          id="current-password"
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          {...passwordForm.register('newPassword', { 
                            required: 'New password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                          })}
                          id="new-password"
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          {...passwordForm.register('confirmPassword', { required: 'Please confirm your password' })}
                          id="confirm-password"
                          type="password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Your Statistics</h2>
                    {stats ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <ChartBarIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <p className="text-sm font-medium text-blue-800">Total Orders</p>
                              <p className="text-2xl font-bold text-blue-900">{stats.totalOrders}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <CreditCardIcon className="h-5 w-5 text-green-600" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <p className="text-sm font-medium text-green-800">Total Spent</p>
                              <p className="text-2xl font-bold text-green-900">₹{stats.totalSpent}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <BellIcon className="h-5 w-5 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <p className="text-sm font-medium text-purple-800">Favorite Category</p>
                              <p className="text-lg font-bold text-purple-900 capitalize">{stats.favoriteCategory}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <p className="text-sm font-medium text-indigo-800">Member Since</p>
                              <p className="text-lg font-bold text-indigo-900">{stats.memberSince}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Loading statistics...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
