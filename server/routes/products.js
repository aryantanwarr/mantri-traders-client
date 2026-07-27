const express = require('express');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload.js');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, products });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product categories (public) - MUST be before /:id route
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', adminAuth,upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, size, image, images, price, featured } = req.body;

    if (!name || !category || !image) {
      return res.status(400).json({ error: 'Name, category, and image are required' });
    }

    // Prepare images array - only additional images, exclude main image
    const additionalImages = [];
    if (images && Array.isArray(images)) {
      additionalImages.push(...images.filter(img => img && img !== image));
    }

    const product = new Product({
      name,
      category,
      description,
      size,
      image,
      images: additionalImages,
      price: price || 0,
      featured: featured || false
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, category, description, size, image, images, price, featured, isActive } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;
    if (size !== undefined) product.size = size;
    if (image) product.image = image;
    if (price !== undefined) product.price = price;
    if (featured !== undefined) product.featured = featured;
    if (isActive !== undefined) product.isActive = isActive;

    // Update images array - only additional images, exclude main image
    if (images && Array.isArray(images)) {
      const currentMainImage = image || product.image;
      const additionalImages = images.filter(img => img && img !== currentMainImage);
      product.images = additionalImages;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
                          //  Product.find({_id: req.params})
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Upload image (admin only)
router.post('/upload-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router; 