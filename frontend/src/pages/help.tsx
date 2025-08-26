import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You\'ll need to provide delivery details and payment information to complete your order.'
  },
  {
    id: 2,
    category: 'Orders',
    question: 'Can I modify or cancel my order?',
    answer: 'You can modify or cancel your order within 30 minutes of placing it. Go to "My Orders" section and look for the modify/cancel option. After this window, orders enter preparation and cannot be changed.'
  },
  {
    id: 3,
    category: 'Delivery',
    question: 'What are your delivery hours?',
    answer: 'We deliver Monday to Sunday from 8:00 AM to 10:00 PM. Same-day delivery is available for orders placed before 6:00 PM, subject to availability in your area.'
  },
  {
    id: 4,
    category: 'Delivery',
    question: 'How much does delivery cost?',
    answer: 'Delivery is free for orders above $50. For orders below $50, we charge a $5 delivery fee. Express delivery (within 2 hours) is available for an additional $10.'
  },
  {
    id: 5,
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery for select areas.'
  },
  {
    id: 6,
    category: 'Payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete card details on our servers and comply with PCI DSS standards.'
  },
  {
    id: 7,
    category: 'Products',
    question: 'How do you ensure product freshness?',
    answer: 'We source products daily from certified suppliers and maintain strict cold chain management. All perishable items are stored in temperature-controlled environments and checked for quality before delivery.'
  },
  {
    id: 8,
    category: 'Products',
    question: 'What if I receive a damaged or expired product?',
    answer: 'If you receive a damaged or expired product, please contact our customer service immediately. We offer full refunds or replacements for such items with no questions asked.'
  },
  {
    id: 9,
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Click on "Sign Up" at the top of our website, fill in your details including name, email, phone number, and create a password. You\'ll receive a verification email to activate your account.'
  },
  {
    id: 10,
    category: 'Account',
    question: 'I forgot my password. How can I reset it?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
  }
];

const categories = ['All', 'Orders', 'Delivery', 'Payment', 'Products', 'Account'];

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <Layout title="Help Center - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                How can we help you?
              </h1>
              <p className="mt-4 text-xl text-primary-100">
                Find answers to your questions or get in touch with our support team
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 text-gray-900"
                    placeholder="Search for help articles..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/track-order" className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                    Track Your Order
                  </h3>
                  <p className="text-sm text-gray-500">Check your order status</p>
                </div>
              </div>
            </Link>

            <Link href="/return-policy" className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">↩️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                    Returns & Refunds
                  </h3>
                  <p className="text-sm text-gray-500">Learn about our return policy</p>
                </div>
              </div>
            </Link>

            <Link href="/contact" className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">💬</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                    Contact Support
                  </h3>
                  <p className="text-sm text-gray-500">Get in touch with us</p>
                </div>
              </div>
            </Link>

            <div className="group bg-gray-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">📞</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Call Us
                  </h3>
                  <p className="text-sm text-gray-500">1-800-GROCERY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Find quick answers to common questions
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-gray-50 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No matching questions found. Try a different search term or category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Still need help?</h3>
              <p className="mt-4 text-lg text-gray-600">
                Our customer support team is here to help you 24/7
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Contact Support
                </Link>
                <a
                  href="tel:1-800-GROCERY"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
