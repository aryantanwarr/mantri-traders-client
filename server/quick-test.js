const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(express.json());

// Simple User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantritraders')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create admin user
app.post('/setup', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: existingAdmin.email });
    }

    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@mantritraders.com',
      password: process.env.ADMIN_PASSWORD || 'MantriTraders2024!',
      role: 'admin'
    });

    await adminUser.save();
    res.json({ 
      success: true, 
      message: 'Admin created successfully',
      email: adminUser.email,
      password: process.env.ADMIN_PASSWORD
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: password ? '***' : 'missing' });
    console.log('Expected email:', process.env.ADMIN_EMAIL);
    console.log('Expected password:', process.env.ADMIN_PASSWORD);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Environment variables:');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);
}); 