import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ShippingPage: React.FC = () => {
  const shippingOptions = [
    {
      name: 'Standard Delivery',
      time: '2-3 business days',
      cost: '₹49',
      description: 'Perfect for non-urgent orders',
      features: ['Free on orders above ₹500', 'Real-time tracking', 'Contactless delivery']
    },
    {
      name: 'Express Delivery',
      time: 'Next business day',
      cost: '₹99',
      description: 'For urgent requirements',
      features: ['Same-day cutoff: 2 PM', 'Priority handling', 'Dedicated delivery partner']
    },
    {
      name: 'Same Day Delivery',
      time: 'Same day (select areas)',
      cost: '₹149',
      description: 'Available in metro cities',
      features: ['Order before 12 PM', 'Limited areas', 'Premium service']
    }
  ];

  const deliveryAreas = [
    'Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune',
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Goa', 'Coimbatore'
  ];

  return (
    <Layout title="Shipping Information - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <TruckIcon className="mx-auto h-16 w-16 text-primary-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Shipping & Delivery
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Fast, reliable, and hygienic delivery of fresh groceries to your doorstep.
                Choose from multiple delivery options to suit your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Delivery Options</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the delivery option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingOptions.map((option) => (
              <div key={option.name} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-8 w-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{option.name}</h3>
                    <p className="text-primary-600 font-medium">{option.cost}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <p className="text-sm font-medium text-gray-900 mb-3">Delivery: {option.time}</p>
                <ul className="space-y-2">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <MapPinIcon className="mx-auto h-12 w-12 text-primary-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Service Areas</h2>
              <p className="mt-4 text-lg text-gray-600">
                We deliver fresh groceries across major cities in India
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {deliveryAreas.map((area) => (
                <div key={area} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <span className="text-gray-900 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Policy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Policy</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-6 w-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-gray-600 mt-1">
                      Orders are processed within 2-4 hours during business hours.
                      You will receive an email confirmation with tracking details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Free Shipping</h3>
                    <p className="text-gray-600 mt-1">
                      Enjoy free standard delivery on all orders above ₹500.
                      Additional charges may apply for remote locations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <TruckIcon className="h-6 w-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Partners</h3>
                    <p className="text-gray-600 mt-1">
                      We partner with certified delivery services to ensure your
                      groceries arrive fresh and on time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Notes</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Delivery Guidelines</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Please ensure someone is available to receive the delivery</li>
                  <li>• Keep your phone accessible for delivery coordination</li>
                  <li>• Check products immediately upon delivery</li>
                  <li>• Report any issues within 24 hours of delivery</li>
                  <li>• Perishable items should be refrigerated immediately</li>
                </ul>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Contact Support</h3>
                <p className="text-blue-700">
                  Need help with your delivery? Contact our support team at{' '}
                  <a href="tel:+919876543210" className="font-medium hover:underline">+91 98765 43210</a> or{' '}
                  email us at <a href="mailto:support@freshgrocery.com" className="font-medium hover:underline">support@freshgrocery.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPage;
