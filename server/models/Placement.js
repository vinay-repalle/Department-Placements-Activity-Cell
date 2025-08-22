/**
 * Placement Model
 * 
 * Defines the schema for student placements and internships.
 * Tracks placement opportunities, applications, and outcomes.
 * 
 * Schema Fields:
 * - student: Reference to User (student)
 * - company: Company name
 * - position: Job title/role
 * - type: Placement type (full-time/internship)
 * - status: Application status (pending/accepted/rejected)
 * - package: Compensation details
 * - location: Job location
 * - startDate: Employment start date
 * - offerLetter: Document reference
 * - description: Role description
 * - requirements: Job requirements
 * - applicationDate: Date of application
 * 
 * Indexes:
 * - student: For student's placement history
 * - company: For company-wise placements
 * - status: For filtering by application status
 * 
 * Features:
 * - Offer letter document handling
 * - Status tracking
 * - Package details management
 * - Application timeline tracking
 * 
 * @type {dynamic} - Tracks placement process lifecycle
 */

const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  idNumber: { type: String },
  contact: { type: String },
  year: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['placement', 'internship'],
    required: true
  },
  driveType: {
    type: String,
    enum: ['offcampus', 'oncampus'],
    required: function() {
      // Required only for E3 and E4 students
      return this.year === 'E3' || this.year === 'E4';
    }
  },
  position: { type: String },
  package: { type: String },
  location: { type: String },
  joiningDate: { type: String },
  additionalInfo: { type: String },
  // Document uploads for E3/E4 students
  mailScreenshot: { type: String }, // File path/URL
  offerLetter: { type: String }, // File path/URL
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'],
    default: 'pending'
  },
  approvalTag: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Placement', placementSchema); 