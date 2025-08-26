const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const reviews = await Review.find({ 
      product: productId, 
      isVisible: true,
      moderationStatus: 'approved'
    })
    .populate('user', 'name')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ 
      product: productId, 
      isVisible: true,
      moderationStatus: 'approved'
    });

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      { 
        $match: { 
          product: mongoose.Types.ObjectId(productId), 
          isVisible: true,
          moderationStatus: 'approved'
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingBreakdown: {
            $push: '$rating'
          }
        }
      }
    ]);

    let ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let averageRating = 0;

    if (ratingStats.length > 0) {
      averageRating = ratingStats[0].averageRating;
      ratingStats[0].ratingBreakdown.forEach(rating => {
        ratingBreakdown[rating]++;
      });
    }

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      },
      ratingStats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Get user's reviews
router.get('/user', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user.userId })
      .populate('product', 'name images')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReviews = await Review.countDocuments({ user: req.user.userId });

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Validate required fields
    if (!productId || !orderId || !rating || !title || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID, Order ID, rating, title, and comment are required' 
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Check if user has purchased this product in this order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
      'items.productId': productId
    });

    if (!order) {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review products you have purchased' 
      });
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product for this order' 
      });
    }

    // Create the review
    const review = new Review({
      user: req.user.userId,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase: true
    });

    await review.save();

    // Update product's average rating
    await updateProductRating(productId);

    // Populate the review before sending response
    await review.populate('user', 'name');
    await review.populate('product', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// Update a review
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found or you do not have permission to edit it' 
      });
    }

    // Update fields if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rating must be between 1 and 5' 
        });
      }
      review.rating = rating;
    }
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    // Update product's average rating
    await updateProductRating(review.product);

    await review.populate('user', 'name');
    await review.populate('product', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found or you do not have permission to delete it' 
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product's average rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    review.helpfulCount += 1;
    await review.save();

    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    res.status(500).json({ success: false, message: 'Failed to mark review as helpful' });
  }
});

// Helper function to update product's average rating
async function updateProductRating(productId) {
  try {
    const ratingStats = await Review.aggregate([
      { 
        $match: { 
          product: productId, 
          isVisible: true,
          moderationStatus: 'approved'
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;
    const totalReviews = ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

module.exports = router;
