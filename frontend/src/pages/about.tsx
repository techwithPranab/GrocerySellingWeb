import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  UserGroupIcon, 
  HeartIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  return (
    <Layout title="About Us - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                About Fresh Grocery Store
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We're passionate about bringing you the freshest, highest quality groceries 
                with the convenience of online shopping and reliable home delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              To revolutionize grocery shopping by providing fresh, quality products with 
              exceptional service, making healthy living accessible and convenient for everyone.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We source only the finest products from trusted suppliers and local farms, 
                ensuring freshness and quality in every order.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to providing exceptional 
                service and support every step of the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery and flexible scheduling options to fit your busy lifestyle 
                without compromising on freshness.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Safety</h3>
              <p className="text-gray-600">
                Secure payments, food safety protocols, and transparent practices 
                you can rely on for your family's wellbeing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Committed to eco-friendly practices, supporting local communities, 
                and reducing environmental impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building stronger communities by supporting local farmers, suppliers, 
                and providing employment opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Fresh Grocery Store was founded in 2020 with a simple vision: make high-quality, 
                    fresh groceries accessible to everyone through the convenience of online shopping. 
                    What started as a small local operation has grown into a trusted grocery delivery 
                    service serving thousands of families.
                  </p>
                  <p>
                    Our founders, passionate about healthy living and community support, recognized 
                    the need for a grocery service that prioritizes quality, freshness, and customer 
                    satisfaction. They partnered with local farms and suppliers to create a supply 
                    chain that benefits both customers and the community.
                  </p>
                  <p>
                    Today, we continue to expand our offerings while maintaining our core values: 
                    quality products, exceptional service, and community support. Every order is 
                    carefully prepared by our dedicated team who shares our commitment to excellence.
                  </p>
                </div>
              </div>
              <div className="lg:pl-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">By the Numbers</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">50,000+</div>
                      <div className="text-sm text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">500,000+</div>
                      <div className="text-sm text-gray-600">Orders Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">200+</div>
                      <div className="text-sm text-gray-600">Local Suppliers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">24/7</div>
                      <div className="text-sm text-gray-600">Customer Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Leadership Team</h2>
            <p className="mt-4 text-lg text-gray-600">
              Passionate leaders dedicated to bringing you the best grocery shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-primary-600 mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                15+ years in retail and e-commerce, passionate about sustainable food systems.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Michael Chen</h3>
              <p className="text-primary-600 mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                Technology expert focused on creating seamless digital experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Emily Rodriguez</h3>
              <p className="text-primary-600 mb-2">Head of Operations</p>
              <p className="text-sm text-gray-600">
                Supply chain specialist ensuring fresh products reach your door on time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">David Thompson</h3>
              <p className="text-primary-600 mb-2">Head of Customer Experience</p>
              <p className="text-sm text-gray-600">
                Dedicated to ensuring every customer interaction exceeds expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Our Commitment to You</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">100% Satisfaction</h3>
                  <p className="text-primary-100">
                    If you're not completely satisfied, we'll make it right with a full refund or replacement.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Freshness Guarantee</h3>
                  <p className="text-primary-100">
                    All perishable items are quality-checked before delivery to ensure maximum freshness.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Community Support</h3>
                  <p className="text-primary-100">
                    We support local farmers and suppliers, contributing to stronger communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions or want to learn more about our company? We'd love to hear from you.
            </p>
            <div className="space-x-4">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Contact Us
              </a>
              <a
                href="/help"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
