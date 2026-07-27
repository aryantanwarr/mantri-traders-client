import React, { useState, useEffect } from 'react';

export default function ProductGallery({ images = [], productName = 'Product', showControls = true }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!showFullscreen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'Escape':
          e.preventDefault();
          setShowFullscreen(false);
          setIsZoomed(false);
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          setIsZoomed(!isZoomed);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreen, isZoomed]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-50 rounded-lg flex items-center justify-center py-16">
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-lg font-medium">No product images available</p>
          <p className="text-sm text-gray-500 mt-2">Images will appear here once uploaded</p>
        </div>
      </div>
    );
  }

  const mainImage = images[currentImageIndex];
  const additionalImages = images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  return (
    <div className="w-full">
      {/* Main Product Image - Master Tiles Style */}
      <div className="relative w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="aspect-[4/3] relative">
          <img
            src={mainImage}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setShowFullscreen(true)}
            onError={(e) => {
              console.error('Image failed to load:', mainImage);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          
          {/* Fallback for failed images */}
          <div className="hidden w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🏠</div>
              <p className="text-sm">Image not available</p>
            </div>
          </div>

          {/* Navigation Arrows - Master Tiles Style */}
          {images.length > 1 && showControls && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter - Master Tiles Style */}
          {images.length > 1 && showControls && (
            <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Fullscreen Button - Master Tiles Style */}
          {showControls && (
            <button
              onClick={() => setShowFullscreen(true)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 p-2 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
              title="View fullscreen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery - Master Tiles Style */}
      {images.length > 1 && showControls && (
        <div className="mt-6">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shadow-sm hover:shadow-md ${
                  currentImageIndex === index
                    ? 'border-blue-500 scale-105 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Thumbnail failed to load:', image);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback for failed thumbnails */}
                <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-xs">🏠</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Image counter - Master Tiles Style */}
          <div className="mt-3 text-center">
            <span className="inline-block bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1} of {images.length} images
            </span>
          </div>
        </div>
      )}

      {/* Fullscreen Modal - Master Tiles Style */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowFullscreen(false);
            setIsZoomed(false);
          }}
        >
          <div className="relative max-w-7xl w-full max-h-full">
            {/* Close Button - Master Tiles Style */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullscreen(false);
                setIsZoomed(false);
              }}
              className="absolute top-6 right-6 z-10 bg-white bg-opacity-90 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows - Master Tiles Style */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-700 p-4 rounded-full hover:bg-opacity-100 transition-all z-10 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-700 p-4 rounded-full hover:bg-opacity-100 transition-all z-10 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Zoom Button - Master Tiles Style */}
            {showControls && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="absolute top-6 left-6 bg-white bg-opacity-90 text-gray-700 p-3 rounded-full hover:bg-opacity-100 transition-all z-10 shadow-lg"
                title={isZoomed ? 'Zoom out (Z)' : 'Zoom in (Z)'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isZoomed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  )}
                </svg>
              </button>
            )}

            {/* Fullscreen Image - Master Tiles Style */}
            <div 
              className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={mainImage}
                alt={`${productName} - Fullscreen ${currentImageIndex + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{ 
                  maxHeight: isZoomed ? 'none' : '90vh',
                  maxWidth: isZoomed ? 'none' : '100%'
                }}
                onClick={() => setIsZoomed(!isZoomed)}
                onError={(e) => {
                  console.error('Fullscreen image failed to load:', mainImage);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              
              {/* Fallback for failed fullscreen images */}
              <div className="hidden w-full h-full bg-gray-800 flex items-center justify-center rounded-lg">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-lg">Image not available</p>
                </div>
              </div>
            </div>

            {/* Image Counter - Master Tiles Style */}
            {images.length > 1 && (
              <div 
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 text-gray-700 px-6 py-3 rounded-full text-lg font-semibold shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {currentImageIndex + 1} of {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 