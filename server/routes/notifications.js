/**
 * Notifications Route Handler
 * 
 * This file handles all notification-related API endpoints.
 * 
 * Features:
 * - Dynamic notification fetching based on user ID
 * - CRUD operations for notifications (Create, Read, Update, Delete)
 * - Protected routes using JWT authentication
 * - Automatic sorting of notifications by creation date
 * 
 * Components Used:
 * - Express Router: For handling HTTP requests
 * - Mongoose: For database operations
 * - JWT Authentication: Through protect middleware
 * 
 * Data Flow:
 * - All routes are protected and require a valid JWT token
 * - Notifications are linked to specific users through recipient field
 * - Responses follow a consistent format: { success: boolean, data/message: any }
 * 
 * @type {dynamic} - All routes are dynamic and data-driven
 */

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the current user
 * @access  Private
 * @returns {Array} notifications - Array of notification objects
 */
router.get('/', protect, async (req, res) => {
  try {
    console.log('GET /api/notifications called');
    console.log('Authenticated user:', req.user && req.user.id);
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    console.log('Fetched notifications:', notifications.length, notifications.map(n => n._id));
    
    res.json({
      success: true,
      data: {
        notifications
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @access  Private
 * @param   {string} title - Notification title
 * @param   {string} message - Notification message
 * @param   {string} type - Notification type
 * @param   {string} link - Optional link associated with notification
 * @param   {string} recipient - Optional recipient ID (defaults to current user)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, message, type, link, recipient } = req.body;

    const notification = new Notification({
      recipient: recipient || req.user.id,
      title,
      message,
      type,
      link
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: {
        notification
      }
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification'
    });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 * @param   {string} id - Notification ID
 */
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.id
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: {
        notification
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 * @param   {string} id - Notification ID
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
});

module.exports = router; 