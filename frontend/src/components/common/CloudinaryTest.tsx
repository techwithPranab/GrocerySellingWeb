import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CloudinaryTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const testUpload = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      if (!cloudName) {
        throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured');
      }

      // Create a test image
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 1, 1);
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create test image');
        }

        try {
          // Get upload signature from backend
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const signatureResponse = await fetch(`${backendUrl}/cloudinary/signature`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              folder: 'groceryweb/test'
            }),
          });

          if (!signatureResponse.ok) {
            throw new Error('Failed to get upload signature from backend');
          }

          const signatureData = await signatureResponse.json();

          // Prepare form data for signed upload
          const formData = new FormData();
          formData.append('file', blob, 'test.png');
          formData.append('signature', signatureData.signature);
          formData.append('timestamp', signatureData.timestamp.toString());
          formData.append('api_key', signatureData.api_key);
          formData.append('folder', signatureData.folder);
          
          // Add optimization parameters (these don't need to be in the signature)
          formData.append('quality', 'auto');
          formData.append('fetch_format', 'auto');

          console.log('Testing signed upload with:', {
            cloudName,
            folder: signatureData.folder,
            signature: signatureData.signature,
            timestamp: signatureData.timestamp,
            url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
          });

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();
          
          console.log('Test upload response:', data);
          
          if (response.ok && data.secure_url) {
            setResult({ 
              success: true, 
              message: 'Upload successful!', 
              url: data.secure_url,
              public_id: data.public_id,
              folder: data.folder
            });
            toast.success('Cloudinary test upload successful!');
          } else {
            throw new Error(data.error?.message || 'Upload failed');
          }
        } catch (error) {
          console.error('Test upload error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setResult({ 
            success: false, 
            message: errorMessage,
            error: error
          });
          toast.error(`Test failed: ${errorMessage}`);
        } finally {
          setTesting(false);
        }
      });
    } catch (error) {
      console.error('Test setup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ 
        success: false, 
        message: errorMessage,
        error: error
      });
      toast.error(`Test failed: ${errorMessage}`);
      setTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Cloudinary Configuration Test (Signed Upload)</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Cloud Name:</strong> 
          <span className={cloudName ? 'text-green-600' : 'text-red-600'}>
            {cloudName || 'NOT SET'}
          </span>
        </div>
        
        <div>
          <strong>Upload Method:</strong> 
          <span className="text-blue-600">Signed Upload (No Preset Required)</span>
        </div>

        <button
          onClick={testUpload}
          disabled={testing || !cloudName}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Test Signed Upload'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </p>
            {result.url && (
              <div className="mt-2">
                <strong>Uploaded Image:</strong>
                <img src={result.url} alt="Test upload" className="mt-1 max-w-full h-auto" />
                <p className="text-xs text-gray-600 mt-1">URL: {result.url}</p>
              </div>
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
              <pre className="text-xs mt-2 overflow-auto bg-gray-50 p-2 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-800 mb-2">About Signed Uploads:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• No upload preset required - uses backend signature</li>
          <li>• More secure than unsigned uploads</li>
          <li>• Backend generates signed upload parameters</li>
          <li>• Requires CLOUDINARY_API_SECRET on backend</li>
          <li>• Images uploaded to groceryweb/test folder for testing</li>
        </ul>
        
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            <strong>Benefits:</strong> No need to create upload presets in Cloudinary dashboard. Backend controls all upload parameters securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryTest;
