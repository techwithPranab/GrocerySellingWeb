import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  NewspaperIcon,
  CalendarIcon,
  LinkIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const PressPage: React.FC = () => {
  const pressReleases = [
    {
      title: 'Fresh Grocery Raises $50M in Series B Funding',
      date: 'October 15, 2025',
      excerpt: 'Leading fresh grocery delivery platform secures funding to expand operations across India.',
      link: '#',
      featured: true
    },
    {
      title: 'Fresh Grocery Launches AI-Powered Inventory Management',
      date: 'September 28, 2025',
      excerpt: 'New technology ensures freshest products reach customers with minimal waste.',
      link: '#',
      featured: false
    },
    {
      title: 'Partnership with 500+ Local Farmers Announced',
      date: 'September 10, 2025',
      excerpt: 'Direct farm-to-consumer model strengthens supply chain and supports local agriculture.',
      link: '#',
      featured: false
    },
    {
      title: 'Fresh Grocery Achieves 1 Million Active Users Milestone',
      date: 'August 22, 2025',
      excerpt: 'Platform reaches significant user adoption in just 18 months of operation.',
      link: '#',
      featured: false
    },
    {
      title: 'Carbon-Neutral Delivery Initiative Launched',
      date: 'August 5, 2025',
      excerpt: 'Company commits to zero-emission delivery fleet by 2027.',
      link: '#',
      featured: false
    },
    {
      title: 'Fresh Grocery Expands to 15 New Cities',
      date: 'July 18, 2025',
      excerpt: 'Rapid expansion brings fresh grocery delivery to millions more customers.',
      link: '#',
      featured: false
    }
  ];

  const mediaCoverage = [
    {
      publication: 'The Economic Times',
      title: 'How Fresh Grocery is Revolutionizing India\'s Grocery Market',
      date: 'October 12, 2025',
      link: '#'
    },
    {
      publication: 'Business Today',
      title: 'Fresh Grocery\'s Tech-Driven Approach to Food Delivery',
      date: 'October 8, 2025',
      link: '#'
    },
    {
      publication: 'Forbes India',
      title: 'Meet the Founders: Fresh Grocery\'s Journey from Startup to Scale-up',
      date: 'September 25, 2025',
      link: '#'
    },
    {
      publication: 'YourStory',
      title: 'Fresh Grocery Raises Series B: A Look at India\'s Growing Agri-Tech Sector',
      date: 'September 20, 2025',
      link: '#'
    },
    {
      publication: 'TechCrunch',
      title: 'Fresh Grocery Brings AI to Grocery Shopping in India',
      date: 'September 15, 2025',
      link: '#'
    },
    {
      publication: 'Moneycontrol',
      title: 'Fresh Grocery IPO Rumors: What Investors Need to Know',
      date: 'August 30, 2025',
      link: '#'
    }
  ];

  const pressKit = [
    { name: 'Company Logo (PNG, SVG)', size: '2.5 MB' },
    { name: 'Brand Guidelines', size: '5.2 MB' },
    { name: 'High-Resolution Photos', size: '15.8 MB' },
    { name: 'Founder Bios', size: '1.1 MB' },
    { name: 'Product Images', size: '8.4 MB' },
    { name: 'Company Factsheet', size: '0.8 MB' }
  ];

  return (
    <Layout title="Press - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <NewspaperIcon className="mx-auto h-16 w-16 text-primary-600 mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Press Center
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest news, press releases, and media coverage
                about Fresh Grocery's journey in revolutionizing grocery shopping in India.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Press Release */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-primary-50 rounded-lg p-8 mb-12">
            <div className="flex items-center mb-4">
              <span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Latest Release
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fresh Grocery Raises $50M in Series B Funding
            </h2>
            <p className="text-gray-700 mb-4">
              Fresh Grocery today announced it has raised $50 million in Series B funding led by
              top-tier venture capital firms. The funding will be used to expand operations across
              India and enhance our technology platform to serve more customers with fresher products.
            </p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <CalendarIcon className="h-4 w-4 mr-2" />
              October 15, 2025
            </div>
            <button className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
              Read Full Release
              <LinkIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Press Releases */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Press Releases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pressReleases.filter(release => !release.featured).map((release) => (
              <div key={release.title} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {release.date}
                  </div>
                  <button className="text-primary-600 font-medium hover:text-primary-700">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Coverage */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Coverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaCoverage.map((article) => (
                <div key={article.title} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                      {article.publication}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.date}</span>
                    <button className="text-primary-600 font-medium hover:text-primary-700">
                      Read Article →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Press Kit */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Press Kit</h2>
              <p className="text-gray-600 mb-6">
                Download our press kit containing logos, photos, and company information
                for your media coverage needs.
              </p>

              <div className="space-y-3">
                {pressKit.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{item.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{item.size}</span>
                      <button className="text-primary-600 font-medium hover:text-primary-700">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Press Team</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  For press inquiries, interviews, or media requests, please contact our press team.
                </p>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-900">Press Contact:</span>
                    <p className="text-gray-600">press@freshgrocery.com</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Phone:</span>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Address:</span>
                    <p className="text-gray-600">
                      Fresh Grocery Press Office<br />
                      Tech Tower, Bangalore<br />
                      Karnataka, India
                    </p>
                  </div>
                </div>

                <button className="mt-6 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Send Press Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Gallery */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Video Gallery</h2>
              <p className="mt-4 text-lg text-gray-600">
                Watch our latest videos and company updates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((video) => (
                <div key={video} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Company Update {video}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Latest updates and behind-the-scenes content from our team.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PressPage;
