const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.uploadProfileImage, userController.updateProfile);

// Admin only routes
router.use(authController.restrictTo('admin'));
router.get('/users', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/export', userController.exportData);

module.exports = router; 