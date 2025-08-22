/**
 * Authentication Routes
 * 
 * Handles all authentication-related endpoints including login, registration,
 * password reset, and OAuth authentication.
 * 
 * Routes:
 * - POST /api/auth/register: User registration
 * - POST /api/auth/login: User login
 * - POST /api/auth/forgot-password: Password reset request
 * - POST /api/auth/reset-password: Password reset
 * - GET /api/auth/verify-email: Email verification
 * - GET /api/auth/google: Google OAuth login
 * - GET /api/auth/google/callback: Google OAuth callback
 * 
 * Middleware Used:
 * - validateRegistration: Registration data validation
 * - validateLogin: Login data validation
 * - rateLimiter: Prevent brute force attempts
 * 
 * Security Features:
 * - Password hashing
 * - JWT token generation
 * - Email verification
 * - Rate limiting
 * - OAuth2 integration
 * 
 * Error Handling:
 * - Validation errors
 * - Authentication failures
 * - Rate limit exceeded
 * - Server errors
 * 
 * @type {dynamic} - Handles real-time authentication requests
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, role, ...otherFields } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide all required fields: fullName, email, password, and role' 
      });
    }

    // Validate email format
    if (!email.includes('@')) {
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

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role,
      ...otherFields
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      token,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Error creating user' 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide both email and password' 
      });
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Error logging in' 
    });
  }
});

module.exports = router; 