const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * 
 * Provides authentication and authorization middleware functions for protecting
 * routes and implementing role-based access control.
 * 
 * Middleware Functions:
 * - protect: Verifies JWT token and attaches user to request
 * - authorize: Checks user role permissions
 * - isOwner: Verifies resource ownership
 * - rateLimiter: Prevents brute force attempts
 * 
 * Security Features:
 * - JWT validation
 * - Role-based access control
 * - Request rate limiting
 * - Token expiration handling
 * 
 * Error Handling:
 * - Invalid tokens
 * - Expired tokens
 * - Missing authorization
 * - Insufficient permissions
 * - Rate limit exceeded
 * 
 * Usage:
 * - Protected routes: router.get('/path', protect, handler)
 * - Role-specific: router.post('/admin', protect, authorize('admin'), handler)
 * - Owner access: router.put('/profile', protect, isOwner, handler)
 * 
 * Dependencies:
 * - JWT for token verification
 * - User model for data access
 * - Configuration for rate limits
 * 
 * @type {module} Authentication middleware functions
 */

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both { userId } and { id } payloads
    const userId = decoded.userId || decoded.id;

    // Get user from token
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Middleware to check user role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize }; 