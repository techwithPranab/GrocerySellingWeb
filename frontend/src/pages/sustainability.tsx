import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  TruckIcon,
  HeartIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const SustainabilityPage: React.FC = () => {
  const initiatives = [
    {
      title: 'Carbon Neutral Delivery',
      description: 'All our delivery vehicles run on electric power, reducing carbon emissions by 80% compared to traditional delivery methods.',
      icon: TruckIcon,
      progress: 85,
      target: '100% by 2027'
    },
    {
      title: 'Zero Food Waste',
      description: 'Advanced AI predicts demand and optimizes inventory to minimize food waste across our supply chain.',
      icon: GlobeAltIcon,
      progress: 92,
      target: '95% by 2026'
    },
    {
      title: 'Local Farmer Support',
      description: 'Partnering with 500+ local farmers to promote sustainable farming practices and reduce transportation emissions.',
      icon: HeartIcon,
      progress: 78,
      target: '1000 farmers by 2026'
    },
    {
      title: 'Sustainable Packaging',
      description: '100% biodegradable and recyclable packaging materials for all our deliveries.',
      icon: GlobeAltIcon,
      progress: 100,
      target: 'Achieved'
    }
  ];

  const impactStats = [
    { label: 'CO2 Emissions Reduced', value: '2,500 tons', change: '+15%' },
    { label: 'Food Waste Prevented', value: '50 tons', change: '+22%' },
    { label: 'Local Farmers Supported', value: '500+', change: '+25%' },
    { label: 'Trees Planted', value: '10,000', change: '+40%' }
  ];

  const commitments = [
    {
      title: 'Environmental Impact',
      description: 'We are committed to reducing our environmental footprint through sustainable practices and innovative technology.',
      points: [
        'Carbon neutral operations by 2027',
        'Zero waste to landfill by 2025',
        '100% renewable energy usage',
        'Sustainable sourcing for all products'
      ]
    },
    {
      title: 'Community Support',
      description: 'Building stronger communities through local partnerships and social responsibility initiatives.',
      points: [
        'Support for local farmers and suppliers',
        'Community education programs',
        'Food security initiatives',
        'Youth employment programs'
      ]
    },
    {
      title: 'Innovation for Good',
      description: 'Using technology to create positive change and promote sustainable living.',
      points: [
        'AI-powered waste reduction',
        'Smart inventory management',
        'Sustainable delivery optimization',
        'Consumer education tools'
      ]
    }
  ];

  return (
    <Layout title="Sustainability - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <GlobeAltIcon className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-4xl font-bold sm:text-5xl">
                Sustainability at Fresh Grocery
              </h1>
              <p className="mt-4 text-xl text-green-100 max-w-3xl mx-auto">
                We're committed to creating a positive impact on the planet and our communities
                through sustainable practices, local partnerships, and innovative technology.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change} from last year</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Key Initiatives</h2>
              <p className="mt-4 text-lg text-gray-600">
                Driving positive change through targeted sustainability programs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {initiatives.map((initiative) => (
                <div key={initiative.title} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <initiative.icon className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{initiative.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{initiative.description}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{initiative.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${initiative.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Target: {initiative.target}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitments */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Commitments</h2>
            <p className="mt-4 text-lg text-gray-600">
              Building a sustainable future through responsible business practices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {commitments.map((commitment) => (
              <div key={commitment.title} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{commitment.title}</h3>
                <p className="text-gray-600 mb-6">{commitment.description}</p>
                <ul className="space-y-3">
                  {commitment.points.map((point) => (
                    <li key={point} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Stories */}
        <div className="bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Farmer Success Stories</h2>
              <p className="mt-4 text-lg text-gray-600">
                Real stories from the farmers we work with
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">RK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">Organic Farmer, Karnataka</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Partnering with Fresh Grocery has transformed my farm. Their commitment to fair prices
                  and sustainable practices has allowed me to invest in better irrigation and continue
                  organic farming methods that protect our soil and water."
                </p>
                <div className="text-sm text-green-600 font-medium">
                  +40% increase in income through direct partnership
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">SP</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sunita Patel</h4>
                    <p className="text-sm text-gray-600">Women Farmer Collective, Maharashtra</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "Fresh Grocery's support has empowered our women's collective. We now have access to
                  modern farming techniques and a guaranteed market for our produce, ensuring food
                  security for our families and communities."
                </p>
                <div className="text-sm text-green-600 font-medium">
                  200+ women farmers supported through collective farming
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-center text-white">
            <GlobeAltIcon className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Our Sustainability Journey</h2>
            <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
              Every purchase you make helps support sustainable farming and reduces environmental impact.
              Together, we can create a better future for our planet and communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Shop Sustainably
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                Learn More About Our Impact
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Sustainability Timeline</h2>
              <p className="mt-4 text-lg text-gray-600">
                Milestones in our journey toward a sustainable future
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-green-200"></div>

              <div className="space-y-12">
                {[
                  { year: '2025', title: 'Carbon Neutral Operations', description: 'Achieved carbon neutrality across all delivery operations' },
                  { year: '2024', title: 'Zero Waste Initiative', description: 'Eliminated waste to landfill through comprehensive recycling program' },
                  { year: '2023', title: 'Local Farmer Network', description: 'Established partnerships with 500+ local farmers' },
                  { year: '2022', title: 'Sustainable Packaging', description: 'Transitioned to 100% biodegradable packaging' },
                  { year: '2021', title: 'Company Founded', description: 'Fresh Grocery founded with sustainability at its core' }
                ].map((milestone, index) => (
                  <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'pr-8 md:pr-16' : 'pl-8 md:pl-16'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-green-600 font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SustainabilityPage;
