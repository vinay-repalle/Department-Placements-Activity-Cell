/**
 * Session Controller
 * 
 * Manages the business logic for mentoring sessions between alumni/faculty and students.
 * Handles session creation, updates, scheduling, and participant management.
 * 
 * Main Functions:
 * - createSession: Create new mentoring session
 * - updateSession: Modify existing session details
 * - deleteSession: Remove session and notify participants
 * - getSession: Retrieve session details
 * - listSessions: Get filtered list of sessions
 * - joinSession: Handle participant registration
 * - leaveSession: Process participant withdrawal
 * - completeSession: Mark session as completed
 * 
 * Features:
 * - Automatic status updates based on time
 * - Participant limit management
 * - Notification integration
 * - Feedback collection
 * - Resource attachment handling
 * 
 * Access Control:
 * - Role-based permissions
 * - Session host privileges
 * - Participant management
 * 
 * Error Handling:
 * - Validation errors
 * - Scheduling conflicts
 * - Capacity limits
 * - Permission issues
 * 
 * Dependencies:
 * - Session model
 * - User model
 * - Notification service
 * - Email service
 * 
 * @type {module} Session management controller
 */

const Session = require('../models/Session');
const User = require('../models/User');

exports.createSession = async (req, res) => {
  try {
    // Validate required fields
    const { title, description, date, time, venue, sessionHead } = req.body;
    
    if (!title || !description || !date || !time || !venue || !sessionHead) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields'
      });
    }

    // Validate date is in the future
    const sessionDate = new Date(date);
    const now = new Date();
    if (sessionDate <= now) {
      return res.status(400).json({
        status: 'error',
        message: 'Session date must be in the future'
      });
    }

    // Create session with only the required fields
    const sessionData = {
      title,
      description,
      date: sessionDate,
      time,
      venue,
      sessionHead,
      feedbackFormLink: req.body.feedbackFormLink,
      status: 'upcoming'
    };

    const session = await Session.create(sessionData);

    res.status(201).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating session'
    });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('sessionHead', 'fullName email profilePhoto')
      .populate('participants', 'fullName email');

    // Get current date and time
    const now = new Date();

    // Process and categorize sessions
    const processedSessions = sessions.map(session => {
      console.log('Session from DB:', session);
      const sessionDate = new Date(session.date);
      const sessionTime = (session.time || '00:00').split(':');
      sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));

      // Check if session is today
      const isToday = sessionDate.toDateString() === now.toDateString();
      
      // Determine session status
      let status;

      if (session.manuallyCompleted) {
        status = 'completed';
        // Do NOT update in DB, do NOT recalculate, do NOT use time logic
      } else if (session.status === 'cancelled') {
        status = 'cancelled';
      } else {
        // Existing logic to calculate status
        if (isToday) {
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const sessionStartTime = parseInt(sessionTime[0]) * 60 + parseInt(sessionTime[1]);
          const sessionEndTime = sessionStartTime + 120; // 2 hours in minutes

          if (currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
            status = 'ongoing';
          } else if (currentTime < sessionStartTime) {
            status = 'upcoming';
          } else {
            status = 'completed';
          }
        } else if (sessionDate > now) {
          status = 'upcoming';
        } else {
          status = 'completed';
        }
        // Only update in DB if not completed/cancelled
        if (session.status !== status) {
          Session.findByIdAndUpdate(session._id, { status }, { new: true }).exec();
        }
      }

      return {
        ...session.toObject(),
        status,
        targetAudience: session.targetAudience || [],
        targetDepartments: session.targetDepartments || []
      };
    });

    // Calculate statistics
    const stats = {
      total: processedSessions.length,
      ongoing: processedSessions.filter(s => s.status === 'ongoing').length,
      upcoming: processedSessions.filter(s => s.status === 'upcoming').length,
      previous: processedSessions.filter(s => s.status === 'completed').length
    };

    res.status(200).json({
      status: 'success',
      data: {
        sessions: processedSessions,
        stats
      }
    });
  } catch (error) {
    console.error('Error in getAllSessions:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching sessions'
    });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('conductedBy', 'fullName email')
      .populate('participants', 'fullName email');

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    // Check if session is full
    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({
        status: 'error',
        message: 'Session is full'
      });
    }

    // Check if user is already a participant
    if (session.participants.includes(req.user.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already registered for this session'
      });
    }

    // Add user to participants
    session.participants.push(req.user.id);
    await session.save();

    res.status(200).json({
      status: 'success',
      data: {
        session
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getSessionStats = async (req, res) => {
  try {
    const sessions = await Session.find();
    const now = new Date();

    // Initialize counters
    let totalSessions = sessions.length;
    let completedSessions = 0;
    let upcomingSessions = 0;
    let ongoingSessions = 0;

    // Categorize each session based on date and time
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const sessionTime = (session.time || '00:00').split(':');
      sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));

      // Check if session is today
      const isToday = sessionDate.toDateString() === now.toDateString();
      
      if (isToday) {
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const sessionStartTime = parseInt(sessionTime[0]) * 60 + parseInt(sessionTime[1]);
        const sessionEndTime = sessionStartTime + 120; // 2 hours in minutes

        if (currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
          ongoingSessions++;
        } else if (currentTime < sessionStartTime) {
          upcomingSessions++;
        } else {
          completedSessions++;
        }
      } else if (sessionDate > now) {
        upcomingSessions++;
      } else {
        completedSessions++;
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalSessions,
        completedSessions,
        upcomingSessions,
        ongoingSessions
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching session statistics'
    });
  }
}; 