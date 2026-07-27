import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI, enquiriesAPI, authAPI, healthCheck } from './services/api';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';

function Navbar() {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/mt-logo.png" 
                alt="Mantri Traders Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to CSS logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md hidden">
                <div className="text-white font-bold text-xl tracking-tight">
                  <div className="flex items-center justify-center">
                    <span className="text-2xl">M</span>
                    <span className="text-2xl transform rotate-90 translate-x-1">T</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mantri Traders</h1>
              <p className="text-sm text-gray-600">Premium Tiles & Flooring</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition duration-300 ${
                  location.pathname === link.to 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/mt-logo.png" 
                  alt="Mantri Traders Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to CSS logo if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md hidden">
                  <div className="text-white font-bold text-sm">
                    <div className="flex items-center justify-center">
                      <span className="text-lg">M</span>
                      <span className="text-lg transform rotate-90 translate-x-1">T</span>
                    </div>
                  </div>
                </div>
              </div>
      <div>
                <h3 className="text-xl font-bold">Mantri Traders</h3>
                <p className="text-gray-400 text-sm">Premium Tiles & Flooring</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-4">
              Your trusted partner for premium tiles and flooring solutions in Jaipur. 
              We provide the finest quality tiles with expert guidance and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="tel:+916376117352" className="text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
              <a href="mailto:rishabhmantri10074@gmail.com" className="text-blue-400 hover:text-blue-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
        </a>
      </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition">About Us</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white transition">Products</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">
                  Plot No. 36, Pancholi Vihar<br />
                  Narayan Vihar, Jaipur, Rajasthan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+91 6376117352</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">rishabhmantri10074@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Mantri Traders. All rights reserved. | GSTIN: 08GFFPM6807B1ZH
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Owner: Rishabh Mantri | Premium Tiles & Flooring Solutions in Jaipur
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  // State for products and admin authentication
  const [products, setProducts] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check backend health and load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Check if backend is running
        await healthCheck();
        console.log('Backend is running');
        
        // Load products from backend
        const productsResponse = await productsAPI.getAll();
        setProducts(productsResponse.products || []);
        
        // Check if admin is logged in
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const userResponse = await authAPI.getCurrentUser();
            setIsAdminLoggedIn(true);
            console.log('Admin is logged in:', userResponse.user);
            
            // Load enquiries if admin is logged in
            try {
              const data = await enquiriesAPI.getAll();
              setEnquiries(data.enquiries || []);
            } catch (error) {
              console.error('Failed to load enquiries:', error);
            }
          } catch (error) {
            console.log('Token invalid, clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminLoggedIn');
            setIsAdminLoggedIn(false);
          }
        }
        
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setError('Backend server is not running. Please start the backend server.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Load enquiries for admin
  const loadEnquiries = async () => {
    try {
      const data = await enquiriesAPI.getAll();
      setEnquiries(data.enquiries || []);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    }
  };

  // Load products
  const loadProducts = async () => {
    try {
      const productsResponse = await productsAPI.getAll();
      setProducts(productsResponse.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  // Handle admin login
  const handleAdminLogin = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('adminLoggedIn', 'true');
      setIsAdminLoggedIn(true);
      
      // Load enquiries after successful login
      await loadEnquiries();
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  // Handle adding new product
  const handleAddProduct = async (newProduct) => {
    try {
      const response = await productsAPI.create(newProduct);
      setProducts(prev => [...prev, response.product]);
      return { success: true, product: response.product };
    } catch (error) {
      console.error('Failed to add product:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to add product' 
      };
    }
  };

  // Handle deleting product
  const handleDeleteProduct = async (productId) => {
    try {
      await productsAPI.delete(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete product:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete product' 
      };
    }
  };

  // Handle enquiry
  const handleEnquiry = async (enquiry) => {
    try {
      const response = await enquiriesAPI.submit(enquiry);
      // Add the new enquiry to the state if admin is logged in
      if (isAdminLoggedIn) {
        setEnquiries(prev => [...prev, response.enquiry]);
      }
      return { success: true, message: 'Enquiry sent successfully!' };
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to submit enquiry' 
      };
    }
  };

  // Show loading or error state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Backend Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700 mb-2">To fix this:</p>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>Open terminal in mantritraders-backend folder</li>
              <li>Run: <code className="bg-gray-200 px-1 rounded">npm run dev</code></li>
              <li>Make sure MongoDB is running</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/products" 
            element={
              <Products 
                products={products} 
                onEnquiry={handleEnquiry}
                isAdminLoggedIn={isAdminLoggedIn}
              />
            } 
          />
          <Route 
            path="/contact" 
            element={<Contact onEnquiry={handleEnquiry} />} 
          />
          <Route 
            path="/admin" 
            element={
              <Admin 
                products={products}
                enquiries={enquiries}
                isLoggedIn={isAdminLoggedIn}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onLoadEnquiries={loadEnquiries}
                onLoadProducts={loadProducts}
              />
            } 
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App; 