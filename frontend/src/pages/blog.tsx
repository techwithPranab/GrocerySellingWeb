import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const BlogPage: React.FC = () => {
  const featuredPost = {
    title: 'The Future of Grocery Shopping: AI and Machine Learning',
    excerpt: 'Explore how artificial intelligence is transforming the grocery industry, from personalized recommendations to predictive inventory management.',
    author: 'Dr. Priya Sharma',
    date: 'October 20, 2025',
    readTime: '8 min read',
    category: 'Technology',
    image: '/blog/ai-grocery.jpg'
  };

  const blogPosts = [
    {
      title: 'Sustainable Farming: Our Commitment to the Planet',
      excerpt: 'Learn about our initiatives to support local farmers and reduce our carbon footprint through sustainable agricultural practices.',
      author: 'Rajesh Kumar',
      date: 'October 18, 2025',
      readTime: '6 min read',
      category: 'Sustainability',
      slug: 'sustainable-farming-commitment'
    },
    {
      title: 'Behind the Scenes: How We Ensure Product Freshness',
      excerpt: 'A detailed look at our quality control processes and technology that keeps your groceries fresh from farm to doorstep.',
      author: 'Anita Patel',
      date: 'October 15, 2025',
      readTime: '5 min read',
      category: 'Operations',
      slug: 'product-freshness-process'
    },
    {
      title: 'Customer Stories: How Fresh Grocery Changed Lives',
      excerpt: 'Real stories from our customers about how convenient grocery delivery has transformed their daily routines.',
      author: 'Team Fresh Grocery',
      date: 'October 12, 2025',
      readTime: '7 min read',
      category: 'Community',
      slug: 'customer-success-stories'
    },
    {
      title: 'Nutrition Tips: Eating Healthy on a Budget',
      excerpt: 'Expert nutritionists share practical tips for maintaining a healthy diet without breaking the bank.',
      author: 'Dr. Ramesh Gupta',
      date: 'October 10, 2025',
      readTime: '4 min read',
      category: 'Health',
      slug: 'healthy-eating-budget'
    },
    {
      title: 'Seasonal Produce Guide: What\'s Fresh This Month',
      excerpt: 'Discover the best seasonal fruits and vegetables available now, along with cooking tips and recipes.',
      author: 'Chef Maria Rodriguez',
      date: 'October 8, 2025',
      readTime: '6 min read',
      category: 'Food',
      slug: 'seasonal-produce-guide'
    },
    {
      title: 'Building a Stronger Local Economy',
      excerpt: 'How Fresh Grocery supports local businesses and contributes to community development across India.',
      author: 'Vikram Singh',
      date: 'October 5, 2025',
      readTime: '5 min read',
      category: 'Business',
      slug: 'local-economy-support'
    }
  ];

  const categories = [
    { name: 'All Posts', count: 24, active: true },
    { name: 'Technology', count: 8, active: false },
    { name: 'Sustainability', count: 6, active: false },
    { name: 'Health', count: 4, active: false },
    { name: 'Food', count: 3, active: false },
    { name: 'Community', count: 3, active: false }
  ];

  return (
    <Layout title="Blog - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold sm:text-5xl">
                Fresh Grocery Blog
              </h1>
              <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
                Insights, stories, and expert advice on food, technology, sustainability,
                and everything that makes grocery shopping better.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Featured Image</span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <button className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Read Full Article
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category.active
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Post Image</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                    <button className="text-primary-600 font-medium hover:text-primary-700">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest blog posts, company updates,
                and exclusive content delivered straight to your inbox.
              </p>

              <div className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Load More */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Articles
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
