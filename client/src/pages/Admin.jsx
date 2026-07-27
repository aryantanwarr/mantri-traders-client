import React, { useState, useEffect } from 'react';
import MultipleImageUploader from '../components/MultipleImageUploader';
import ProductGallery from '../components/ProductGallery';
import { productsAPI, enquiriesAPI } from '../services/api';

export default function Admin({ 
  products, 
  enquiries,
  isLoggedIn, 
  onLogin, 
  onLogout, 
  onAddProduct, 
  onDeleteProduct,
  onLoadEnquiries,
  onLoadProducts
}) {
  const [form, setForm] = useState({ name: '', category: '', size: '', image: '', images: [], description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formKey, setFormKey] = useState(0); // Key to force re-render
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Common tile sizes for dropdown
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onLogin(form.email, form.password);
      if (result.success) {
        setForm({ name: '', category: '', size: '', image: '', images: [], description: '' });
        setError('');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!form.name || !form.category) {
      setError('Name and category are required');
      setLoading(false);
      return;
    }

    // If no image is selected, use a placeholder
    const productData = {
      ...form,
      image: form.image || 'https://placehold.co/400x300?text=No+Image'
    };

    console.log('Product data being sent:', productData);
    console.log('Size value:', productData.size);

    try {
      console.log('Adding product:', productData);
      const result = await onAddProduct(productData);
      console.log('Add product result:', result);
      
      if (result.success) {
        // Reset form completely
        setForm({ 
          name: '', 
          category: '', 
          size: '', 
          image: '', 
          images: [], 
          description: '',
          email: '',
          password: ''
        });
        
        // Force re-render of image uploader
        setFormKey(prev => prev + 1);
        
        // Show success popup
        setSuccessMessage(`"${productData.name}" has been added successfully!`);
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSuccessMessage('');
        }, 3000);
        
        // Reload products to ensure the page updates
        if (onLoadProducts) {
          await onLoadProducts();
        }
        
        console.log('Product added and page updated successfully');
      } else {
        setError(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagesSelect = (imagesArray) => {
    setForm(prev => ({ 
      ...prev, 
      image: imagesArray[0] || '', 
      images: imagesArray.slice(1) || [] 
    }));
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await onDeleteProduct(productId);
      if (result.success) {
        // Show success popup
        setSuccessMessage('Product deleted successfully!');
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to delete product');
      }
    } catch (error) {
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      size: product.size || '',
      image: product.image,
      images: product.images || [],
      description: product.description || '',
      email: '',
      password: ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    setLoading(true);
    try {
      const productData = {
        ...form,
        image: form.image || editingProduct.image
      };

      const result = await productsAPI.update(editingProduct._id, productData);

      if (result.success) {
        // Show success popup
        setSuccessMessage(`"${productData.name}" has been updated successfully!`);
        setShowSuccessPopup(true);
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSuccessMessage('');
        }, 3000);
        
        // Close edit modal
        setShowEditModal(false);
        setEditingProduct(null);
        
        // Reset form
        setForm({ 
          name: '', 
          category: '', 
          size: '', 
          image: '', 
          images: [], 
          description: '',
          email: '',
          password: ''
        });
        
        // Reload products to ensure the page updates
        if (onLoadProducts) {
          await onLoadProducts();
        }
      } else {
        setError(result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUnreadCount = () => {
    return enquiries.filter(enquiry => enquiry.status === 'new').length;
  };

  const markAsRead = async (enquiryId) => {
    try {
      await enquiriesAPI.updateStatus(enquiryId, 'read');
      
      // Reload enquiries to see the updated status
      if (onLoadEnquiries) {
        await onLoadEnquiries();
      }
    } catch (error) {
      console.error('Failed to mark enquiry as read:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-sm mx-auto py-10">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full border rounded px-3 py-2 mb-2" 
            value={form.email || ''} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            required
          />
          <input 
            type="password" 
            placeholder="Admin Password" 
            className="w-full border rounded px-3 py-2 mb-2" 
            value={form.password || ''} 
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
            required
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button 
            type="submit" 
            className="bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <div className="flex space-x-3">
          
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 015 3h14a4 4 0 014 4v6a4 4 0 01-4 4H5a4 4 0 01-4-4V7a4 4 0 011.19-2.81z" />
            </svg>
            <span>Enquiries</span>
            {getUnreadCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </button>
          
          <button 
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      
      <form onSubmit={handleAdd} className="bg-blue-50 p-6 rounded-lg mb-8 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            required 
            type="text" 
            placeholder="Tile Name" 
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          />
          <input 
            required 
            type="text" 
            placeholder="Category" 
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={form.category} 
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={form.size || ''}
            onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Size (Optional)</option>
            {tileSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Custom Size (if not in list)" 
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={form.size || ''} 
            onChange={e => setForm(f => ({ ...f, size: e.target.value }))} 
          />
        </div>
        
        <div className="md:col-span-2">
          <MultipleImageUploader 
            onImagesSelect={handleImagesSelect}
            currentImages={[form.image, ...form.images]}
            key={formKey} // Add key to force re-render
          />
        </div>
        
        <div className="md:col-span-2">
          <input 
            type="text" 
            placeholder="Description" 
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            value={form.description} 
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-green-600 text-white px-6 py-2 rounded-lg w-full md:w-auto disabled:opacity-50 hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Tile'}
        </button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div key={prod._id} className="bg-white p-4 rounded-lg shadow-md text-center border border-gray-100">
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-3">
              <ProductGallery 
                images={[prod.image, ...(prod.images || [])]}
                productName={prod.name}
              />
            </div>
            <div className="font-bold text-blue-700 mb-3">{prod.name}</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setViewingProduct(prod);
                  setShowViewModal(true);
                }} 
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-xs disabled:opacity-50 transition-colors flex-1"
                disabled={loading}
              >
                Details
              </button>
              <button 
                onClick={() => handleDelete(prod._id)} 
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-xs disabled:opacity-50 transition-colors flex-1"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enquiries Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer Enquiries</h2>
                  <p className="text-gray-600 mt-1">
                    {enquiries.length} total enquiries • {getUnreadCount()} unread
                  </p>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  className="text-gray-400 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingEnquiries ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading enquiries...</p>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📧</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No enquiries yet</h3>
                  <p className="text-gray-500">Customer enquiries will appear here when they submit forms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enquiry) => (
                    <div 
                      key={enquiry._id} 
                      className={`p-4 rounded-lg border transition-colors ${
                        enquiry.status === 'new' 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                            {enquiry.status === 'new' && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Email:</span> {enquiry.email}</p>
                            {enquiry.phone && (
                              <p><span className="font-medium">Phone:</span> {enquiry.phone}</p>
                            )}
                            {enquiry.product && (
                              <p><span className="font-medium">Product:</span> {enquiry.product.name} ({enquiry.product.category})</p>
                            )}
                            <p>
                              <span className="font-medium">Status:</span> 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                enquiry.status === 'read' ? 'bg-gray-100 text-gray-800' :
                                enquiry.status === 'replied' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          {formatDate(enquiry.createdAt)}
                        </div>
                      </div>
                      
                      {enquiry.message && (
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-sm text-gray-700">{enquiry.message}</p>
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          ID: {enquiry._id}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => markAsRead(enquiry._id)}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            Mark Read
                          </button>
                          <a 
                            href={`mailto:${enquiry.email}?subject=Re: Enquiry for ${enquiry.product ? enquiry.product.name : 'Product'}`}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                          >
                            Reply
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <button 
                  onClick={onLoadEnquiries}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Refresh Enquiries
                </button>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  setSuccessMessage('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
                  <p className="text-gray-600 mt-1">Update product details and images</p>
                </div>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setForm({ 
                      name: '', 
                      category: '', 
                      size: '', 
                      image: '', 
                      images: [], 
                      description: '',
                      email: '',
                      password: ''
                    });
                  }} 
                  className="text-gray-400 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    required 
                    type="text" 
                    placeholder="Tile Name" 
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.name} 
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  />
                  <input 
                    required 
                    type="text" 
                    placeholder="Category" 
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.category} 
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={form.size || ''}
                    onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size (Optional)</option>
                    {tileSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Custom Size (if not in list)" 
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.size || ''} 
                    onChange={e => setForm(f => ({ ...f, size: e.target.value }))} 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <MultipleImageUploader 
                    onImagesSelect={handleImagesSelect}
                    currentImages={[form.image, ...form.images]}
                    key={`edit-${editingProduct._id}`}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <input 
                    type="text" 
                    placeholder="Description" 
                    className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    value={form.description} 
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProduct(null);
                      setForm({ 
                        name: '', 
                        category: '', 
                        size: '', 
                        image: '', 
                        images: [], 
                        description: '',
                        email: '',
                        password: ''
                      });
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingProduct.name}</h2>
                  <p className="text-gray-600 mt-1">Product Details</p>
                </div>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingProduct(null);
                  }} 
                  className="text-gray-400 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Product Gallery
                  </h3>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <ProductGallery 
                      images={[viewingProduct.image, ...(viewingProduct.images || [])]}
                      productName={viewingProduct.name}
                    />
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Product Information
                  </h3>
                  
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Product Name:</span>
                      <span className="text-gray-900 font-medium">{viewingProduct.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Category:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {viewingProduct.category}
                      </span>
                    </div>
                    
                    {viewingProduct.size && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">Size:</span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {viewingProduct.size}
                        </span>
                      </div>
                    )}
                    
                    {!viewingProduct.size && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">Size:</span>
                        <span className="text-gray-500 text-sm italic">
                          Not specified
                        </span>
                      </div>
                    )}
                    
                    <div className="py-2">
                      <span className="font-semibold text-gray-700 block mb-2">Description:</span>
                      <p className="text-gray-900 leading-relaxed bg-white p-4 rounded-lg border border-gray-200">
                        {viewingProduct.description || "No description available."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Created:</span>
                      <span className="text-gray-600 text-sm">
                        {new Date(viewingProduct.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="font-semibold text-gray-700">Product ID:</span>
                      <span className="text-gray-600 text-sm font-mono">
                        {viewingProduct._id}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        setViewingProduct(null);
                        handleEdit(viewingProduct);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                    >
                      Edit This Product
                    </button>
                    <button 
                      onClick={() => {
                        setShowViewModal(false);
                        setViewingProduct(null);
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex-1"
                    >
                      Close
                    </button>
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