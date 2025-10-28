import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  CakeIcon,
  ShieldCheckIcon,
  CogIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CookiesPage: React.FC = () => {
  const cookieCategories = [
    {
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      required: true,
      cookies: [
        {
          name: 'session_token',
          purpose: 'Maintains user session for secure login',
          duration: 'Session'
        },
        {
          name: 'csrf_token',
          purpose: 'Prevents cross-site request forgery attacks',
          duration: 'Session'
        },
        {
          name: 'cart_items',
          purpose: 'Stores shopping cart contents',
          duration: '30 days'
        }
      ]
    },
    {
      title: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      required: false,
      cookies: [
        {
          name: '_ga',
          purpose: 'Google Analytics - tracks website usage',
          duration: '2 years'
        },
        {
          name: '_gid',
          purpose: 'Google Analytics - identifies user sessions',
          duration: '24 hours'
        },
        {
          name: 'user_journey',
          purpose: 'Tracks user navigation patterns',
          duration: '30 days'
        }
      ]
    },
    {
      title: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
      required: false,
      cookies: [
        {
          name: 'marketing_id',
          purpose: 'Personalized advertising recommendations',
          duration: '90 days'
        },
        {
          name: 'retargeting_pixel',
          purpose: 'Shows relevant product recommendations',
          duration: '60 days'
        }
      ]
    },
    {
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      required: false,
      cookies: [
        {
          name: 'user_preferences',
          purpose: 'Remembers your settings and preferences',
          duration: '1 year'
        },
        {
          name: 'location_data',
          purpose: 'Stores delivery location preferences',
          duration: '30 days'
        },
        {
          name: 'language',
          purpose: 'Remembers your language preference',
          duration: '1 year'
        }
      ]
    }
  ];

  const cookieSettings = [
    { category: 'Essential Cookies', enabled: true, canDisable: false },
    { category: 'Analytics Cookies', enabled: true, canDisable: true },
    { category: 'Marketing Cookies', enabled: false, canDisable: true },
    { category: 'Functional Cookies', enabled: true, canDisable: true }
  ];

  return (
    <Layout title="Cookie Policy - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <CakeIcon className="mx-auto h-16 w-16 text-primary-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Cookie Policy
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We use cookies to enhance your browsing experience, serve personalized content,
                and analyze our traffic. Learn about what cookies we use and how to manage them.
              </p>
            </div>
          </div>
        </div>

        {/* What are Cookies */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What are Cookies?</h2>
              <p className="text-gray-600 mb-6">
                Cookies are small text files that are stored on your computer or mobile device when you visit our website.
                They help us provide you with a better browsing experience by remembering your preferences and understanding
                how you use our site.
              </p>
              <p className="text-gray-600 mb-6">
                Cookies can be categorized as essential, analytics, marketing, or functional. Essential cookies are required
                for the website to function properly, while others enhance your experience but are optional.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Your Privacy Matters</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      We are committed to protecting your privacy and only use cookies in ways that comply with data protection laws.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Use Cookies</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Essential Functionality</h3>
                    <p className="text-gray-600">Keep you logged in and maintain your shopping cart</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics & Performance</h3>
                    <p className="text-gray-600">Understand how our website is used to improve user experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalization</h3>
                    <p className="text-gray-600">Remember your preferences and show relevant content</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing</h3>
                    <p className="text-gray-600">Show you relevant advertisements and promotions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cookie Categories */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Cookie Categories</h2>
              <p className="mt-4 text-lg text-gray-600">
                Detailed information about each type of cookie we use
              </p>
            </div>

            <div className="space-y-8">
              {cookieCategories.map((category) => (
                <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                      {category.required && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-4 font-semibold text-gray-900">Cookie Name</th>
                            <th className="text-left py-2 px-4 font-semibold text-gray-900">Purpose</th>
                            <th className="text-left py-2 px-4 font-semibold text-gray-900">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.cookies.map((cookie) => (
                            <tr key={cookie.name} className="border-b border-gray-100">
                              <td className="py-3 px-4 text-gray-900 font-mono text-sm">{cookie.name}</td>
                              <td className="py-3 px-4 text-gray-600">{cookie.purpose}</td>
                              <td className="py-3 px-4 text-gray-600">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cookie Settings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <CogIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Manage Cookie Settings</h2>
            </div>

            <p className="text-gray-600 mb-8">
              You can control which cookies we use on our website. Essential cookies cannot be disabled
              as they are required for the website to function properly.
            </p>

            <div className="space-y-4">
              {cookieSettings.map((setting) => (
                <div key={setting.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{setting.category}</h3>
                    <p className="text-sm text-gray-600">
                      {setting.canDisable ? 'Optional - you can disable these cookies' : 'Required - cannot be disabled'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {setting.canDisable ? (
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.enabled ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">Always On</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Save Preferences
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Accept All Cookies
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Reject All Optional Cookies
              </button>
            </div>
          </div>
        </div>

        {/* Third Party Cookies */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Third-Party Cookies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Google Analytics</h3>
                <p className="text-gray-600 mb-4">
                  We use Google Analytics to understand how visitors interact with our website.
                  This helps us improve our services and user experience.
                </p>
                <div className="text-sm text-gray-500">
                  Privacy Policy: <button className="text-primary-600 hover:text-primary-700">Google Privacy Policy</button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Processors</h3>
                <p className="text-gray-600 mb-4">
                  When you make a purchase, our payment partners may set cookies to ensure
                  secure transactions and prevent fraud.
                </p>
                <div className="text-sm text-gray-500">
                  Includes: Stripe, Razorpay, and other payment providers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-primary-50 rounded-lg p-8 text-center">
            <EyeIcon className="mx-auto h-12 w-12 text-primary-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have any questions about our cookie policy or how we use cookies,
              please don't hesitate to contact our privacy team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Contact Privacy Team
              </button>
              <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                View Privacy Policy
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Banner Preview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Cookie Banner</h2>
          <div className="bg-gray-900 text-white rounded-lg p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">🍪 We use cookies</h3>
                <p className="text-gray-300 text-sm">
                  We use cookies to enhance your experience on our website. By continuing to browse,
                  you agree to our use of cookies.
                </p>
              </div>
              <button className="text-gray-400 hover:text-white ml-4">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700 transition-colors">
                Accept All
              </button>
              <button className="border border-gray-600 text-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                Manage Settings
              </button>
              <button className="border border-gray-600 text-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                Reject All
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            This is a preview of the cookie banner that appears when you first visit our website.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CookiesPage;
