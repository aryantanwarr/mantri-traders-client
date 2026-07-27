const express = require('express');
const Enquiry = require('../models/Enquiry');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Submit enquiry (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, productId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      product: productId || null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiry: {
        id: enquiry._id,
        name: enquiry.name,
        email: enquiry.email,
        message: enquiry.message
      }
    });

  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// Get all enquiries (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const enquiries = await Enquiry.find(query)
      .populate('product', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      enquiries,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalEnquiries: total
      }
    });

  } catch (error) {
    console.error('Get enquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// Get enquiry statistics (admin only) - MUST be before /:id route
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const total = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const readEnquiries = await Enquiry.countDocuments({ status: 'read' });
    const repliedEnquiries = await Enquiry.countDocuments({ status: 'replied' });
    const closedEnquiries = await Enquiry.countDocuments({ status: 'closed' });

    // Get recent enquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        total,
        new: newEnquiries,
        read: readEnquiries,
        replied: repliedEnquiries,
        closed: closedEnquiries,
        recent: recentEnquiries
      }
    });

  } catch (error) {
    console.error('Get enquiry stats error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry statistics' });
  }
});

// Get single enquiry (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('product', 'name category image');

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.json({ success: true, enquiry });

  } catch (error) {
    console.error('Get enquiry error:', error);
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
});

// Update enquiry status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    enquiry.status = status;
    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry status updated successfully',
      enquiry
    });

  } catch (error) {
    console.error('Update enquiry status error:', error);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

// Delete enquiry (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });

  } catch (error) {
    console.error('Delete enquiry error:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

module.exports = router; 