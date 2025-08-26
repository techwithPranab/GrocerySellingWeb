import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/utils/api';
import { 
  ChartBarIcon, 
  CurrencyRupeeIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  revenue: {
    today: number;
    thisMonth: number;
    lastMonth: number;
  };
  orders: {
    today: number;
    thisMonth: number;
    lastMonth: number;
  };
  customers: {
    total: number;
    active: number;
    new: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  dailySales: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  change?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-lg font-medium text-gray-900">{value}</dd>
        </dl>
      </div>
    </div>
    {change && (
      <div className="mt-3 flex items-center text-sm">
        {change > 0 ? (
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
          {Math.abs(change)}% from last period
        </span>
      </div>
    )}
  </div>
);

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/admin/analytics?range=${dateRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Mock data for demo
      setAnalytics({
        revenue: { today: 25000, thisMonth: 750000, lastMonth: 680000 },
        orders: { today: 45, thisMonth: 1250, lastMonth: 1100 },
        customers: { total: 5680, active: 2340, new: 120 },
        products: { total: 450, lowStock: 12, outOfStock: 3 },
        topProducts: [
          { id: '1', name: 'Fresh Tomatoes', sales: 234, revenue: 45000 },
          { id: '2', name: 'Organic Milk', sales: 189, revenue: 38000 },
          { id: '3', name: 'Brown Bread', sales: 156, revenue: 25000 },
        ],
        dailySales: [
          { date: '2025-08-18', orders: 32, revenue: 18000 },
          { date: '2025-08-19', orders: 45, revenue: 24000 },
          { date: '2025-08-20', orders: 38, revenue: 21000 },
          { date: '2025-08-21', orders: 52, revenue: 28000 },
          { date: '2025-08-22', orders: 41, revenue: 23000 },
          { date: '2025-08-23', orders: 48, revenue: 26000 },
          { date: '2025-08-24', orders: 45, revenue: 25000 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={`₹${analytics?.revenue.today?.toLocaleString() || 0}`}
            icon={<CurrencyRupeeIcon className="h-6 w-6" />}
            color="text-green-600"
            change={((analytics?.revenue.today || 0) - (analytics?.revenue.lastMonth || 0)) / (analytics?.revenue.lastMonth || 1) * 100}
          />
          <StatCard
            title="Orders Today"
            value={analytics?.orders.today || 0}
            icon={<ShoppingCartIcon className="h-6 w-6" />}
            color="text-blue-600"
            change={((analytics?.orders.today || 0) - (analytics?.orders.lastMonth || 0)) / (analytics?.orders.lastMonth || 1) * 100}
          />
          <StatCard
            title="Total Customers"
            value={analytics?.customers.total || 0}
            icon={<UsersIcon className="h-6 w-6" />}
            color="text-purple-600"
          />
          <StatCard
            title="Products in Stock"
            value={analytics?.products.total || 0}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <div className="space-y-3">
              {analytics?.dailySales?.slice(-7).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">₹{day.revenue.toLocaleString()}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (day.revenue / Math.max(...(analytics?.dailySales?.map(d => d.revenue) || [1]))) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {analytics?.topProducts?.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{product.sales} sold</div>
                    <div className="text-xs text-gray-500">₹{product.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Monthly Revenue</h4>
                <p className="text-2xl font-bold text-blue-600">₹{analytics?.revenue.thisMonth?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-500">
                  vs ₹{analytics?.revenue.lastMonth?.toLocaleString() || 0} last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Active Customers</h4>
                <p className="text-2xl font-bold text-green-600">{analytics?.customers.active || 0}</p>
                <p className="text-sm text-gray-500">
                  {analytics?.customers.new || 0} new this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">Inventory Status</h4>
                <p className="text-2xl font-bold text-orange-600">{analytics?.products.lowStock || 0}</p>
                <p className="text-sm text-gray-500">
                  {analytics?.products.outOfStock || 0} out of stock
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
