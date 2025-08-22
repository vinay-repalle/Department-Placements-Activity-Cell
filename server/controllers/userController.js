/**
 * User Controller
 * 
 * Handles user profile management, role-specific operations, and user data
 * manipulation throughout the application.
 * 
 * Main Functions:
 * - getProfile: Retrieve user profile data
 * - updateProfile: Modify user information
 * - deleteUser: Remove user account
 * - listUsers: Get filtered user list
 * - updateRole: Modify user role
 * - uploadProfileImage: Handle profile photo uploads
 * - updateSettings: Manage user preferences
 * 
 * Features:
 * - Profile management
 * - Role-based operations
 * - Image upload handling
 * - Settings management
 * - Activity tracking
 * 
 * Access Control:
 * - Self profile management
 * - Admin user management
 * - Role-based restrictions
 * 
 * Data Handling:
 * - Input validation
 * - File uploads
 * - Data sanitization
 * - Profile completeness
 * 
 * Dependencies:
 * - User model
 * - File upload service
 * - Validation middleware
 * - Email service
 * 
 * @type {module} User management controller
 */

const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { exportUserData, exportSessionData } = require('../utils/excelService');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

exports.uploadProfileImage = upload.single('profileImage');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Handle profile image upload
    if (req.file) {
      req.body.profileImage = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const alumni = await User.countDocuments({ role: 'alumni' });
    const faculty = await User.countDocuments({ role: 'faculty' });

    // Branch-wise distribution
    const branchWise = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Year-wise distribution
    const yearWise = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$yearOfStudy', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        students,
        alumni,
        faculty,
        branchWise,
        yearWise
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { type } = req.query;
    let excelBuffer;

    if (type === 'users') {
      excelBuffer = await exportUserData();
    } else if (type === 'sessions') {
      excelBuffer = await exportSessionData();
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid export type'
      });
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-export.xlsx`);

    // Send the Excel file
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 