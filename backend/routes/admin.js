const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// ANALYTICS ENDPOINT
router.get('/analytics', async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Revenue analytics
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            $lt: new Date(now.getFullYear(), now.getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Orders analytics
    const ordersToday = await Order.countDocuments({
      createdAt: { 
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      }
    });

    const ordersThisMonth = await Order.countDocuments({
      createdAt: { 
        $gte: new Date(now.getFullYear(), now.getMonth(), 1)
      }
    });

    const ordersLastMonth = await Order.countDocuments({
      createdAt: { 
        $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        $lt: new Date(now.getFullYear(), now.getMonth(), 1)
      }
    });

    // Customer analytics
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await Order.distinct('userId', {
      createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
    });
    const newCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { 
        $gte: new Date(now.getFullYear(), now.getMonth(), 1)
      }
    });

    // Product analytics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ 
      isActive: true, 
      stock: { $lt: 10 } 
    });
    const outOfStockProducts = await Product.countDocuments({ 
      isActive: true, 
      stock: 0 
    });

    // Top products
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          id: '$_id',
          name: '$product.name',
          sales: 1,
          revenue: 1
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // Daily sales for chart
    const dailySales = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          orders: 1,
          revenue: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      revenue: {
        today: todayRevenue[0]?.total || 0,
        thisMonth: monthlyRevenue[0]?.total || 0,
        lastMonth: lastMonthRevenue[0]?.total || 0
      },
      orders: {
        today: ordersToday,
        thisMonth: ordersThisMonth,
        lastMonth: ordersLastMonth
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers.length,
        new: newCustomers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      },
      topProducts,
      dailySales
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// SETTINGS ENDPOINTS
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/settings/store', [
  body('storeName').optional().trim().notEmpty().withMessage('Store name cannot be empty'),
  body('storeEmail').optional().isEmail().withMessage('Valid email is required'),
  body('storePhone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('taxRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Tax rate must be between 0-100'),
  body('deliveryFee').optional().isFloat({ min: 0 }).withMessage('Delivery fee must be positive'),
  body('freeDeliveryThreshold').optional().isFloat({ min: 0 }).withMessage('Free delivery threshold must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const storeSettings = req.body;
    const settings = await Settings.updateSettings({ store: storeSettings });
    
    res.json({
      message: 'Store settings updated successfully',
      settings: settings.store
    });
  } catch (error) {
    console.error('Store settings update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/settings/notifications', async (req, res) => {
  try {
    const notificationSettings = req.body;
    const settings = await Settings.updateSettings({ notifications: notificationSettings });
    
    res.json({
      message: 'Notification settings updated successfully',
      settings: settings.notifications
    });
  } catch (error) {
    console.error('Notification settings update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/settings/security', [
  body('sessionTimeout').optional().isInt({ min: 1 }).withMessage('Session timeout must be positive'),
  body('passwordExpiry').optional().isInt({ min: 1 }).withMessage('Password expiry must be positive'),
  body('loginAttempts').optional().isInt({ min: 1 }).withMessage('Login attempts must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const securitySettings = req.body;
    const settings = await Settings.updateSettings({ security: securitySettings });
    
    res.json({
      message: 'Security settings updated successfully',
      settings: settings.security
    });
  } catch (error) {
    console.error('Security settings update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order with notes
router.put('/orders/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('items.productId', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single offer details
router.get('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    console.error('Offer fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DASHBOARD STATS
// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordersToday = await Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      message: 'Dashboard stats retrieved successfully',
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        revenueThisMonth: revenueThisMonth[0]?.total || 0,
        ordersToday
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// USER MANAGEMENT
// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, role = 'customer' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find({ role })
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments({ role })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Users retrieved successfully',
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ORDER MANAGEMENT
// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: {
          trackingUpdates: {
            status,
            message: `Order status updated to ${status}`,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PRODUCT MANAGEMENT

// Add new product
router.post('/products', [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['fruits', 'vegetables', 'dairy', 'meat', 'grains', 'beverages', 'snacks', 'household']).withMessage('Valid category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
  body('unit').isIn(['kg', 'g', 'l', 'ml', 'piece', 'pack']).withMessage('Valid unit is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    // Sync with inventory API (simulated)
    await syncWithInventoryAPI(product);

    res.status(201).json({
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock quantity is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Sync with inventory API (simulated)
    await syncWithInventoryAPI(product);

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product deleted successfully',
      product
    });

  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all products (admin view)
router.get('/products', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      isActive, 
      search 
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Products retrieved successfully',
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Admin products fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single product (admin view)
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product retrieved successfully',
      product
    });

  } catch (error) {
    console.error('Admin product fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ORDER MANAGEMENT

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      customerId 
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (customerId) query.userId = customerId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Orders retrieved successfully',
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'packed', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Valid status is required'),
  body('message').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.trackingUpdates.push({
      status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date()
    });

    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();

    // Update delivery management system (simulated)
    await updateDeliveryStatus(order._id, status);

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// OFFER MANAGEMENT

// Create offer
router.post('/offers', [
  body('code').trim().isLength({ min: 3 }).withMessage('Offer code must be at least 3 characters'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('discountType').isIn(['percentage', 'fixed']).withMessage('Valid discount type is required'),
  body('value').isFloat({ min: 0 }).withMessage('Valid discount value is required'),
  body('validFrom').isISO8601().withMessage('Valid start date is required'),
  body('validUntil').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const offerData = req.body;
    offerData.code = offerData.code.toUpperCase();

    // Check if offer code already exists
    const existingOffer = await Offer.findOne({ code: offerData.code });
    if (existingOffer) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }

    const offer = new Offer(offerData);
    await offer.save();

    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });

  } catch (error) {
    console.error('Offer creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all offers
router.get('/offers', async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const [offers, total] = await Promise.all([
      Offer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Offer.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Offers retrieved successfully',
      offers,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOffers: total
      }
    });

  } catch (error) {
    console.error('Offers fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update offer
router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json({
      message: 'Offer updated successfully',
      offer
    });

  } catch (error) {
    console.error('Offer update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// REPORTS

// Sales report
router.get('/reports/sales', async (req, res) => {
  try {
    const { startDate, endDate, period = 'daily' } = req.query;

    const matchStage = {
      status: { $in: ['delivered'] },
      paymentStatus: 'paid'
    };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const groupStage = {
      _id: period === 'monthly' 
        ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } },
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: '$total' },
      avgOrderValue: { $avg: '$total' }
    };

    const salesData = await Order.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
    ]);

    // Overall summary
    const summary = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);

    res.json({
      message: 'Sales report generated successfully',
      salesData,
      summary: summary[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 }
    });

  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Customer report
router.get('/reports/customers', async (req, res) => {
  try {
    // Active customers (customers with orders in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeCustomers = await Order.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Repeat customers (customers with more than 1 order)
    const repeatCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 }
        }
      },
      {
        $match: { orderCount: { $gt: 1 } }
      }
    ]);

    // Top customers by total spent
    const topCustomers = await Order.aggregate([
      {
        $match: { 
          status: 'delivered',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $project: {
          name: '$customer.name',
          email: '$customer.email',
          totalSpent: 1,
          orderCount: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      message: 'Customer report generated successfully',
      activeCustomersCount: activeCustomers.length,
      repeatCustomersCount: repeatCustomers.length,
      topCustomers
    });

  } catch (error) {
    console.error('Customer report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Dashboard summary
router.get('/dashboard/summary', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayOrders,
      monthlyOrders,
      totalProducts,
      activeOffers,
      pendingOrders
    ] = await Promise.all([
      Order.countDocuments({ 
        createdAt: { $gte: startOfDay },
        status: { $ne: 'cancelled' }
      }),
      Order.countDocuments({ 
        createdAt: { $gte: startOfMonth },
        status: { $ne: 'cancelled' }
      }),
      Product.countDocuments({ isActive: true }),
      Offer.countDocuments({ 
        isActive: true,
        validFrom: { $lte: today },
        validUntil: { $gte: today }
      }),
      Order.countDocuments({ 
        status: { $in: ['pending', 'confirmed', 'preparing'] }
      })
    ]);

    // Revenue calculation
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      message: 'Dashboard summary retrieved successfully',
      summary: {
        todayOrders,
        monthlyOrders,
        totalProducts,
        activeOffers,
        pendingOrders,
        monthlyRevenue: revenueData[0]?.monthlyRevenue || 0
      }
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper functions for external API integration

async function syncWithInventoryAPI(product) {
  // Simulate inventory management API sync
  try {
    console.log(`Syncing product ${product._id} with inventory system`);
    // In production, make actual API call to inventory system
    // await axios.post(`${process.env.INVENTORY_API_URL}/products`, product);
  } catch (error) {
    console.error('Inventory sync failed:', error);
  }
}

async function updateDeliveryStatus(orderId, status) {
  // Simulate delivery management API update
  try {
    console.log(`Updating delivery status for order ${orderId} to ${status}`);
    // In production, make actual API call to delivery system
    // await axios.put(`${process.env.DELIVERY_API_URL}/orders/${orderId}/status`, { status });
  } catch (error) {
    console.error('Delivery status update failed:', error);
  }
}

module.exports = router;
