const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { authenticate, requireCustomer } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, phone, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user address
router.get('/address', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    // Return the default address or the first one
    const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
    
    res.json({
      message: 'Address retrieved successfully',
      data: defaultAddress
    });
  } catch (error) {
    console.error('Address fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user address
router.put('/address', [
  body('type').optional().isIn(['home', 'work', 'other']).withMessage('Address type must be home, work, or other'),
  body('street').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('country').trim().notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { street, city, state, zipCode, country, type = 'home' } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Remove existing default address
    user.addresses.forEach(addr => addr.isDefault = false);
    
    // Add new address as default
    user.addresses.push({
      type,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: true
    });
    
    await user.save();

    res.json({
      message: 'Address updated successfully',
      data: user.addresses[user.addresses.length - 1]
    });

  } catch (error) {
    console.error('Address update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update password
router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', requireCustomer, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's orders: delivered and not cancelled
    const orders = await Order.find({ userId, status: { $ne: 'cancelled' } });
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Find favorite category
    const categoryCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        // Assuming we can get category from product data
        const category = item.category || 'general';
        categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
      });
    });
    
    const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'fruits'
    );
    
    const memberSince = new Date(req.user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });

    res.json({
      message: 'User statistics retrieved successfully',
      data: {
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        favoriteCategory,
        memberSince
      }
    });

  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
