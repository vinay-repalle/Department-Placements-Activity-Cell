const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  purpose: {
    type: String,
    enum: ['signup', 'password_reset', 'email_verification'],
    default: 'signup'
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date();
};

// Method to mark OTP as used
otpSchema.methods.markAsUsed = function() {
  this.isUsed = true;
  return this.save();
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create OTP for email
otpSchema.statics.createOTP = async function(email, purpose = 'signup') {
  // Delete any existing unused OTPs for this email and purpose
  await this.deleteMany({ 
    email, 
    purpose, 
    isUsed: false 
  });

  // Generate new OTP
  const otp = this.generateOTP();
  
  // Create new OTP document
  const otpDoc = new this({
    email,
    otp,
    purpose
  });

  return await otpDoc.save();
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(email, otp, purpose = 'signup') {
  const otpDoc = await this.findOne({
    email,
    otp,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!otpDoc) {
    return null;
  }

  // Mark OTP as used
  await otpDoc.markAsUsed();
  
  return otpDoc;
};

module.exports = mongoose.model('OTP', otpSchema); 