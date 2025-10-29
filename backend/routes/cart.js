const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, requireCustomer } = require('../middleware/auth');
const CartService = require('../services/CartService');

const router = express.Router();

// Get cart items
router.get('/', authenticate, requireCustomer, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = await CartService.getCart(userId);

    res.json({
      message: 'Cart retrieved successfully',
      cart
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add', authenticate, requireCustomer, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('unit').trim().notEmpty().withMessage('Unit is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity, name, price, unit } = req.body;
    const userId = req.user._id.toString();

    const cart = await CartService.addToCart(userId, productId, quantity, name, price, unit);

    res.json({
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('stock') ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/item/:productId', authenticate, requireCustomer, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id.toString();

    const cart = await CartService.updateCartItem(userId, productId, quantity);

    res.json({
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Cart update error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('stock') ? 400 : 500;
    res.status(statusCode).json({ message: error.message || 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/item/:productId', authenticate, requireCustomer, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id.toString();

    const cart = await CartService.removeFromCart(userId, productId);

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Cart item removal error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ message: error.message || 'Internal server error' });
  }
});

// Clear cart
router.delete('/clear', authenticate, requireCustomer, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = await CartService.clearCart(userId);

    res.json({
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
