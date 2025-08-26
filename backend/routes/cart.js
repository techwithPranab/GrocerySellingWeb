const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticate, requireCustomer } = require('../middleware/auth');
const CartService = require('../services/CartService');

const router = express.Router();

// Get cart items
router.get('/', authenticate, requireCustomer, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = CartService.getCart(userId);

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
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { productId, quantity, name, price, unit } = req.body;
    const userId = req.user._id.toString();

    // Get or create cart
    let cart = CartService.getCart(userId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        price,
        quantity,
        unit,
        subtotal: price * quantity
      });
    }

    // Recalculate total
    cart.total = CartService.calculateTotal(cart.items);

    // Save cart
    CartService.setCart(userId, cart);

    res.json({
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
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

    let cart = CartService.getCart(userId);

    const itemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    cart.total = CartService.calculateTotal(cart.items);

    CartService.setCart(userId, cart);

    res.json({
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/item/:productId', authenticate, requireCustomer, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id.toString();

    let cart = CartService.getCart(userId);

    cart.items = cart.items.filter(item => item.productId !== productId);

    // Recalculate total
    cart.total = CartService.calculateTotal(cart.items);

    CartService.setCart(userId, cart);

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Cart item removal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear cart
router.delete('/clear', authenticate, requireCustomer, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    CartService.deleteCart(userId);

    res.json({
      message: 'Cart cleared successfully',
      cart: { items: [], total: 0 }
    });

  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
