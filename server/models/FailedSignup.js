/**
 * FailedSignup Model
 * 
 * Tracks and manages failed registration attempts in the system.
 * Helps in monitoring and analyzing registration issues.
 * 
 * Schema Fields:
 * - name: Attempted user name
 * - email: Attempted email address
 * - error: Error message/reason for failure
 * - status: Status of the failed attempt (checked/unchecked)
 * - createdAt: Timestamp of the failed attempt
 * - metadata: Additional information about the attempt
 * 
 * Indexes:
 * - email: For tracking multiple attempts
 * - status: For filtering checked/unchecked entries
 * - createdAt: For chronological analysis
 * 
 * Features:
 * - Error tracking
 * - Status management
 * - Timestamp tracking
 * - Admin review system
 * 
 * Use Cases:
 * - Security monitoring
 * - User experience improvement
 * - System debugging
 * 
 * @type {dynamic} - Tracks registration failures in real-time
 */

const mongoose = require('mongoose');

const failedSignupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  error: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['checked', 'unchecked'],
    default: 'unchecked'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FailedSignup', failedSignupSchema); 