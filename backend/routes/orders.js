const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const { authenticate, requireCustomer } = require('../middleware/auth');
const CartService = require('../services/CartService');
const EmailService = require('../services/EmailService');
const NotificationService = require('../services/NotificationService');

const router = express.Router();

// Place order (checkout)
router.post('/checkout', authenticate, requireCustomer, [
  body('deliveryAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').trim().notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('paymentMethod').isIn(['cod', 'card', 'upi', 'wallet']).withMessage('Valid payment method is required'),
  body('deliverySlot.date').isISO8601().withMessage('Valid delivery date is required'),
  body('deliverySlot.timeSlot').trim().notEmpty().withMessage('Delivery time slot is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { deliveryAddress, paymentMethod, deliverySlot, notes, offerCode } = req.body;
    const userId = req.user._id;

    // Get cart
    const cart = await CartService.getCart(userId.toString());
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify product availability and prices
    const productIds = cart.items.map(item => item.productId);
    const products = await Product.find({ 
      _id: { $in: productIds }, 
      isActive: true 
    });

    if (products.length !== cart.items.length) {
      return res.status(400).json({ message: 'Some products are no longer available' });
    }

    // Check stock availability
    for (const cartItem of cart.items) {
      const product = products.find(p => p._id.toString() === cartItem.productId);
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit
      };
    });

    // Apply offer if provided
    let discount = 0;
    if (offerCode) {
      const offer = await Offer.findOne({
        code: offerCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (offer && subtotal >= offer.minimumOrder) {
        if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
          return res.status(400).json({ message: 'Offer usage limit exceeded' });
        }

        if (offer.discountType === 'percentage') {
          discount = (subtotal * offer.value) / 100;
          if (offer.maximumDiscount) {
            discount = Math.min(discount, offer.maximumDiscount);
          }
        } else {
          discount = offer.value;
        }

        // Update offer usage
        await Offer.findByIdAndUpdate(offer._id, {
          $inc: { usedCount: 1 }
        });
      }
    }

    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = subtotal >= 500 ? 0 : 50; // Free delivery above ₹500
    const total = subtotal + tax + deliveryFee - discount;

    // Generate unique order number (e.g., ORD20250824-XXXX)
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD${dateStr}-${randomDigits}`;

    // Create order
    const order = new Order({
      userId,
      orderNumber,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      deliveryAddress,
      paymentMethod,
      deliverySlot,
      notes,
      estimatedDelivery: new Date(deliverySlot.date)
    });

    await order.save();

    // Update product stock (simulate inventory API call)
    await updateInventoryStock(orderItems);

    // Assign delivery partner (simulate delivery API call)
    await assignDeliveryPartner(order._id);

    // Clear cart
    await CartService.clearCart(userId.toString());

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email phone')
      .lean();

    // Send order confirmation notifications (don't fail order if notifications fail)
    try {
      await NotificationService.sendOrderConfirmation(populatedOrder.userId, {
        _id: populatedOrder._id,
        orderNumber: populatedOrder.orderNumber,
        total: populatedOrder.total,
        estimatedDelivery: populatedOrder.estimatedDelivery
      });
    } catch (notificationError) {
      console.error('Order confirmation notification failed:', notificationError);
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get customer orders
router.get('/', authenticate, requireCustomer, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.user._id };
    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
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

// Get order by ID
// Get order by ID (exclude /track)
router.get('/:id([a-fA-F0-9]{24})', authenticate, requireCustomer, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    .populate('userId', 'name email phone')
    .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order retrieved successfully',
      order
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Track order
// Public order tracking by orderNumber (for Track Order page)
router.get('/track', async (req, res) => {
  try {
    console.log('Tracking order with query:', req.query);
    const { orderNumber, email } = req.query;
    if (!orderNumber) {
      return res.status(400).json({ message: 'Order number is required' });
    }
    // Find order by orderNumber
    let order;
    if (email) {
      // If deliveryAddress.email exists in schema, match it; otherwise, fallback to orderNumber only
      order = await Order.findOne({
        orderNumber,
        'deliveryAddress.email': email
      }).lean();
      if (!order) {
        // Fallback: try matching only orderNumber
        order = await Order.findOne({ orderNumber }).lean();
      }
    } else {
      order = await Order.findOne({ orderNumber }).lean();
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Simulate live tracking
    const liveTracking = await getLiveTrackingData(order._id);
    res.json({
      order: {
        id: order._id,
        status: order.status,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        total: order.total,
        items: order.items,
        deliveryAddress: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}`,
        timeline: order.trackingUpdates?.map(update => ({
          status: update.status,
          description: update.message,
          timestamp: update.timestamp,
          completed: ['delivered', 'out_for_delivery', 'packed', 'preparing', 'confirmed', 'Order Placed', 'Order Confirmed', 'Preparing Order', 'Out for Delivery'].includes(update.status)
        })) || []
      }
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cancel order
router.put('/:id/cancel', authenticate, requireCustomer, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['packed', 'out_for_delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    order.status = 'cancelled';
    order.trackingUpdates.push({
      status: 'cancelled',
      message: 'Order cancelled by customer',
      timestamp: new Date()
    });

    await order.save();

    // Restore inventory (simulate inventory API call)
    await restoreInventoryStock(order.items);

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper functions to simulate external API calls

async function updateInventoryStock(items) {
  // Simulate inventory management system API call
  try {
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    console.log('Inventory updated successfully');
  } catch (error) {
    console.error('Inventory update failed:', error);
    throw error;
  }
}

async function restoreInventoryStock(items) {
  // Simulate inventory restoration
  try {
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }
    console.log('Inventory restored successfully');
  } catch (error) {
    console.error('Inventory restoration failed:', error);
  }
}

async function assignDeliveryPartner(orderId) {
  // Simulate delivery management API call
  try {
    const deliveryPartnerId = `DP${Date.now()}`;
    await Order.findByIdAndUpdate(orderId, {
      deliveryPartnerId,
      $push: {
        trackingUpdates: {
          status: 'confirmed',
          message: 'Order confirmed and assigned to delivery partner',
          timestamp: new Date()
        }
      }
    });
    console.log(`Order ${orderId} assigned to delivery partner ${deliveryPartnerId}`);
  } catch (error) {
    console.error('Delivery assignment failed:', error);
  }
}

async function getLiveTrackingData(orderId) {
  // Simulate live tracking data from delivery API
  return {
    latitude: 12.9716,
    longitude: 77.5946,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  };
}

module.exports = router;
