import React from 'react';
import Layout from '@/components/layout/Layout';
import {
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const GdprPage: React.FC = () => {
  const gdprRights = [
    {
      title: 'Right to Access',
      description: 'You have the right to request access to your personal data and information about how we process it.',
      icon: UserIcon
    },
    {
      title: 'Right to Rectification',
      description: 'You can request correction of inaccurate personal data or completion of incomplete data.',
      icon: DocumentTextIcon
    },
    {
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data in certain circumstances ("right to be forgotten").',
      icon: ExclamationTriangleIcon
    },
    {
      title: 'Right to Data Portability',
      description: 'You can request your personal data in a structured, commonly used format.',
      icon: CheckCircleIcon
    },
    {
      title: 'Right to Object',
      description: 'You can object to processing based on legitimate interests or for direct marketing purposes.',
      icon: LockClosedIcon
    },
    {
      title: 'Right to Restriction',
      description: 'You can request limitation of processing your personal data in certain situations.',
      icon: ShieldCheckIcon
    }
  ];

  const dataProcessing = [
    {
      purpose: 'Account Management',
      data: 'Name, email, phone number, address',
      legalBasis: 'Contract performance',
      retention: 'Account active + 3 years'
    },
    {
      purpose: 'Order Processing',
      data: 'Purchase history, payment information, delivery address',
      legalBasis: 'Contract performance',
      retention: '7 years (legal requirement)'
    },
    {
      purpose: 'Customer Support',
      data: 'Communication records, support tickets',
      legalBasis: 'Legitimate interest',
      retention: '3 years after last interaction'
    },
    {
      purpose: 'Marketing Communications',
      data: 'Email address, marketing preferences',
      legalBasis: 'Consent',
      retention: 'Until consent withdrawn'
    },
    {
      purpose: 'Website Analytics',
      data: 'IP address, browsing behavior, device information',
      legalBasis: 'Consent',
      retention: '26 months'
    },
    {
      purpose: 'Fraud Prevention',
      data: 'IP address, device fingerprints, transaction patterns',
      legalBasis: 'Legitimate interest',
      retention: '5 years'
    }
  ];

  const dataSharing = [
    {
      recipient: 'Payment Processors',
      purpose: 'Process payments securely',
      location: 'India/EU',
      safeguards: 'PCI DSS compliance, data processing agreements'
    },
    {
      recipient: 'Delivery Partners',
      purpose: 'Deliver orders to customers',
      location: 'India',
      safeguards: 'GDPR-compliant contracts, limited data access'
    },
    {
      recipient: 'Analytics Providers',
      purpose: 'Website performance analysis',
      location: 'EU',
      safeguards: 'Standard contractual clauses, anonymized data'
    },
    {
      recipient: 'Customer Support Tools',
      purpose: 'Provide customer assistance',
      location: 'EU',
      safeguards: 'Encrypted data transmission, access controls'
    }
  ];

  return (
    <Layout title="GDPR Compliance - Fresh Grocery Store">
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center text-white">
              <ShieldCheckIcon className="mx-auto h-16 w-16 mb-4" />
              <h1 className="text-4xl font-bold sm:text-5xl">
                GDPR Compliance
              </h1>
              <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
                Your privacy rights and our commitment to protecting your personal data
                in accordance with the General Data Protection Regulation (GDPR).
              </p>
            </div>
          </div>
        </div>

        {/* What is GDPR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What is GDPR?</h2>
              <p className="text-gray-600 mb-6">
                The General Data Protection Regulation (GDPR) is a comprehensive data protection law
                that came into effect in the European Union on May 25, 2018. It gives individuals greater
                control over their personal data and imposes strict requirements on organizations that
                collect, process, or store personal data.
              </p>
              <p className="text-gray-600 mb-6">
                At Fresh Grocery, we are committed to complying with GDPR requirements and protecting
                the privacy rights of all our customers, regardless of their location. This page explains
                how we collect, use, and protect your personal data.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">GDPR Certification</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Fresh Grocery is fully GDPR compliant and regularly audited for data protection standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Data Protection Principles</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lawfulness, Fairness & Transparency</h3>
                    <p className="text-gray-600">We process data lawfully and transparently</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Purpose Limitation</h3>
                    <p className="text-gray-600">Data collected for specific, legitimate purposes only</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Minimization</h3>
                    <p className="text-gray-600">We collect only necessary personal data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Accuracy</h3>
                    <p className="text-gray-600">We keep personal data accurate and up-to-date</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Storage Limitation</h3>
                    <p className="text-gray-600">Data retained only as long as necessary</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Security & Confidentiality</h3>
                    <p className="text-gray-600">Robust security measures protect your data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your GDPR Rights */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Your GDPR Rights</h2>
              <p className="mt-4 text-lg text-gray-600">
                Under GDPR, you have several rights regarding your personal data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gdprRights.map((right) => (
                <div key={right.title} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <right.icon className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{right.title}</h3>
                  <p className="text-gray-600 text-sm">{right.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How We Process Data */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How We Process Your Data</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Purpose</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Data Collected</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Legal Basis</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {dataProcessing.map((item, index) => (
                    <tr key={item.purpose} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 text-gray-900 font-medium">{item.purpose}</td>
                      <td className="py-4 px-6 text-gray-600">{item.data}</td>
                      <td className="py-4 px-6 text-gray-600">{item.legalBasis}</td>
                      <td className="py-4 px-6 text-gray-600">{item.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Data Sharing & Third Parties</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Recipient</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Purpose</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Safeguards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSharing.map((item, index) => (
                      <tr key={item.recipient} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-4 px-6 text-gray-900 font-medium">{item.recipient}</td>
                        <td className="py-4 px-6 text-gray-600">{item.purpose}</td>
                        <td className="py-4 px-6 text-gray-600">{item.location}</td>
                        <td className="py-4 px-6 text-gray-600">{item.safeguards}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security Measures</h2>
              <p className="text-gray-600 mb-6">
                We implement comprehensive security measures to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. Our security framework includes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">End-to-end encryption for data transmission</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Multi-factor authentication for employee access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Secure data centers with 24/7 monitoring</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Regular employee training on data protection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Incident response plan for data breaches</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              <p className="text-gray-600 mb-6">
                When we transfer personal data outside the European Economic Area (EEA), we ensure adequate protection
                through appropriate safeguards:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Standard Contractual Clauses approved by EU Commission</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Adequacy decisions for certain countries</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Binding Corporate Rules for intra-group transfers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Certification schemes and codes of conduct</span>
                </li>
              </ul>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Data Breach Notification</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      In case of a data breach, we will notify affected individuals within 72 hours
                      and relevant supervisory authorities within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Rights */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blue-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercising Your GDPR Rights</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To exercise any of your GDPR rights or if you have questions about how we process your data,
                please contact our Data Protection Officer using the information below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Protection Officer</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> dpo@freshgrocery.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Address:</strong> Data Protection Office, Fresh Grocery, Tech Tower, Bangalore, Karnataka, India</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Access requests:</span>
                    <span className="font-medium">Within 30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rectification requests:</span>
                    <span className="font-medium">Within 30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Erasure requests:</span>
                    <span className="font-medium">Within 30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complaints to ICO:</span>
                    <span className="font-medium">Within 3 months</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4">
                Submit GDPR Request
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Download Privacy Notice
              </button>
            </div>
          </div>
        </div>

        {/* Supervisory Authority */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Right to Lodge a Complaint</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                If you believe we have not complied with GDPR requirements, you have the right to lodge a complaint
                with a supervisory authority. In India, you can contact:
              </p>

              <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Protection Authority</h3>
                <div className="text-left space-y-2 text-gray-600">
                  <p><strong>Organization:</strong> Ministry of Electronics and Information Technology (MeitY)</p>
                  <p><strong>Website:</strong> <button className="text-blue-600 hover:text-blue-700">www.meity.gov.in</button></p>
                  <p><strong>Email:</strong> dpd@meity.gov.in</p>
                  <p><strong>Phone:</strong> +91-11-2436 3747</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                You can also lodge complaints with the supervisory authority in your country of residence or work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GdprPage;
