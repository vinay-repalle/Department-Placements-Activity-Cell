/**
 * Session Model
 * 
 * Defines the schema for mentorship sessions between alumni/faculty and students.
 * Handles session scheduling, management, and participant tracking.
 * 
 * Schema Fields:
 * - title: Session title/topic
 * - description: Detailed session description
 * - host: Reference to User (alumni/faculty)
 * - date: Session date and time
 * - duration: Session duration in minutes
 * - type: Session type (technical/career/motivational)
 * - mode: Session mode (online/offline/hybrid)
 * - venue: Physical or virtual location
 * - maxParticipants: Maximum allowed participants
 * - participants: Array of registered students
 * - status: Session status (pending/approved/rejected/completed)
 * - materials: Array of uploaded materials/resources
 * - feedback: Array of participant feedback
 * 
 * Indexes:
 * - host: For quick lookup of host's sessions
 * - date: For chronological queries
 * - status: For filtering by session status
 * 
 * Features:
 * - Automatic status updates based on date
 * - Participant limit enforcement
 * - Material attachment handling
 * - Feedback collection
 * 
 * @type {dynamic} - Includes session management functionality
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  sessionHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feedbackFormLink: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  meetingLink: {
    type: String
  },
  sessionRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionRequest',
    required: false
  },
  manuallyCompleted: {
    type: Boolean,
    default: false
  },
  // New fields for target audience and departments
  targetAudience: {
    type: [String],
    enum: ['all', 'E-1', 'E-2', 'E-3', 'E-4'],
    default: ['all']
  },
  targetDepartments: {
    type: [String],
    enum: ['ALL', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'CHEM', 'MME'],
    default: ['ALL']
  },
  // Student attendance tracking
  studentResponses: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    willAttend: {
      type: Boolean,
      required: true
    },
    responseDate: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// New SessionRequest model for storing alumni/faculty session requests
const sessionRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  rguktAffiliation: { type: String },
  userType: { type: String, enum: ['alumni', 'faculty', 'admin'], required: true },
  graduationYear: { type: String },
  department: { type: String },
  sessionTitle: { type: String, required: true },
  sessionDescription: { type: String, required: true },
  sessionType: { type: String, required: true },
  targetAudience: { type: [String], required: true },
  targetDepartments: { type: [String], required: true }, // New field
  preferredDate: { type: String, required: true },
  preferredTime: { type: String, required: true },
  sessionMode: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'reviewed', 'approved', 'rejected'], default: 'pending' },
  idNumber: { type: String },
  contact: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
sessionSchema.index({ date: 1, status: 1 });
sessionSchema.index({ sessionHead: 1 });

module.exports = {
  Session: mongoose.model('Session', sessionSchema),
  SessionRequest: mongoose.model('SessionRequest', sessionRequestSchema)
}; 