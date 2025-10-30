const mongoose = require('mongoose');

const promotionalProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_one_get_one', 'free_shipping'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonLink: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  targetAudience: {
    type: String,
    enum: ['all', 'new_customers', 'returning_customers', 'premium_members'],
    default: 'all'
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
promotionalProductSchema.index({ isActive: 1, priority: -1, createdAt: -1 });
promotionalProductSchema.index({ validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('PromotionalProduct', promotionalProductSchema);
