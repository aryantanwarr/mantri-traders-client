import React, { useState, useMemo } from 'react';
import ProductGallery from '../components/ProductGallery';

export default function Products({ products, onEnquiry, isAdminLoggedIn }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    size: '',
    category: '',
    search: ''
  });

  // Common tile sizes
  const tileSizes = [
    '24x48',
    '32x48', 
    '9x17',
    '12x26',
    '10x24',
    '10x28',
    '18x18',
    '12x36',
    '11x31',
    '10x13',
    '8x22',
    '30x30',
    '12x28',
    '10x32',
    '8x20',
    '24x36',
    '18x36',
    '32x32',
    '12x24',
    '8x12',
    '8x24',
    '8x16',
    '24X36',
    '10x20',
    '23x23',
    '14x14',
    '12x30',
    '24x24',
    'Custom Size'
  ];

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(prod => prod.category))];
    return uniqueCategories.filter(cat => cat && cat.trim() !== '');
  }, [products]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !product.category.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Size filter
      if (filters.size && product.size !== filters.size) {
        return false;
      }
      
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      return true;
    });
  }, [products, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      size: '',
      category: '',
      search: ''
    });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryMessage('');

    try {
      const enquiryData = {
        ...enquiryForm,
        productId: selected._id,
        message: enquiryForm.message || `Enquiry for ${selected.name}`
      };

      const result = await onEnquiry(enquiryData);
      if (result.success) {
        setEnquiryMessage('Enquiry sent successfully! We will contact you soon.');
        setEnquiryForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setModalOpen(false);
          setEnquiryMessage('');
        }, 2000);
      } else {
        setEnquiryMessage(result.error || 'Failed to send enquiry. Please try again.');
      }
    } catch (error) {
      setEnquiryMessage('Failed to send enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Tiles Collection</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our exclusive range of high-quality tiles for your perfect space
        </p>
      </div>

      {/* Filter Section */}
      {products && products.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
              {/* Search Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Size Filter */}
              <div className="sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sizes</option>
                  {tileSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.search || filters.size || filters.category) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.search && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Search: "{filters.search}"
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.size && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Size: {filters.size}
                    <button
                      onClick={() => handleFilterChange('size', '')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Category: {filters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Quick Size Filters */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Size Filters:</p>
            <div className="flex flex-wrap gap-2">
              {['24x48', '24x24', '30x30', '12x24'].map(size => (
                <button
                  key={size}
                  onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.size === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isAdminLoggedIn && products && products.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-blue-800 font-medium">
                No products added yet. Go to <a href="/admin" className="underline hover:text-blue-600">Admin Panel</a> to add your tiles!
              </p>
            </div>
          </div>
        </div>
      )}

      {!isAdminLoggedIn && products && products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products available</h3>
          <p className="text-gray-500">Please check back later for our latest tile collection.</p>
        </div>
      )}

      {/* No Results Message */}
      {products && products.length > 0 && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      {filteredProducts && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((prod) => (
            <div key={prod._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3]">
                  <ProductGallery 
                    images={[prod.image, ...(prod.images || [])]}
                    productName={prod.name}
                    showControls={false}
                  />
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {prod.category}
                  </span>
                </div>
                
                {/* Size Badge */}
                {prod.size && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {prod.size}
                    </span>
                  </div>
                )}
                
                {/* Overlay with View Details button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 z-10">
                  <button 
                    onClick={() => { setSelected(prod); setModalOpen(true); }} 
                    className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Details</span>
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Gallery - Positioned below main image */}
              {prod.images && prod.images.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {[prod.image, ...prod.images].map((image, index) => (
                      <button
                        key={index}
                        className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                      >
                        <img
                          src={image}
                          alt={`${prod.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-gray-400 text-xs">🏠</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors line-clamp-2">
                  {prod.name}
                </h3>
                
                {/* Description Preview */}
                {prod.description && (
                  <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                )}
                
                {/* View Details Button for Mobile */}
                <div className="sm:hidden">
                  <button 
                    onClick={() => { setSelected(prod); setModalOpen(true); }} 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Product Details Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">{selected.name}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {selected.category}
                    </span>
                    {selected.size && (
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {selected.size}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-700 text-3xl p-3 hover:bg-gray-100 rounded-full transition-all duration-300 ml-4"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Product Gallery
                  </h3>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <ProductGallery 
                      images={[selected.image, ...(selected.images || [])]}
                      productName={selected.name}
                    />
                  </div>
                </div>
                
                {/* Product Details & Enquiry */}
                <div className="space-y-8">
                  {/* Product Details */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Product Details
                    </h3>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-semibold text-gray-700">Product Name:</span>
                          <span className="text-gray-900 font-medium">{selected.name}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <span className="font-semibold text-gray-700">Category:</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {selected.category}
                          </span>
                        </div>
                        {selected.size && (
                          <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <span className="font-semibold text-gray-700">Size:</span>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              {selected.size}
                            </span>
                          </div>
                        )}
                        {!selected.size && (
                          <div className="flex items-center justify-between py-3 border-b border-gray-200">
                            <span className="font-semibold text-gray-700">Size:</span>
                            <span className="text-gray-500 text-sm italic">
                              Not specified
                            </span>
                          </div>
                        )}
                        <div className="py-3">
                          <span className="font-semibold text-gray-700 block mb-2">Description:</span>
                          <p className="text-gray-900 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                            {selected.description || "No description available."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enquiry Form */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Make an Enquiry
                    </h3>
                    <form onSubmit={handleEnquirySubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={enquiryForm.name}
                            onChange={(e) => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={enquiryForm.email}
                            onChange={(e) => setEnquiryForm(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                        <textarea
                          placeholder="Tell us about your requirements..."
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          value={enquiryForm.message}
                          onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                      
                      {enquiryMessage && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${
                          enquiryMessage.includes('successfully') 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {enquiryMessage}
                        </div>
                      )}
                      
                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Enquiry...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Enquiry
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 