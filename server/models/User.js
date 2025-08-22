/**
 * User Model
 * 
 * Defines the schema and methods for user data in the application.
 * Handles all user types: students, alumni, faculty, and admins.
 * 
 * Schema Fields:
 * - name: User's full name
 * - email: Unique email address
 * - password: Hashed password
 * - role: User role (student/alumni/faculty/admin)
 * - profileImage: Profile picture URL
 * - branch: Academic branch/department
 * - year: Current year (for students)
 * - graduationYear: Graduation year (for alumni)
 * - bio: User biography
 * - skills: Array of skills
 * - achievements: Array of achievements
 * - socialLinks: Social media profiles
 * - isVerified: Email verification status
 * - resetPasswordToken: For password reset
 * - resetPasswordExpires: Token expiry
 * 
 * Methods:
 * - comparePassword: Password verification
 * - generateAuthToken: JWT token generation
 * - toJSON: Data transformation for API
 * 
 * Indexes:
 * - email: Unique index
 * - role: For role-based queries
 * 
 * @type {dynamic} - Includes methods for auth and data manipulation
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'faculty', 'admin'],
    required: true
  },
  // Student specific fields
  studentId: {
    type: String,
    sparse: true
  },
  department: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'CHEM', 'MME'],
    sparse: true
  },
  yearOfStudy: {
    type: String,
    enum: ['E-1', 'E-2', 'E-3', 'E-4'],
    sparse: true
  },
  // Alumni specific fields
  collegeId: {
    type: String,
    sparse: true
  },
  // Faculty specific fields
  facultyId: {
    type: String,
    sparse: true
  },
  // Admin specific fields
  designation: {
    type: String,
    sparse: true
  },
  phoneNumber: {
    type: String,
    sparse: true
  },
  profilePhoto: {
    type: String,
    default: '/src/assets/profile1.jpg'
  },
  yearOfPassedOut: {
    type: Number, // For alumni
  },
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    if (!this.password) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

module.exports = mongoose.model('User', userSchema); 