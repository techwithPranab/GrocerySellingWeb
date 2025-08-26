import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CheckoutFormData, PaymentMethod } from '@/types';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';
import { CreditCardIcon, BanknotesIcon, DevicePhoneMobileIcon, WalletIcon } from '@heroicons/react/24/outline';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>();

  // Populate address from user profile
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await apiClient.get('/user/address');
        if (response.data) {
          setValue('deliveryAddress.type', response.data.type || 'home');
          setValue('deliveryAddress.street', response.data.street || '');
          setValue('deliveryAddress.city', response.data.city || '');
          setValue('deliveryAddress.state', response.data.state || '');
          setValue('deliveryAddress.zipCode', response.data.zipCode || '');
        }
      } catch (error) {
        console.error('Failed to fetch user address:', error);
      }
    };

    if (user) {
      fetchUserAddress();
    }
  }, [user, setValue]);

  const paymentMethods: { value: PaymentMethod; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'cod', label: 'Cash on Delivery', icon: BanknotesIcon },
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCardIcon },
    { value: 'upi', label: 'UPI Payment', icon: DevicePhoneMobileIcon },
    { value: 'wallet', label: 'Digital Wallet', icon: WalletIcon },
  ];

  const deliverySlots = [
    { date: '2024-01-20', timeSlot: '9:00 AM - 12:00 PM' },
    { date: '2024-01-20', timeSlot: '12:00 PM - 3:00 PM' },
    { date: '2024-01-20', timeSlot: '3:00 PM - 6:00 PM' },
    { date: '2024-01-21', timeSlot: '9:00 AM - 12:00 PM' },
    { date: '2024-01-21', timeSlot: '12:00 PM - 3:00 PM' },
    { date: '2024-01-21', timeSlot: '3:00 PM - 6:00 PM' },
  ];

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsPlacingOrder(true);

      // Parse deliverySlot from string format to object
      const deliverySlotString = data.deliverySlot as unknown as string;
      const [date, timeSlot] = deliverySlotString.split('|');
      const deliverySlotObj = { date, timeSlot };

      const orderResponse = await apiClient.post('/orders/checkout', {
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        deliverySlot: deliverySlotObj,
        notes: data.notes,
        offerCode: data.offerCode,
      });

      // Clear cart and redirect to success page
      await clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${orderResponse.order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <Layout title="Checkout - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout - Fresh Grocery Store">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        id="address-type"
                        {...register('deliveryAddress.type', { required: 'Address type is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select type</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.deliveryAddress?.type && (
                        <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.type.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        id="street-address"
                        type="text"
                        {...register('deliveryAddress.street', { required: 'Street address is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="123 Main Street"
                      />
                      {errors.deliveryAddress?.street && (
                        <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.street.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        {...register('deliveryAddress.city', { required: 'City is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="New York"
                      />
                      {errors.deliveryAddress?.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        {...register('deliveryAddress.state', { required: 'State is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="NY"
                      />
                      {errors.deliveryAddress?.state && (
                        <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="zip-code" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        id="zip-code"
                        type="text"
                        {...register('deliveryAddress.zipCode', { required: 'ZIP code is required' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="10001"
                      />
                      {errors.deliveryAddress?.zipCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.deliveryAddress.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery Slot */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Delivery Slot</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliverySlots.map((slot) => (
                      <label key={`${slot.date}-${slot.timeSlot}`} className="relative">
                        <input
                          type="radio"
                          value={`${slot.date}|${slot.timeSlot}`}
                          {...register('deliverySlot', { required: 'Please select a delivery slot' })}
                          className="sr-only"
                        />
                        <div className="border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 peer-checked:border-primary-500 peer-checked:bg-primary-50">
                          <div className="font-medium text-gray-900">{slot.date}</div>
                          <div className="text-sm text-gray-600">{slot.timeSlot}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.deliverySlot && (
                    <p className="text-red-600 text-sm mt-2">{errors.deliverySlot.message}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <label key={method.value} className="relative">
                          <input
                            type="radio"
                            value={method.value}
                            {...register('paymentMethod', { required: 'Please select a payment method' })}
                            className="sr-only"
                          />
                          <div className="border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-50 peer-checked:border-primary-500 peer-checked:bg-primary-50 flex items-center">
                            <IconComponent className="h-5 w-5 text-gray-600 mr-3" />
                            <span className="font-medium text-gray-900">{method.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-600 text-sm mt-2">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Additional Options */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Options</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="offer-code" className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Code (Optional)
                      </label>
                      <input
                        id="offer-code"
                        type="text"
                        {...register('offerCode')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter offer code"
                      />
                    </div>

                    <div>
                      <label htmlFor="delivery-notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        id="delivery-notes"
                        {...register('notes')}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {cart.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-gray-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-medium">₹{item.subtotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">₹59.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{(cart.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">
                          ₹{(cart.total + 59.99 + cart.total * 0.08).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full mt-6 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      🔒 Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
