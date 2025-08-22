/**
 * Session Attendance Model
 * 
 * Defines the schema for tracking student attendance responses and feedback
 * for sessions. This model handles the yes/no attendance responses and
 * feedback submissions from students.
 * 
 * Schema Fields:
 * - session: Reference to Session
 * - student: Reference to User (student)
 * - willAttend: Boolean response (yes/no)
 * - feedbackSubmitted: Whether feedback was submitted
 * - feedbackText: Feedback content
 * - feedbackRating: Rating for the session (1-5)
 * - responseDate: When the response was given
 * - feedbackDate: When feedback was submitted
 * 
 * Features:
 * - Attendance tracking
 * - Feedback collection
 * - Response history
 * - Admin reporting
 * 
 * @type {dynamic} - Tracks student engagement with sessions
 */

const mongoose = require('mongoose');

const sessionAttendanceSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  willAttend: {
    type: Boolean,
    required: true
  },
  feedbackSubmitted: {
    type: Boolean,
    default: false
  },
  feedbackText: {
    type: String,
    maxlength: 1000
  },
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() { return this.feedbackSubmitted; }
  },
  responseDate: {
    type: Date,
    default: Date.now
  },
  feedbackDate: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one response per student per session
sessionAttendanceSchema.index({ session: 1, student: 1 }, { unique: true });

// Index for efficient queries
sessionAttendanceSchema.index({ session: 1, willAttend: 1 });
sessionAttendanceSchema.index({ student: 1 });

module.exports = mongoose.model('SessionAttendance', sessionAttendanceSchema); 