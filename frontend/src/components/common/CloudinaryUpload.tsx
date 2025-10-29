import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface CloudinaryUploadProps {
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  onError?: (error: string) => void;
  maxSize?: number;
  productSlug?: string;
  className?: string;
  disabled?: boolean;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  productSlug,
  className = '',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Create folder structure: groceryweb/products/{productSlug}
  const getFolderPath = () => {
    if (productSlug) {
      return `groceryweb/products/${productSlug}`;
    }
    return 'groceryweb/products/general';
  };

  const handleFileSelect = (file: File) => {
    if (!cloudName) {
      toast.error('Cloudinary cloud name is missing. Please check your environment configuration.');
      console.error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    console.log('File selected for upload:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    
    try {
      // Get upload signature from backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Requesting upload signature from backend:', backendUrl); 
      const signatureResponse = await fetch(`${backendUrl}/api/cloudinary/signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder: getFolderPath()
        }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const signatureData = await signatureResponse.json();
      
      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('api_key', signatureData.api_key);
      formData.append('folder', signatureData.folder);
      
      // Add optimization parameters (these don't need to be in the signature)
      formData.append('quality', 'auto');
      formData.append('fetch_format', 'auto');

      console.log('Uploading to Cloudinary with signed upload:', {
        cloudName,
        folder: signatureData.folder,
        fileName: file.name,
        signature: signatureData.signature,
        timestamp: signatureData.timestamp
      });

      // Upload to Cloudinary using signed upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Cloudinary response:', data);

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`;
        
        if (data.error?.message) {
          errorMessage = data.error.message;
          
          // Specific error handling
          if (data.error.message.includes('Invalid cloud name')) {
            errorMessage = `Invalid cloud name "${cloudName}". Please check your Cloudinary configuration.`;
          } else if (data.error.message.includes('Invalid signature')) {
            errorMessage = 'Upload signature is invalid. Please check your backend Cloudinary configuration.';
          }
        }
        
        throw new Error(errorMessage);
      }
      
      if (data.secure_url && data.public_id) {
        onUpload(data.secure_url, data.public_id);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error('No URL returned from Cloudinary');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      toast.success('Image removed');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {currentImage ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={disabled || uploading}
                  className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Replace'}
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={disabled}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          disabled={disabled}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop image here or click to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PNG, JPG, GIF up to 10MB
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  Will upload to: groceryweb/products/{productSlug || 'general'}
                </p>
                <button
                  type="button"
                  disabled={disabled}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  Choose File
                </button>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default CloudinaryUpload;
