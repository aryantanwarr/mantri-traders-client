import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shadow-lg">
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
              <div className="text-white font-bold text-3xl hidden">
                <div className="flex items-center justify-center">
                  <span className="text-4xl">M</span>
                  <span className="text-4xl transform rotate-90 translate-x-1">T</span>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Mantri Traders
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Premium Tiles & Flooring Solutions
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            Your trusted partner for high-quality tiles in Jaipur. Transform your space with our exclusive collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/products" 
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block"
            >
              Explore Products
            </a>
            <a 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition duration-300 inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Quick Contact Banner */}
      <section className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to Transform Your Space?</h3>
              <p className="text-blue-100">Contact Rishabh Mantri for expert guidance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:+916376117352" 
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                +91 6376117352
              </a>
              <a 
                href="mailto:rishabhmantri10074@gmail.com" 
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Our Tile Collections
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover our premium range of tiles for every room and style preference
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Bathroom Tiles', icon: '🚿', desc: 'Premium tiles for your bathroom' },
              { name: 'Kitchen Tiles', icon: '🍳', desc: 'Stylish tiles for your kitchen' },
              { name: 'Outdoor Tiles', icon: '🌿', desc: 'Durable tiles for outdoor spaces' },
              { name: 'Living Room Tiles', icon: '🛋️', desc: 'Elegant tiles for living areas' }
            ].map((room) => (
              <div key={room.name} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-8 text-center group flex flex-col h-full">
                {/* Icon Section */}
                <div className="flex-1 flex flex-col items-center justify-start">
                  <div className="text-5xl mb-6">{room.icon}</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-4 group-hover:text-blue-700 transition">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{room.desc}</p>
                </div>
                
                {/* Button Section - Always at bottom */}
                <div className="mt-8 pt-4">
                  <a 
                    href="/products" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-sm"
                  >
                    View Collection
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                About Mantri Traders
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Mantri Traders is your trusted partner for premium tiles and flooring solutions in Jaipur. We understand that your home is your sanctuary, and we believe that every space deserves the finest materials and craftsmanship.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With years of experience in the tile industry, we have built a reputation for excellence, reliability, and customer satisfaction. Our commitment to quality and service has made us a trusted name in the region.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/about" 
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Learn More
                </a>
                <a 
                  href="/contact" 
                  className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
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
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg hidden">
                    <div className="text-white font-bold text-4xl">
                      <div className="flex items-center justify-center">
                        <span className="text-5xl">M</span>
                        <span className="text-5xl transform rotate-90 translate-x-1">T</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Rishabh Mantri</h3>
                <p className="text-gray-600 mb-4">Owner & Proprietor</p>
                <p className="text-sm text-gray-500 mb-4">GSTIN: 08GFFPM6807B1ZH</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">📍 Plot No. 36, Pancholi Vihar, Narayan Vihar</p>
                  <p className="text-gray-600">📞 +91 6376117352, +91 9414202233</p>
                  <p className="text-gray-600">✉️ rishabhmantri10074@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Why Choose Mantri Traders?
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We provide the best quality tiles and flooring solutions with exceptional service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Premium Quality', icon: '⭐', desc: 'Only the finest tiles from reputed manufacturers' },
              { title: 'Expert Guidance', icon: '👨‍💼', desc: 'Professional advice from Rishabh Mantri' },
              { title: 'Wide Selection', icon: '🏪', desc: 'Extensive range for every style and budget' },
              { title: 'Customer Satisfaction', icon: '❤️', desc: 'Your satisfaction is our top priority' },
              { title: 'Trusted Service', icon: '🤝', desc: 'Reliable and honest business practices' },
              { title: 'Local Expertise', icon: '🏠', desc: 'Deep understanding of Jaipur market needs' }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Space?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today for expert guidance and premium tile solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/products" 
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300"
            >
              Browse Products
            </a>
            <a 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 