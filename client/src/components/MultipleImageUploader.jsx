import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

export default function MultipleImageUploader({ onImagesSelect, currentImages = [] }) {
  // Separate main image and additional images
  const [mainImage, setMainImage] = useState(currentImages[0] || '');
  const [additionalImages, setAdditionalImages] = useState(currentImages.slice(1) || []);
  const [isUploading, setIsUploading] = useState(false);

  // Reset component state when currentImages changes (form reset)
  useEffect(() => {
    setMainImage(currentImages[0] || '');
    setAdditionalImages(currentImages.slice(1) || []);
  }, [currentImages]);

  const onDropMain = useCallback((acceptedFiles) => {
    setIsUploading(true);
    const file = acceptedFiles[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMainImage(reader.result);
        // Update parent with new image structure
        onImagesSelect([reader.result, ...additionalImages]);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }, [additionalImages, onImagesSelect]);

  const onDropAdditional = useCallback((acceptedFiles) => {
    setIsUploading(true);
    const newImages = [];
    
    acceptedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        newImages.push(reader.result);
        
        if (newImages.length === acceptedFiles.length) {
          const updatedAdditionalImages = [...additionalImages, ...newImages];
          setAdditionalImages(updatedAdditionalImages);
          // Update parent with new image structure
          onImagesSelect([mainImage, ...updatedAdditionalImages]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [mainImage, additionalImages, onImagesSelect]);

  const removeImage = (index) => {
    const updatedAdditionalImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updatedAdditionalImages);
    onImagesSelect([mainImage, ...updatedAdditionalImages]);
  };

  const updateImage = (index, newImage) => {
    const updatedAdditionalImages = [...additionalImages];
    updatedAdditionalImages[index] = newImage;
    setAdditionalImages(updatedAdditionalImages);
    onImagesSelect([mainImage, ...updatedAdditionalImages]);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedAdditionalImages = [...additionalImages];
    const [movedImage] = updatedAdditionalImages.splice(fromIndex, 1);
    updatedAdditionalImages.splice(toIndex, 0, movedImage);
    setAdditionalImages(updatedAdditionalImages);
    onImagesSelect([mainImage, ...updatedAdditionalImages]);
  };

  // Combine for display purposes
  const allImages = [mainImage, ...additionalImages].filter(img => img);

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps, isDragActive: isMainDragActive } = useDropzone({
    onDrop: onDropMain,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const { getRootProps: getAdditionalRootProps, getInputProps: getAdditionalInputProps, isDragActive: isAdditionalDragActive } = useDropzone({
    onDrop: onDropAdditional,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  return (
    <div className="w-full space-y-4">
      {/* Main Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Main Product Image *
        </label>
        <div className="w-full">
          <div
            {...getMainRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isMainDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getMainInputProps()} />
            
            {mainImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={mainImage}
                    alt="Main product preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      console.error('Image failed to load');
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Click to change main image or drag a new one here
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl text-gray-400">📷</div>
                <div className="text-lg font-medium text-gray-700">
                  {isMainDragActive ? 'Drop the main image here' : 'Click to upload main image or drag here'}
                </div>
                <div className="text-sm text-gray-500">
                  This will be the primary product image
                </div>
                {isUploading && (
                  <div className="text-blue-600">Uploading...</div>
                )}
              </div>
            )}
          </div>
          
          {mainImage && (
            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Change Main Image</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMainImage('');
                  onImagesSelect(['', ...additionalImages]);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images ({additionalImages.length}/5)
        </label>
        
        {/* Image Grid */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {additionalImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 2}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => updateImage(index, image)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Position Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {index + 2}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add More Images */}
        {allImages.length < 6 && (
          <div
            {...getAdditionalRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isAdditionalDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getAdditionalInputProps()} />
            <div className="space-y-2">
              <div className="text-3xl text-gray-400">📷</div>
              <div className="text-sm font-medium text-gray-700">
                {isAdditionalDragActive ? 'Drop images here' : 'Click to add more images or drag here'}
              </div>
              <div className="text-xs text-gray-500">
                You can add up to 5 additional images
              </div>
              {isUploading && (
                <div className="text-blue-600 text-sm">Uploading...</div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-2 text-xs text-gray-500">
          <p>• First image is the main product image</p>
          <p>• Additional images will be shown in product gallery</p>
          <p>• Maximum 6 images total (1 main + 5 additional)</p>
        </div>
      </div>
    </div>
  );
} 