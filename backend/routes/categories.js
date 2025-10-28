const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.json({
      message: 'Categories retrieved successfully',
      categories
    });

  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    }).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Category retrieved successfully',
      category
    });

  } catch (error) {
    console.error('Category fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
