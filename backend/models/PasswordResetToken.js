const mongoose = require('mongoose');
const crypto = require('node:crypto');

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - automatically delete expired tokens
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate secure token before saving
passwordResetTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Index for performance
passwordResetTokenSchema.index({ userId: 1 });
passwordResetTokenSchema.index({ email: 1 });
passwordResetTokenSchema.index({ token: 1 });

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
