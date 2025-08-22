/**
 * Notification Model
 * 
 * Defines the schema for system notifications sent to users.
 * Handles various types of notifications including session updates,
 * system alerts, and user interactions.
 * 
 * Schema Fields:
 * - recipient: Reference to User who receives the notification
 * - title: Notification title
 * - message: Detailed notification message
 * - type: Notification type (session/system/user)
 * - read: Whether notification has been read
 * - link: Optional link associated with notification
 * - createdAt: Timestamp of notification creation
 * 
 * Indexes:
 * - recipient: For quick lookup of user's notifications
 * - read: For filtering read/unread notifications
 * - createdAt: For chronological sorting
 * 
 * Features:
 * - Automatic timestamp generation
 * - Read status tracking
 * - Link association for navigation
 * - Type categorization
 * 
 * @type {dynamic} - Real-time notification management
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'event', 'announcement', 'welcome', 'session', 'terms'],
    default: 'message'
  },
  link: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema); 