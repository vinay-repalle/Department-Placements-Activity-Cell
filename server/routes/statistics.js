/**
 * Statistics and Analytics Routes
 * 
 * Provides endpoints for retrieving various statistics and analytics data
 * about users, sessions, placements, and system performance.
 * 
 * Routes:
 * - GET /api/statistics/overview: Get general platform statistics
 * - GET /api/statistics/users: Get user-related statistics
 * - GET /api/statistics/sessions: Get session-related statistics
 * - GET /api/statistics/placements: Get placement/internship statistics
 * - GET /api/statistics/signups: Get signup success/failure statistics
 * 
 * Data Categories:
 * - User Statistics:
 *   - Total users by role
 *   - Active/inactive users
 *   - New registrations over time
 * 
 * - Session Statistics:
 *   - Total sessions
 *   - Sessions by status
 *   - Popular time slots
 *   - Mentor participation
 * 
 * - Placement Statistics:
 *   - Placement success rate
 *   - Company distribution
 *   - Package statistics
 *   - Internship conversion rate
 * 
 * - System Statistics:
 *   - Failed signup attempts
 *   - System performance metrics
 *   - Error rates
 * 
 * Access Control:
 * - Admin-only access
 * - Role-based data filtering
 * 
 * Features:
 * - Data aggregation
 * - Time-based filtering
 * - Export capabilities
 * - Real-time updates
 * 
 * Error Handling:
 * - Invalid date ranges
 * - Missing data
 * - Aggregation errors
 * 
 * @type {dynamic} - Updates in real-time as new data is added
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Session = require('../models/Session');
const Placement = require('../models/Placement');
const RejectedSignup = require('../models/RejectedSignup');
const FailedSignup = require('../models/FailedSignup');

// Get all statistics - Protected route, only accessible by admins
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Starting statistics fetch...');

    // User Statistics
    const totalUsers = await User.countDocuments();
    console.log('Total users:', totalUsers);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    console.log('Users by role:', usersByRole);
    
    const studentsByBranch = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$branch', count: { $sum: 1 } } }
    ]);
    console.log('Students by branch:', studentsByBranch);
    
    const studentsByYear = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);
    console.log('Students by year:', studentsByYear);
    
    const alumniByYear = await User.aggregate([
      { $match: { role: 'alumni' } },
      { $group: { _id: '$graduationYear', count: { $sum: 1 } } }
    ]);
    console.log('Alumni by year:', alumniByYear);
    
    const alumniByBranch = await User.aggregate([
      { $match: { role: 'alumni' } },
      { $group: { _id: '$branch', count: { $sum: 1 } } }
    ]);
    console.log('Alumni by branch:', alumniByBranch);

    // Session Statistics
    const totalSessions = await Session.countDocuments();
    console.log('Total sessions:', totalSessions);

    const currentDate = new Date();
    
    const upcomingSessions = await Session.countDocuments({
      date: { $gt: currentDate }
    });
    console.log('Upcoming sessions:', upcomingSessions);
    
    const ongoingSessions = await Session.countDocuments({
      date: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });
    console.log('Ongoing sessions:', ongoingSessions);
    
    const previousSessions = await Session.countDocuments({
      endDate: { $lt: currentDate }
    });
    console.log('Previous sessions:', previousSessions);
    
    const rejectedSessions = await Session.find({ status: 'rejected' })
      .select('title date venue')
      .lean();
    console.log('Rejected sessions:', rejectedSessions);

    // Placement Statistics
    const totalPlacements = await Placement.countDocuments();
    console.log('Total placements:', totalPlacements);

    const placementsByStatus = await Placement.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('Placements by status:', placementsByStatus);
    
    const placementSubmissions = await Placement.find()
      .select('studentName company position status')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    console.log('Recent placement submissions:', placementSubmissions);

    // Rejected and Failed Signups
    const rejectedSignups = await RejectedSignup.find()
      .select('name email reason createdAt')
      .sort({ createdAt: -1 })
      .lean();
    console.log('Rejected signups:', rejectedSignups);
      
    const failedSignups = await FailedSignup.find()
      .select('name email error status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    console.log('Failed signups:', failedSignups);

    // Format the response
    const statistics = {
      users: {
        total: totalUsers,
        byRole: {
          students: usersByRole.find(r => r._id === 'student')?.count || 0,
          alumni: usersByRole.find(r => r._id === 'alumni')?.count || 0,
          faculty: usersByRole.find(r => r._id === 'faculty')?.count || 0
        },
        studentsByBranch: Object.fromEntries(
          studentsByBranch.map(b => [b._id || 'Unknown', b.count])
        ),
        studentsByYear: Object.fromEntries(
          studentsByYear.map(y => [y._id || 'Unknown', y.count])
        ),
        alumniByYear: Object.fromEntries(
          alumniByYear.map(y => [y._id || 'Unknown', y.count])
        ),
        alumniByBranch: Object.fromEntries(
          alumniByBranch.map(b => [b._id || 'Unknown', b.count])
        )
      },
      sessions: {
        total: totalSessions,
        upcoming: upcomingSessions,
        ongoing: ongoingSessions,
        previous: previousSessions,
        rejected: rejectedSessions.map(session => ({
          title: session.title,
          date: session.date,
          venue: session.venue
        }))
      },
      placements: {
        total: totalPlacements,
        accepted: placementsByStatus.find(p => p._id === 'accepted')?.count || 0,
        rejected: placementsByStatus.find(p => p._id === 'rejected')?.count || 0,
        pending: placementsByStatus.find(p => p._id === 'pending')?.count || 0,
        submissions: placementSubmissions.map(submission => ({
          student: submission.studentName,
          company: submission.company,
          position: submission.position,
          status: submission.status
        }))
      },
      rejectedSignups: rejectedSignups.map(signup => ({
        name: signup.name,
        email: signup.email,
        reason: signup.reason,
        date: signup.createdAt
      })),
      failedSignups: failedSignups.map(signup => ({
        name: signup.name,
        email: signup.email,
        error: signup.error,
        status: signup.status,
        date: signup.createdAt
      }))
    };

    console.log('Final statistics object:', JSON.stringify(statistics, null, 2));
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router; 