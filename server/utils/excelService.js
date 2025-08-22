/**
 * Excel Service
 * 
 * Provides functionality for generating, reading, and manipulating Excel files
 * for data export and import operations.
 * 
 * Main Functions:
 * - generateReport: Create Excel reports from data
 * - parseExcel: Read and parse Excel file data
 * - exportUsers: Export user data to Excel
 * - exportSessions: Export session data to Excel
 * - exportStatistics: Export analytics to Excel
 * 
 * Features:
 * - Multiple sheet support
 * - Custom styling
 * - Formula support
 * - Data validation
 * - Auto-filtering
 * 
 * File Handling:
 * - Buffer processing
 * - Stream support
 * - Large file optimization
 * - Template usage
 * 
 * Data Processing:
 * - Data transformation
 * - Column mapping
 * - Data validation
 * - Error checking
 * 
 * Dependencies:
 * - XLSX library
 * - File system
 * - Stream utilities
 * - Validation helpers
 * 
 * @type {module} Excel file handling service
 */

const XLSX = require('xlsx');
const User = require('../models/User');
const Session = require('../models/Session');

exports.exportUserData = async () => {
  try {
    const users = await User.find().select('-password');
    
    // Prepare data for Excel
    const userData = users.map(user => ({
      'Full Name': user.fullName,
      'Email': user.email,
      'Role': user.role,
      'Department': user.department || '',
      'Year of Study': user.yearOfStudy || '',
      'Student ID': user.studentId || '',
      'Graduation Year': user.graduationYear || '',
      'Current Job': user.currentJob || '',
      'Designation': user.designation || '',
      'Phone Number': user.phoneNumber || '',
      'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
      'Created At': user.createdAt.toLocaleDateString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(userData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return excelBuffer;
  } catch (error) {
    throw new Error('Error exporting user data: ' + error.message);
  }
};

exports.exportSessionData = async () => {
  try {
    const sessions = await Session.find()
      .populate('conductedBy', 'fullName email')
      .populate('participants', 'fullName email');

    // Prepare data for Excel
    const sessionData = sessions.map(session => ({
      'Title': session.title,
      'Description': session.description,
      'Conducted By': session.conductedBy.fullName,
      'Date': session.date.toLocaleDateString(),
      'Status': session.status,
      'Type': session.type,
      'Location': session.location,
      'Duration (minutes)': session.duration,
      'Max Participants': session.maxParticipants,
      'Current Participants': session.participants.length,
      'Created At': session.createdAt.toLocaleDateString()
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sessionData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sessions');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return excelBuffer;
  } catch (error) {
    throw new Error('Error exporting session data: ' + error.message);
  }
}; 