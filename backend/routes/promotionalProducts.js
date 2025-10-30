const express = require('express');
const PromotionalProduct = require('../models/PromotionalProduct');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active promotional products
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 10, audience = 'all' } = req.query;
    const currentDate = new Date();

    const query = {
      isActive: true,
      validFrom: { $lte: currentDate }
    };

    // Add validUntil condition if it exists
    query.$or = [
      { validUntil: { $exists: false } },
      { validUntil: null },
      { validUntil: { $gte: currentDate } }
    ];

    // Filter by target audience
    if (audience !== 'all') {
      query.targetAudience = { $in: ['all', audience] };
    }

    const promotionalProducts = await PromotionalProduct.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(Number.parseInt(limit))
      .lean();

    res.json({
      message: 'Promotional products retrieved successfully',
      promotionalProducts
    });

  } catch (error) {
    console.error('Promotional products fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get promotional product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const promotionalProduct = await PromotionalProduct.findOne({
      _id: req.params.id,
      isActive: true
    }).lean();

    if (!promotionalProduct) {
      return res.status(404).json({ message: 'Promotional product not found' });
    }

    res.json({
      message: 'Promotional product retrieved successfully',
      promotionalProduct
    });

  } catch (error) {
    console.error('Promotional product fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new promotional product (admin only)
router.post('/', async (req, res) => {
  try {
    const promotionalProduct = new PromotionalProduct(req.body);
    await promotionalProduct.save();

    res.status(201).json({
      message: 'Promotional product created successfully',
      promotionalProduct
    });

  } catch (error) {
    console.error('Promotional product creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update promotional product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const promotionalProduct = await PromotionalProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotionalProduct) {
      return res.status(404).json({ message: 'Promotional product not found' });
    }

    res.json({
      message: 'Promotional product updated successfully',
      promotionalProduct
    });

  } catch (error) {
    console.error('Promotional product update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete promotional product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const promotionalProduct = await PromotionalProduct.findByIdAndDelete(req.params.id);

    if (!promotionalProduct) {
      return res.status(404).json({ message: 'Promotional product not found' });
    }

    res.json({
      message: 'Promotional product deleted successfully'
    });

  } catch (error) {
    console.error('Promotional product deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Track click on promotional product
router.post('/:id/click', async (req, res) => {
  try {
    await PromotionalProduct.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } }
    );

    res.json({ message: 'Click tracked successfully' });

  } catch (error) {
    console.error('Click tracking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
