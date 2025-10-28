import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  BriefcaseIcon,
  HeartIcon,
  UserGroupIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CareersPage: React.FC = () => {
  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Competitive Salary',
      description: 'Attractive compensation packages with performance bonuses'
    },
    {
      icon: HeartIcon,
      title: 'Health Benefits',
      description: 'Comprehensive health insurance for you and your family'
    },
    {
      icon: ClockIcon,
      title: 'Work-Life Balance',
      description: 'Flexible working hours and remote work options'
    },
    {
      icon: UserGroupIcon,
      title: 'Team Culture',
      description: 'Collaborative and inclusive work environment'
    },
    {
      icon: LightBulbIcon,
      title: 'Learning & Growth',
      description: 'Continuous learning opportunities and career development'
    },
    {
      icon: BriefcaseIcon,
      title: 'Modern Workspace',
      description: 'State-of-the-art office facilities and equipment'
    }
  ];

  const openPositions = [
    {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Remote / Bangalore',
      type: 'Full-time',
      description: 'Build scalable web applications and work with modern technologies'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Mumbai',
      type: 'Full-time',
      description: 'Drive product strategy and work closely with engineering teams'
    },
    {
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Delhi',
      type: 'Full-time',
      description: 'Analyze customer data and provide actionable business insights'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Multiple Locations',
      type: 'Full-time',
      description: 'Ensure customer satisfaction and drive retention initiatives'
    },
    {
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Chennai',
      type: 'Full-time',
      description: 'Oversee daily operations and optimize supply chain processes'
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and execute marketing campaigns across digital channels'
    }
  ];

  return (
    <Layout title="Careers - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold sm:text-5xl mb-6">
                Join Our Team
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
                Be part of India's growing fresh grocery revolution.
                Help us deliver quality products and exceptional service to millions of customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#openings"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Open Positions
                </a>
                <a
                  href="#culture"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Our Culture
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Why Join Us */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Join Fresh Grocery?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just a grocery company – we're a technology-driven platform
              revolutionizing how India shops for fresh produce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Culture */}
        <div id="culture" className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Culture</h2>
              <p className="mt-4 text-lg text-gray-600">
                We believe in fostering an inclusive, innovative, and customer-centric culture
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What Drives Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Customer First</h4>
                      <p className="text-gray-600">Every decision we make starts with our customers' needs</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Innovation</h4>
                      <p className="text-gray-600">We embrace technology to solve real-world problems</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sustainability</h4>
                      <p className="text-gray-600">We're committed to reducing our environmental impact</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Teamwork</h4>
                      <p className="text-gray-600">We believe in the power of collaboration and diversity</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Life at Fresh Grocery</h3>
                <div className="space-y-3 text-gray-600">
                  <p>• Flexible work arrangements and remote options</p>
                  <p>• Regular team events and celebrations</p>
                  <p>• Learning and development programs</p>
                  <p>• Health and wellness initiatives</p>
                  <p>• Open communication and feedback culture</p>
                  <p>• Opportunities for growth and advancement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join us in building the future of grocery shopping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openPositions.map((position) => (
              <div key={position.title} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                    <p className="text-primary-600 font-medium">{position.department}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {position.type}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{position.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{position.location}</span>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Don't see a position that matches your skills? We're always looking for talented individuals.
                Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Send Your Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CareersPage;
