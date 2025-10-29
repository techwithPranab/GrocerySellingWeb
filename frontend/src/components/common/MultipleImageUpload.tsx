import React, { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface ImageUpload {
  id: string;
  file?: File;
  url: string;
  publicId?: string;
  uploading: boolean;
  alt?: string;
}

interface MultipleImageUploadProps {
  onImagesChange: (images: { url: string; publicId: string; alt?: string }[]) => void;
  currentImages?: { url: string; publicId?: string; alt?: string }[];
  productSlug?: string;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  onImagesChange,
  currentImages = [],
  productSlug,
  maxImages = 5,
  className = '',
  disabled = false
}) => {
  const [images, setImages] = useState<ImageUpload[]>(() => 
    currentImages.map((img, index) => ({
      id: `existing-${index}`,
      url: img.url,
      publicId: img.publicId,
      uploading: false,
      alt: img.alt
    }))
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Create folder structure: groceryweb/products/{productSlug}
  const getFolderPath = () => {
    if (productSlug) {
      return `groceryweb/products/${productSlug}`;
    }
    return 'groceryweb/products/general';
  };

  const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    try {
      // Get upload signature from backend
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
      formData.append('quality', 'auto');
      formData.append('fetch_format', 'auto');

      // Upload to Cloudinary using signed upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`;
        if (data.error?.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }
      
      if (data.secure_url && data.public_id) {
        return { url: data.secure_url, publicId: data.public_id };
      } else {
        throw new Error('No URL returned from Cloudinary');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      throw new Error(errorMessage);
    }
  };

  const handleFileSelect = useCallback(async (files: FileList) => {
    if (!cloudName) {
      toast.error('Cloudinary cloud name is missing. Please check your environment configuration.');
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Please select a valid image file (JPEG, PNG, or WebP)`);
        return false;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: File size must be less than 10MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    const totalImages = images.length + validFiles.length;
    if (totalImages > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images. You have ${images.length} images and are trying to add ${validFiles.length} more.`);
      return;
    }

    // Create temporary image objects for each file
    const newImages: ImageUpload[] = validFiles.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      uploading: true
    }));

    // Update state with new uploading images
    setImages(prev => [...prev, ...newImages]);

    // Upload each file
    for (const imageUpload of newImages) {
      try {
        const uploadResult = await uploadToCloudinary(imageUpload.file!);
        
        // Update the specific image with upload result
        setImages(prev => prev.map(img => 
          img.id === imageUpload.id 
            ? { 
                ...img, 
                url: uploadResult.url, 
                publicId: uploadResult.publicId,
                uploading: false,
                file: undefined // Remove file reference after upload
              }
            : img
        ));

        toast.success(`Image uploaded successfully!`);
      } catch (error) {
        // Remove failed upload from state
        setImages(prev => prev.filter(img => img.id !== imageUpload.id));
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        toast.error(`Upload failed: ${errorMessage}`);
      }
    }
  }, [cloudName, backendUrl, images.length, maxImages, productSlug]);

  // Update parent component when images change
  React.useEffect(() => {
    const completedImages = images
      .filter(img => !img.uploading && img.publicId)
      .map(img => ({
        url: img.url,
        publicId: img.publicId!,
        alt: img.alt
      }));
    
    onImagesChange(completedImages);
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFileSelect]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const updateImageAlt = useCallback((imageId: string, alt: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, alt } : img
    ));
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <button
        type="button"
        className={`
          w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        disabled={disabled}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {dragActive ? 'Drop images here' : 'Upload product images'}
            </p>
            <p className="text-sm text-gray-500">
              Drag & drop images here, or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {images.length}/{maxImages} images • JPEG, PNG, WebP up to 10MB each
            </p>
          </div>
        </div>
      </button>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square">
              {/* Image */}
              <img
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Upload overlay */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="animate-spin mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm">Uploading...</p>
                  </div>
                </div>
              )}
              
              {/* Controls overlay */}
              {!image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Primary image indicator */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              )}
              
              {/* Alt text input */}
              {!image.uploading && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <input
                    type="text"
                    placeholder="Alt text (optional)"
                    value={image.alt || ''}
                    onChange={(e) => updateImageAlt(image.id, e.target.value)}
                    className="w-full text-xs bg-white bg-opacity-80 rounded px-2 py-1 text-gray-800"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      {images.length === 0 && (
        <div className="text-center text-gray-500 text-sm">
          <p>No images uploaded yet. Add up to {maxImages} product images.</p>
          <p className="mt-1">The first image will be used as the primary product image.</p>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload;
