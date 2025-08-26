const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  store: {
    storeName: {
      type: String,
      default: 'Fresh Grocery Store'
    },
    storeEmail: {
      type: String,
      default: 'admin@grocery.com'
    },
    storePhone: {
      type: String,
      default: '+91 9876543210'
    },
    storeAddress: {
      type: String,
      default: '123 Market Street, City, State 12345'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    taxRate: {
      type: Number,
      default: 18
    },
    deliveryFee: {
      type: Number,
      default: 50
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500
    }
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    orderNotifications: {
      type: Boolean,
      default: true
    },
    lowStockAlerts: {
      type: Boolean,
      default: true
    },
    customerSignups: {
      type: Boolean,
      default: false
    },
    dailyReports: {
      type: Boolean,
      default: true
    }
  },
  security: {
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 60
    },
    passwordExpiry: {
      type: Number,
      default: 90
    },
    loginAttempts: {
      type: Number,
      default: 5
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function(updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
