/**
 * Session Management Routes
 * 
 * Handles all session-related operations including creation, updates,
 * and management of mentoring/guidance sessions between users.
 * 
 * Routes:
 * - POST /api/sessions/create: Create new session request
 * - GET /api/sessions/user/:userId: Get user's sessions
 * - GET /api/sessions/pending: Get pending session requests
 * - PUT /api/sessions/:id/status: Update session status
 * - GET /api/sessions/stats: Get session statistics
 * - GET /api/sessions/upcoming: Get upcoming sessions
 * - DELETE /api/sessions/:id: Cancel/delete session
 * 
 * Features:
 * - Session request creation
 * - Status management (pending, accepted, rejected, completed)
 * - Session scheduling
 * - Notification integration
 * - Statistics tracking
 * 
 * Access Control:
 * - Students can request sessions
 * - Alumni/Faculty can accept/reject requests
 * - Admins have full access
 * - Users can only view their own sessions
 * 
 * Data Validation:
 * - Date/time validation
 * - User role verification
 * - Session status transitions
 * 
 * Error Handling:
 * - Invalid requests
 * - Unauthorized access
 * - Scheduling conflicts
 * - Server errors
 * 
 * @type {dynamic} - Handles real-time session management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { Session, SessionRequest } = require('../models/Session');
const SessionAttendance = require('../models/SessionAttendance');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendSessionRequestStatusEmail, testTransporter, sendTestEmail } = require('../utils/emailService');

// Debug route to check session department information
router.get('/debug/sessions', protect, authorize('admin'), async (req, res) => {
  try {
    const sessions = await Session.find({}).populate('sessionHead', 'fullName email');
    const sessionInfo = sessions.map(session => ({
      id: session._id,
      title: session.title,
      targetAudience: session.targetAudience,
      targetDepartments: session.targetDepartments,
      sessionRequestId: session.sessionRequestId,
      status: session.status,
      createdAt: session.createdAt
    }));
    
    res.json({
      status: 'success',
      data: {
        totalSessions: sessions.length,
        sessions: sessionInfo
      }
    });
  } catch (error) {
    console.error('Error fetching session debug info:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching session debug info'
    });
  }
});

// Test email route (for debugging)
router.get('/test-email', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Testing email functionality...');
    
    // Test SMTP connection
    await testTransporter();
    
    // Test sending a simple email
    const testEmail = req.user.email || 'test@example.com';
    console.log('Sending test email to:', testEmail);
    
    await sendTestEmail(testEmail);
    
    res.json({ 
      status: 'success', 
      message: 'Test email sent successfully',
      sentTo: testEmail
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Test email failed',
      error: error.message 
    });
  }
});

// Test account creation email route
router.get('/test-account-email', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('Testing account creation email...');
    
    const testEmail = req.user.email || 'test@example.com';
    console.log('Sending account creation test email to:', testEmail);
    
    const { sendAccountCreationEmail } = require('../utils/emailService');
    await sendAccountCreationEmail(testEmail, req.user.fullName, req.user.role);
    
    res.json({ 
      status: 'success', 
      message: 'Account creation test email sent successfully',
      sentTo: testEmail
    });
  } catch (error) {
    console.error('Account creation test email error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Account creation test email failed',
      error: error.message 
    });
  }
});

// Get all sessions
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('sessionHead', 'fullName email profilePhoto')
      .populate('participants', 'fullName email')
      .sort({ date: 1 }); // Sort by date ascending

    if (!sessions) {
      return res.status(404).json({
        status: 'error',
        message: 'No sessions found'
      });
    }

    // Map sessions to the expected format
    const formattedSessions = sessions.map(session => {
      try {
        return {
          _id: session._id,
          title: session.title || 'Untitled Session',
          description: session.description || 'No description available',
          date: session.date,
          time: session.time || '00:00',
          venue: session.venue || 'TBA',
          status: session.status || 'upcoming',
          sessionHead: session.sessionHead || { fullName: 'TBA' },
          participants: session.participants || [],
          meetingLink: session.meetingLink,
          feedbackFormLink: session.feedbackFormLink,
          manuallyCompleted: session.manuallyCompleted || false,
          targetAudience: session.targetAudience || [],
          targetDepartments: session.targetDepartments || []
        };
      } catch (err) {
        console.error('Error formatting session:', err);
        return null;
      }
    }).filter(Boolean); // Remove any null entries

    res.json({
      status: 'success',
      data: {
        sessions: formattedSessions
      }
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching sessions. Please try again later.'
    });
  }
});

// Admin: Get all pending session requests
router.get('/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const pendingRequests = await SessionRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: { pendingRequests } });
  } catch (error) {
    console.error('Error fetching pending session requests:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error fetching pending session requests' });
  }
});

// Admin: Get all session requests (any status)
router.get('/requests', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await SessionRequest.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: { requests } });
  } catch (error) {
    console.error('Error fetching all session requests:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error fetching all session requests' });
  }
});

// Admin: Update session request status (pending, approved, rejected)
router.patch('/requests/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }
    const sessionRequest = await SessionRequest.findById(req.params.id);
    if (!sessionRequest) {
      return res.status(404).json({ status: 'error', message: 'Session request not found' });
    }
    sessionRequest.status = status;
    await sessionRequest.save();
    
    // Notify the request owner
    if (sessionRequest.userId) {
      await Notification.create({
        recipient: sessionRequest.userId,
        title: 'Session Request Status Updated',
        message: `Your session request "${sessionRequest.sessionTitle}" was ${status} by admin.`,
        type: 'session',
        link: '/alumniprofile' // or '/facultyprofile' or a generic profile page
      });
      
      // Send email notification for approved or rejected status
      if (status === 'approved' || status === 'rejected') {
        try {
          console.log('About to send session request status email for status:', status);
          // Get the user details
          const user = await User.findById(sessionRequest.userId);
          console.log('Found user for email:', user ? user.email : 'No user found');
          
          if (user && user.email) {
            // Get admin contact info (using the current admin's info)
            const adminContact = {
              email: req.user.email,
              phone: req.user.phoneNumber || null
            };
            
            console.log('Admin contact info:', adminContact);
            
            // Send email notification
            await sendSessionRequestStatusEmail(
              user.email,
              user.fullName,
              sessionRequest.sessionTitle,
              status,
              adminContact
            );
            console.log('Session request status email sent successfully to:', user.email);
          } else {
            console.warn('User not found or no email for session request notification:', sessionRequest.userId);
          }
        } catch (emailError) {
          console.error('Error sending session request status email:', emailError);
          console.error('Email error details:', {
            userId: sessionRequest.userId,
            sessionTitle: sessionRequest.sessionTitle,
            status,
            error: emailError.message,
            stack: emailError.stack
          });
          // Don't fail the request if email fails
        }
      }
    } else {
      console.warn('No user found to notify for session request status update.');
    }
    res.json({ status: 'success', message: 'Session request status updated', data: { sessionRequest } });
  } catch (error) {
    console.error('Error updating session request status:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error updating session request status' });
  }
});

// Get session by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('sessionHead', 'fullName email profilePhoto')
      .populate('participants', 'fullName email');
    
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    const formattedSession = {
      _id: session._id,
      title: session.title || 'Untitled Session',
      description: session.description || 'No description available',
      date: session.date,
      time: session.time || '00:00',
      venue: session.venue || 'TBA',
      status: session.status || 'upcoming',
      sessionHead: session.sessionHead || { fullName: 'TBA' },
      participants: session.participants || [],
      meetingLink: session.meetingLink,
      feedbackFormLink: session.feedbackFormLink
    };

    res.json({
      status: 'success',
      data: { session: formattedSession }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching session. Please try again later.'
    });
  }
});

// Create new session (admin, alumni, faculty)
router.post('/', protect, authorize('admin', 'alumni', 'faculty'), async (req, res) => {
  try {
    if (req.user.role === 'alumni' || req.user.role === 'faculty' || req.user.role === 'admin') {
      // Save all form data to SessionRequest
      const requestData = {
        ...req.body,
        userId: req.user._id,
        userType: req.user.role,
        fullName: req.body.fullName || req.user.fullName,
        email: req.body.email || req.user.email,
        status: 'pending',
        idNumber: req.body.idNumber || '',
        contact: req.body.contact || ''
      };
      const sessionRequest = await SessionRequest.create(requestData);
      // Notify all admins
      const admins = await User.find({ role: 'admin' });
      if (admins.length > 0) {
        const notifications = admins
          .filter(admin => !!admin._id)
          .map(admin => ({
            recipient: admin._id,
            title: 'New Session Request',
            message: `${req.user.fullName} (${req.user.role}) requested a new session: ${requestData.sessionTitle}`,
            type: 'session',
            link: '/admin/session-requests'
          }));
        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } else {
        console.warn('No admins found to notify for new session request.');
      }
      return res.status(201).json({
        status: 'success',
        message: 'Session request submitted successfully',
        data: { sessionRequest }
      });
    }
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating session'
    });
  }
});

// Update session (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('sessionHead', 'fullName email profilePhoto')
     .populate('participants', 'fullName email');
    
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Session updated successfully',
      data: { session }
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating session'
    });
  }
});

// Delete session (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting session'
    });
  }
});

// Get requested and conducted sessions for a user (alumni/faculty)
router.get('/user/:userId', protect, async (req, res) => {
  try {
    // Only allow the user themselves or admin to fetch
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
    // Fetch session requests for this user
    const requestedSessions = await SessionRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    // Fetch conducted sessions for this user (completed or ongoing)
    const conductedSessions = await Session.find({
      sessionHead: req.params.userId,
      status: { $in: ['completed', 'ongoing'] }
    }).sort({ date: -1 });
    res.json({
      status: 'success',
      data: { requestedSessions, conductedSessions }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching requested/conducted sessions' });
  }
});

// Admin: Approve a session request
router.patch('/requests/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const sessionRequest = await SessionRequest.findById(req.params.id);
    if (!sessionRequest) {
      return res.status(404).json({ status: 'error', message: 'Session request not found' });
    }
    if (sessionRequest.status === 'approved') {
      return res.status(400).json({ status: 'error', message: 'Request already approved' });
    }
    // Require venue and time from admin
    const { venue, date, time } = req.body;
    if (!venue || !date || !time) {
      return res.status(400).json({ status: 'error', message: 'Venue, date, and time are required for approval.' });
    }
    // Create a new Session from the request and admin-provided details
    const sessionData = {
      title: sessionRequest.sessionTitle,
      description: sessionRequest.sessionDescription,
      date,
      time,
      venue,
      sessionHead: sessionRequest.userId,
      status: 'upcoming',
      sessionRequestId: sessionRequest._id,
      targetAudience: sessionRequest.targetAudience || ['all'],
      targetDepartments: sessionRequest.targetDepartments || ['ALL']
    };
    
    // Debug logging
    console.log('Session Request targetAudience:', sessionRequest.targetAudience);
    console.log('Session Request targetDepartments:', sessionRequest.targetDepartments);
    console.log('Creating session with targetAudience:', sessionData.targetAudience);
    console.log('Creating session with targetDepartments:', sessionData.targetDepartments);
    
    const session = await Session.create(sessionData);
    sessionRequest.status = 'approved';
    await sessionRequest.save();
    
    // Notify eligible students about the new session
    const eligibleStudents = await getEligibleStudents(session);
    const studentNotifications = eligibleStudents.map(student => ({
      recipient: student._id,
      title: 'New Session Available',
      message: `A new session "${sessionRequest.sessionTitle}" is now available. Please check the sessions page for details.`,
      type: 'session',
      link: '/sessions'
    }));
    
    if (studentNotifications.length > 0) {
      await Notification.insertMany(studentNotifications);
    }
    
    // Notify the request owner
    if (sessionRequest.userId) {
      await Notification.create({
        recipient: sessionRequest.userId,
        title: 'Session Request Approved',
        message: `Your session request "${sessionRequest.sessionTitle}" was approved by admin.`,
        type: 'session',
        link: '/alumniprofile'
      });
      
      // Send email notification for approved status
      try {
        console.log('About to send session request approval email');
        const user = await User.findById(sessionRequest.userId);
        console.log('Found user for approval email:', user ? user.email : 'No user found');
        
        if (user && user.email) {
          const adminContact = {
            email: req.user.email,
            phone: req.user.phoneNumber || null
          };
          
          console.log('Admin contact info for approval:', adminContact);
          
          await sendSessionRequestStatusEmail(
            user.email,
            user.fullName,
            sessionRequest.sessionTitle,
            'approved',
            adminContact
          );
          console.log('Session request approval email sent successfully to:', user.email);
        } else {
          console.warn('User not found or no email for session request approval notification:', sessionRequest.userId);
        }
      } catch (emailError) {
        console.error('Error sending session request approval email:', emailError);
        console.error('Email error details:', {
          userId: sessionRequest.userId,
          sessionTitle: sessionRequest.sessionTitle,
          error: emailError.message,
          stack: emailError.stack
        });
        // Don't fail the approval if email fails
      }
    }
    res.json({ status: 'success', message: 'Session request approved and session created', data: { session } });
  } catch (error) {
    console.error('Error approving session request:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error approving session request' });
  }
});

// Admin: Reject a session request
router.patch('/requests/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const sessionRequest = await SessionRequest.findById(req.params.id);
    if (!sessionRequest) {
      return res.status(404).json({ status: 'error', message: 'Session request not found' });
    }
    if (sessionRequest.status === 'rejected') {
      return res.status(400).json({ status: 'error', message: 'Request already rejected' });
    }
    sessionRequest.status = 'rejected';
    await sessionRequest.save();
    // Also cancel the corresponding Session if it exists (by sessionRequestId)
    const result = await Session.updateMany({
      sessionRequestId: sessionRequest._id,
      status: { $ne: 'cancelled' }
    }, { $set: { status: 'cancelled' } });
    console.log('Sessions cancelled:', result.modifiedCount);
    // Notify the request owner
    if (sessionRequest.userId) {
      await Notification.create({
        recipient: sessionRequest.userId,
        title: 'Session Request Rejected',
        message: `Your session request \"${sessionRequest.sessionTitle}\" was rejected by admin.`,
        type: 'session',
        link: '/alumniprofile'
      });
      
      // Send email notification for rejected status
      try {
        console.log('About to send session request rejection email');
        const user = await User.findById(sessionRequest.userId);
        console.log('Found user for rejection email:', user ? user.email : 'No user found');
        
        if (user && user.email) {
          const adminContact = {
            email: req.user.email,
            phone: req.user.phoneNumber || null
          };
          
          console.log('Admin contact info for rejection:', adminContact);
          
          await sendSessionRequestStatusEmail(
            user.email,
            user.fullName,
            sessionRequest.sessionTitle,
            'rejected',
            adminContact
          );
          console.log('Session request rejection email sent successfully to:', user.email);
        } else {
          console.warn('User not found or no email for session request rejection notification:', sessionRequest.userId);
        }
      } catch (emailError) {
        console.error('Error sending session request rejection email:', emailError);
        console.error('Email error details:', {
          userId: sessionRequest.userId,
          sessionTitle: sessionRequest.sessionTitle,
          error: emailError.message,
          stack: emailError.stack
        });
        // Don't fail the rejection if email fails
      }
    }
    res.json({ status: 'success', message: 'Session request rejected' });
  } catch (error) {
    console.error('Error rejecting session request:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error rejecting session request' });
  }
});

// PATCH /api/sessions/:id/status
router.patch('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ status: 'error', message: 'Session not found' });
    }

    session.status = status;
    if (status === 'completed') {
      session.manuallyCompleted = true;
      // Do NOT update session.time here
    }
    await session.save();

    // LOGGING
    console.log(`[Session Status Update] Session ${session._id} status updated to: ${status}`);

    // If session is completed, delete the related SessionRequest
    if (status === 'completed' && session.sessionRequestId) {
      try {
        const deleted = await SessionRequest.findByIdAndDelete(session.sessionRequestId);
        if (deleted) {
          console.log(`[Session Status Update] Deleted related SessionRequest: ${session.sessionRequestId}`);
        } else {
          console.warn(`[Session Status Update] No related SessionRequest found for: ${session.sessionRequestId}`);
        }
      } catch (err) {
        console.error(`[Session Status Update] Error deleting SessionRequest: ${err.message}`);
      }
    }

    res.json({ status: 'success', message: 'Session status updated', data: { session } });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error updating session status' });
  }
});

// Student: Get their attendance response for a session
router.get('/:id/student-attendance', protect, authorize('student'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    // Check if student is eligible for this session
    const student = await User.findById(req.user._id);
    const isEligible = checkStudentEligibility(student, session);
    
    if (!isEligible) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not eligible for this session'
      });
    }

    // Get student's attendance response
    const attendance = await SessionAttendance.findOne({ 
      session: sessionId, 
      student: req.user._id 
    });

    res.json({
      status: 'success',
      data: { attendance }
    });
  } catch (error) {
    console.error('Error getting student attendance:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error getting student attendance'
    });
  }
});

// Student: Submit attendance response for a session
router.post('/:id/attendance', protect, authorize('student'), async (req, res) => {
  try {
    const { willAttend } = req.body;
    const sessionId = req.params.id;
    
    if (typeof willAttend !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'willAttend must be a boolean value'
      });
    }

    // Check if session exists and is visible to this student
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    // Check if student is eligible for this session based on target audience and departments
    const student = await User.findById(req.user._id);
    const isEligible = checkStudentEligibility(student, session);
    
    if (!isEligible) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not eligible for this session'
      });
    }

    // Create or update attendance response
    const attendance = await SessionAttendance.findOneAndUpdate(
      { session: sessionId, student: req.user._id },
      { 
        willAttend,
        responseDate: new Date(),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      status: 'success',
      message: 'Attendance response submitted successfully',
      data: { attendance }
    });
  } catch (error) {
    console.error('Error submitting attendance response:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error submitting attendance response'
    });
  }
});

// Student: Submit feedback for a session
router.post('/:id/feedback', protect, authorize('student'), async (req, res) => {
  try {
    const { feedbackText, feedbackRating } = req.body;
    const sessionId = req.params.id;
    
    if (!feedbackText || feedbackText.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Feedback text is required'
      });
    }

    // Check if session exists and is completed
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Feedback can only be submitted for completed sessions'
      });
    }

    // Check if student is eligible for this session
    const student = await User.findById(req.user._id);
    const isEligible = checkStudentEligibility(student, session);
    
    if (!isEligible) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not eligible for this session'
      });
    }

    // Update or create attendance record with feedback
    const attendance = await SessionAttendance.findOneAndUpdate(
      { session: sessionId, student: req.user._id },
      { 
        feedbackText: feedbackText.trim(),
        feedbackRating: feedbackRating,
        feedbackSubmitted: true,
        feedbackDate: new Date(),
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      status: 'success',
      message: 'Feedback submitted successfully',
      data: { attendance }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error submitting feedback'
    });
  }
});

// Admin: Get session attendance statistics
router.get('/:id/attendance-stats', protect, authorize('admin'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    const attendanceStats = await SessionAttendance.aggregate([
      { $match: { session: session._id } },
      {
        $group: {
          _id: '$willAttend',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalResponses = attendanceStats.reduce((sum, stat) => sum + stat.count, 0);
    const willAttendCount = attendanceStats.find(stat => stat._id === true)?.count || 0;
    const willNotAttendCount = attendanceStats.find(stat => stat._id === false)?.count || 0;

    const eligibleStudents = await getEligibleStudents(session);
    const eligibleCount = eligibleStudents.length;

    // Get feedback statistics
    const feedbackStats = await SessionAttendance.aggregate([
      { $match: { session: session._id, feedbackSubmitted: true } },
      {
        $group: {
          _id: null,
          feedbackCount: { $sum: 1 },
          avgRating: { $avg: '$feedbackRating' }
        }
      }
    ]);

    const feedbackData = feedbackStats[0] || { feedbackCount: 0, avgRating: 0 };

    res.json({
      status: 'success',
      data: {
        totalResponses,
        willAttendCount,
        willNotAttendCount,
        eligibleCount,
        responseRate: eligibleCount > 0 ? (totalResponses / eligibleCount * 100).toFixed(2) : 0,
        willAttendPercentage: totalResponses > 0 ? (willAttendCount / totalResponses * 100).toFixed(2) : 0,
        willNotAttendPercentage: totalResponses > 0 ? (willNotAttendCount / totalResponses * 100).toFixed(2) : 0,
        feedbackSubmittedCount: feedbackData.feedbackCount,
        feedbackSubmittedPercentage: totalResponses > 0 ? (feedbackData.feedbackCount / totalResponses * 100).toFixed(2) : 0,
        averageRating: feedbackData.avgRating ? feedbackData.avgRating.toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error getting attendance statistics:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error getting attendance statistics'
    });
  }
});

// Admin: Download attendance report as Excel
router.get('/:id/attendance-report', protect, authorize('admin'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    const attendanceData = await SessionAttendance.find({ session: sessionId })
      .populate('student', 'fullName email studentId department yearOfStudy')
      .sort({ responseDate: -1 });

    const eligibleStudents = await getEligibleStudents(session);
    
    // Create comprehensive report data
    const reportData = eligibleStudents.map(student => {
      const attendance = attendanceData.find(a => a.student._id.toString() === student._id.toString());
      return {
        'Student Name': student.fullName,
        'Student ID': student.studentId || 'N/A',
        'Email': student.email,
        'Department': student.department || 'N/A',
        'Year': student.yearOfStudy || 'N/A',
        'Will Attend': attendance ? (attendance.willAttend ? 'Yes' : 'No') : 'No Response',
        'Response Date': attendance ? new Date(attendance.responseDate).toLocaleString() : 'N/A',
        'Feedback Submitted': attendance && attendance.feedbackSubmitted ? 'Yes' : 'No',
        'Feedback Rating': attendance && attendance.feedbackRating ? attendance.feedbackRating + '/5' : 'N/A',
        'Feedback Text': attendance && attendance.feedbackText ? attendance.feedbackText : 'N/A',
        'Feedback Date': attendance && attendance.feedbackDate ? new Date(attendance.feedbackDate).toLocaleString() : 'N/A'
      };
    });

    // Add session info to the report
    const sessionInfo = {
      'Session Title': session.title,
      'Session Date': new Date(session.date).toLocaleDateString(),
      'Session Time': session.time,
      'Target Audience': Array.isArray(session.targetAudience) ? session.targetAudience.join(', ') : session.targetAudience,
      'Target Departments': Array.isArray(session.targetDepartments) ? session.targetDepartments.join(', ') : session.targetDepartments,
      'Total Eligible Students': eligibleStudents.length,
      'Total Responses': attendanceData.length,
      'Will Attend Count': attendanceData.filter(a => a.willAttend).length,
      'Will Not Attend Count': attendanceData.filter(a => !a.willAttend).length,
      'Response Rate': `${((attendanceData.length / eligibleStudents.length) * 100).toFixed(2)}%`,
      'Feedback Submitted Count': attendanceData.filter(a => a.feedbackSubmitted).length,
      'Average Rating': attendanceData.filter(a => a.feedbackRating).length > 0 
        ? (attendanceData.filter(a => a.feedbackRating).reduce((sum, a) => sum + a.feedbackRating, 0) / attendanceData.filter(a => a.feedbackRating).length).toFixed(2)
        : 'N/A'
    };

    // Generate Excel file
    const XLSX = require('xlsx');
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create session info worksheet
    const sessionInfoData = Object.entries(sessionInfo).map(([key, value]) => [key, value]);
    const sessionInfoSheet = XLSX.utils.aoa_to_sheet(sessionInfoData);
    XLSX.utils.book_append_sheet(workbook, sessionInfoSheet, 'Session Info');
    
    // Create attendance data worksheet
    if (reportData.length > 0) {
      const headers = Object.keys(reportData[0]);
      const attendanceDataArray = [headers, ...reportData.map(row => headers.map(header => row[header]))];
      const attendanceSheet = XLSX.utils.aoa_to_sheet(attendanceDataArray);
      XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance Data');
    }
    
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=session_attendance_${sessionId}.xlsx`);
    
    // Send the file
    res.send(excelBuffer);
    
  } catch (error) {
    console.error('Error generating attendance report:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating attendance report'
    });
  }
});

// Admin: Upload feedback form link for ongoing session
router.patch('/:id/feedback-link', protect, authorize('admin'), async (req, res) => {
  try {
    const { feedbackFormLink } = req.body;
    const sessionId = req.params.id;
    
    if (!feedbackFormLink) {
      return res.status(400).json({
        status: 'error',
        message: 'Feedback form link is required'
      });
    }

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { feedbackFormLink },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    // Notify eligible students about the feedback form
    const eligibleStudents = await getEligibleStudents(session);
    
    const notifications = eligibleStudents.map(student => ({
      recipient: student._id,
      title: 'Session Feedback Available',
      message: `Feedback form is now available for the session "${session.title}". Please submit your feedback.`,
      type: 'session',
      link: '/sessions'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json({
      status: 'success',
      message: 'Feedback form link updated and students notified',
      data: { session }
    });
  } catch (error) {
    console.error('Error updating feedback form link:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating feedback form link'
    });
  }
});

// Helper function to check if a student is eligible for a session
function checkStudentEligibility(student, session) {
  // Check year eligibility
  const yearEligible = session.targetAudience.includes('all') || 
                      session.targetAudience.includes(student.yearOfStudy);
  
  // Check department eligibility
  const deptEligible = session.targetDepartments.includes('ALL') || 
                      session.targetDepartments.includes(student.department);
  
  return yearEligible && deptEligible;
}

// Helper function to get eligible students for a session
async function getEligibleStudents(session) {
  const query = { role: 'student' };
  
  // Add year filter
  if (!session.targetAudience.includes('all')) {
    query.yearOfStudy = { $in: session.targetAudience };
  }
  
  // Add department filter
  if (!session.targetDepartments.includes('ALL')) {
    query.department = { $in: session.targetDepartments };
  }
  
  return await User.find(query);
}

module.exports = router; 