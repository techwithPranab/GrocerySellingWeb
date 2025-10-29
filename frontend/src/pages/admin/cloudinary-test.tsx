import React from 'react';
import CloudinaryTest from '@/components/common/CloudinaryTest';
import AdminLayout from '@/components/layout/AdminLayout';

const CloudinaryTestPage: React.FC = () => {
  return (
    <AdminLayout title="Cloudinary Test">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cloudinary Configuration Test</h1>
          <p className="text-gray-600">Test your Cloudinary setup and diagnose upload issues</p>
        </div>
        
        <CloudinaryTest />
      </div>
    </AdminLayout>
  );
};

export default CloudinaryTestPage;
