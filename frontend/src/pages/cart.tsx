import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';

const CartPage: React.FC = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <Layout title="Shopping Cart - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <Layout title="Shopping Cart - Fresh Grocery Store">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={() => router.push('/products')}
                className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart - Fresh Grocery Store">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Items ({cart.items.length})
                  </h2>
                  
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between border-b border-gray-200 pb-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src="/placeholder-product.png"
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} / {item.unit}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 rounded-l-md"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 rounded-r-md"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-sm font-medium text-gray-900 w-20 text-right">
                            ₹{item.subtotal.toFixed(2)}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <button
                  onClick={() => router.push('/products')}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">$3.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{(cart.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{(cart.total + 59.99 + cart.total * 0.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>

                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800 font-medium">
                        Free delivery on orders over $50
                      </p>
                      <p className="text-xs text-green-600">
                        Add ₹{Math.max(0, 50 - cart.total).toFixed(2)} more for free delivery
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Checkout Badge */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Secure and encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
