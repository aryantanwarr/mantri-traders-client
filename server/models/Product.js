const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', category: 'text', description: 'text', size: 'text' });

module.exports = mongoose.model('Product', productSchema); 