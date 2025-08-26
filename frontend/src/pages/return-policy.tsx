import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const ReturnPolicy: React.FC = () => {
  return (
    <Layout title="Return Policy - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Return & Refund Policy
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                Your satisfaction is our priority. Learn about our hassle-free return process.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Policy Overview */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Overview</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex">
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">100% Satisfaction Guarantee</h3>
                  <p className="mt-2 text-green-700">
                    We stand behind the quality of our products. If you're not completely satisfied with your order, 
                    we'll make it right with a full refund or replacement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Can Be Returned</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Returnable Items */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <h3 className="ml-2 text-lg font-medium text-green-800">Returnable Items</h3>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li>• Damaged or spoiled fresh produce</li>
                  <li>• Expired products</li>
                  <li>• Incorrect items delivered</li>
                  <li>• Missing items from your order</li>
                  <li>• Products with quality issues</li>
                  <li>• Non-perishable items in original packaging</li>
                </ul>
              </div>

              {/* Non-Returnable Items */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                  <h3 className="ml-2 text-lg font-medium text-red-800">Non-Returnable Items</h3>
                </div>
                <ul className="space-y-2 text-red-700">
                  <li>• Perishable items after 24 hours</li>
                  <li>• Items consumed or used</li>
                  <li>• Custom or personalized orders</li>
                  <li>• Gift cards or digital products</li>
                  <li>• Items damaged by customer</li>
                  <li>• Special order items (by arrangement)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Time Limits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Time Limits</h2>
            
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">Fresh & Perishable Items</h3>
                  <p className="text-blue-700">
                    Report any issues within <strong>24 hours</strong> of delivery for immediate replacement or refund.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">Non-Perishable Items</h3>
                  <p className="text-blue-700">
                    Returns accepted within <strong>7 days</strong> of delivery in original, unopened condition.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">Damaged/Defective Items</h3>
                  <p className="text-blue-700">
                    Report immediately upon delivery or within <strong>2 hours</strong> for fastest resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Return Items</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
                  <p className="text-gray-600">
                    Call us at <a href="tel:1-800-GROCERY" className="text-primary-600">1-800-GROCERY</a> or 
                    use our <a href="/contact" className="text-primary-600">contact form</a> to report the issue.
                    Have your order number ready.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Provide Details</h3>
                  <p className="text-gray-600">
                    Describe the issue and provide photos if possible. Our customer service team will guide you 
                    through the next steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Choose Resolution</h3>
                  <p className="text-gray-600">
                    We'll offer you a replacement, store credit, or full refund based on your preference and 
                    the nature of the issue.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Item Pickup (if required)</h3>
                  <p className="text-gray-600">
                    For non-perishable returns, we'll arrange pickup or provide you with a return label. 
                    Perishable items are typically resolved without requiring return.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <CurrencyDollarIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Method</h3>
                <p className="text-gray-600">
                  Refunds are processed to your original payment method within 3-5 business days.
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <DocumentTextIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Store Credit</h3>
                <p className="text-gray-600">
                  Instant store credit available for faster resolution. Credit never expires.
                </p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <TruckIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Replacement</h3>
                <p className="text-gray-600">
                  Free replacement delivery, usually within 24 hours for perishable items.
                </p>
              </div>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Circumstances</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Weather-Related Issues</h3>
                <p className="text-yellow-700">
                  If severe weather affects your delivery or product quality, we'll work with you to reschedule 
                  or provide appropriate compensation.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Delivery Issues</h3>
                <p className="text-blue-700">
                  If your order is delivered to the wrong address or you're not available to receive perishables, 
                  contact us immediately for a solution.
                </p>
              </div>

              <div className="border-l-4 border-green-400 bg-green-50 p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">Bulk Orders</h3>
                <p className="text-green-700">
                  Large quantity orders may have different return policies. Please contact our business team 
                  for specific arrangements.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help with a Return?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Service</h3>
                <p className="text-gray-600 mb-4">Available 24/7 for immediate assistance</p>
                <a
                  href="tel:1-800-GROCERY"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Call 1-800-GROCERY
                </a>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Online Support</h3>
                <p className="text-gray-600 mb-4">Submit a request through our contact form</p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Contact Form
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> returns@freshgrocery.com | 
                <strong> Response Time:</strong> Within 2-4 hours during business hours
              </p>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              This return policy is effective as of January 1, 2024. We reserve the right to update this policy 
              with advance notice to our customers.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
