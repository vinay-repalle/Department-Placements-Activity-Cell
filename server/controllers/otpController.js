/**
 * OTP Controller
 * 
 * Handles OTP generation, sending, and verification for email verification
 * during user registration and other authentication processes.
 * 
 * Functions:
 * - sendOTP: Generate and send OTP to user email
 * - verifyOTP: Verify OTP and complete registration
 * - resendOTP: Resend OTP if expired or not received
 * - sendPasswordResetOTP: Send OTP for password reset
 * - verifyPasswordResetOTP: Verify OTP and allow password reset
 * - resendPasswordResetOTP: Resend password reset OTP
 * 
 * Security Features:
 * - Rate limiting for OTP requests
 * - OTP expiration (10 minutes)
 * - One-time use OTPs
 * - Email validation
 * 
 * Error Handling:
 * - Invalid email addresses
 * - OTP expiration
 * - Rate limiting violations
 * - Email sending failures
 * 
 * Dependencies:
 * - OTP model
 * - Email service
 * - User model
 * - Rate limiting middleware
 * 
 * @type {module} OTP controller module
 */

const OTP = require('../models/OTP');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/emailService');

// Rate limiting for OTP requests (3 requests per 10 minutes per email)
const otpRequestCounts = new Map();

const isRateLimited = (email) => {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 3;
  
  if (!otpRequestCounts.has(email)) {
    otpRequestCounts.set(email, []);
  }
  
  const requests = otpRequestCounts.get(email);
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  validRequests.push(now);
  otpRequestCounts.set(email, validRequests);
  return false;
};

exports.sendOTP = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many OTP requests. Please wait 10 minutes before trying again.'
      });
    }

    // Generate and save OTP
    const otpDoc = await OTP.createOTP(email, 'signup');

    // Send OTP email
    try {
      await sendOTPEmail(email, fullName || 'User', otpDoc.otp);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, userData } = req.body;

    // Validate inputs
    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const otpDoc = await OTP.verifyOTP(email, otp, 'signup');
    
    if (!otpDoc) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Create user with verified email
    const user = await User.create({
      ...userData,
      email,
      isEmailVerified: true
    });

    // Send account creation email
    try {
      const { sendAccountCreationEmail } = require('../utils/emailService');
      await sendAccountCreationEmail(email, user.fullName, user.role);
    } catch (emailError) {
      console.error('Error sending account creation email:', emailError);
      // Don't fail the signup if email fails
    }

    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully!',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP. Please try again.'
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many OTP requests. Please wait 10 minutes before trying again.'
      });
    }

    // Generate and save new OTP
    const otpDoc = await OTP.createOTP(email, 'signup');

    // Send new OTP email
    try {
      await sendOTPEmail(email, fullName || 'User', otpDoc.otp);
    } catch (emailError) {
      console.error('Error sending resend OTP email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'New OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend OTP. Please try again.'
    });
  }
};

// Password Reset OTP Functions
exports.sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that email address'
      });
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many OTP requests. Please wait 10 minutes before trying again.'
      });
    }

    // Generate and save OTP
    const otpDoc = await OTP.createOTP(email, 'password_reset');

    // Send OTP email
    try {
      await sendOTPEmail(email, user.fullName, otpDoc.otp);
    } catch (emailError) {
      console.error('Error sending password reset OTP email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Password reset OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Send password reset OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, OTP, and new password are required'
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify OTP
    const otpDoc = await OTP.verifyOTP(email, otp, 'password_reset');
    
    if (!otpDoc) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully!'
    });
  } catch (error) {
    console.error('Verify password reset OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password. Please try again.'
    });
  }
};

exports.resendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with that email address'
      });
    }

    // Check rate limiting
    if (isRateLimited(email)) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many OTP requests. Please wait 10 minutes before trying again.'
      });
    }

    // Generate and save new OTP
    const otpDoc = await OTP.createOTP(email, 'password_reset');

    // Send new OTP email
    try {
      await sendOTPEmail(email, user.fullName, otpDoc.otp);
    } catch (emailError) {
      console.error('Error sending resend password reset OTP email:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email. Please try again.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'New password reset OTP sent successfully to your email',
      data: {
        email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Resend password reset OTP error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resend OTP. Please try again.'
    });
  }
}; 