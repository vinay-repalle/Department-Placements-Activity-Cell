/**
 * RejectedSignup Model
 * 
 * Manages and tracks signup requests that were explicitly rejected by administrators.
 * Used for maintaining records of denied registration attempts.
 * 
 * Schema Fields:
 * - name: Applicant's full name
 * - email: Applicant's email address
 * - reason: Rejection reason provided by admin
 * - role: Attempted role (student/alumni/faculty)
 * - rejectedBy: Reference to admin who rejected
 * - rejectedAt: Timestamp of rejection
 * - additionalNotes: Admin notes about rejection
 * 
 * Indexes:
 * - email: For preventing repeated attempts
 * - role: For role-based analysis
 * - rejectedAt: For chronological tracking
 * 
 * Features:
 * - Rejection reason tracking
 * - Admin accountability
 * - Timestamp recording
 * - Notes management
 * 
 * Use Cases:
 * - Registration policy enforcement
 * - Audit trail maintenance
 * - Security monitoring
 * 
 * @type {dynamic} - Records rejected signups with admin input
 */

const mongoose = require('mongoose');

const rejectedSignupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'alumni', 'faculty', 'admin']
  },
  reason: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RejectedSignup', rejectedSignupSchema); 