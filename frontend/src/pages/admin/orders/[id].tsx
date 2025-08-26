import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layout/AdminLayout';
import api from '@/utils/api';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PrinterIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: string;
  deliverySlot: {
    date: string;
    timeSlot: string;
  };
  notes: string;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderUpdateForm {
  status: string;
  adminNotes: string;
}

const OrderView: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<OrderUpdateForm>();

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/admin/orders/${id}`);
      setOrder(response.data);
      reset({
        status: response.data.status,
        adminNotes: response.data.adminNotes || ''
      });
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (data: OrderUpdateForm) => {
    try {
      setUpdating(true);
      await api.put(`/admin/orders/${id}`, data);
      toast.success('Order updated successfully!');
      setOrder(prev => prev ? { 
        ...prev, 
        status: data.status as typeof prev.status, 
        adminNotes: data.adminNotes 
      } : null);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update order');
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const markAsPacked = async () => {
    try {
      setUpdating(true);
      await api.put(`/admin/orders/${id}`, { status: 'packed' });
      toast.success('Order marked as packed!');
      setOrder(prev => prev ? { ...prev, status: 'packed' } : null);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const generateInvoice = () => {
    if (!order) return;

    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info, .order-info { width: 45%; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f2f2f2; }
          .total-section { text-align: right; margin-top: 20px; }
          .total { font-size: 18px; font-weight: bold; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fresh Grocery Store</h1>
          <p>Invoice</p>
        </div>
        
        <div class="invoice-info">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${order.userId.name}</strong></p>
            <p>${order.userId.email}</p>
            <p>${order.userId.phone}</p>
            <p>${order.deliveryAddress}</p>
          </div>
          <div class="order-info">
            <h3>Order Details:</h3>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.productId.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <p class="total">Total Amount: ₹${order.totalAmount.toFixed(2)}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'confirmed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'packed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'shipped': return <TruckIcon className="h-5 w-5" />;
      case 'delivered': return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <button
              onClick={() => router.push('/admin/orders')}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/orders')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateInvoice}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Generate Invoice
            </button>
            {order.status !== 'packed' && order.status !== 'delivered' && (
              <button
                onClick={markAsPacked}
                disabled={updating}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Mark as Packed
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Order'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{order.userId.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{order.userId.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{order.userId.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={item.productId.image || '/images/placeholder.jpg'}
                              alt={item.productId.name}
                              className="h-10 w-10 rounded-md object-cover mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.productId.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status & Notes */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Delivery Slot</p>
                <p className="text-sm text-gray-900">
                  {new Date(order.deliverySlot.date).toLocaleDateString()} - {order.deliverySlot.timeSlot}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order</h3>
                <form onSubmit={handleSubmit(updateOrder)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status', { required: 'Status is required' })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      {...register('adminNotes')}
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Add notes about this order..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Order'}
                  </button>
                </form>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
              
              {order.notes && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500">Customer Notes:</p>
                  <p className="text-sm text-gray-900 mt-1">{order.notes}</p>
                </div>
              )}
              
              {order.adminNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Admin Notes:</p>
                  <p className="text-sm text-gray-900 mt-1">{order.adminNotes}</p>
                </div>
              )}
              
              {!order.notes && !order.adminNotes && (
                <p className="text-sm text-gray-500">No notes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderView;
