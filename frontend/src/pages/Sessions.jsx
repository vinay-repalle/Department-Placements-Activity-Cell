import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import ThreeSessions from '../components/ThreeSessions';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Sessions = () => {
  const [sessions, setSessions] = useState({
    ongoing: [],
    previous: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await sessionService.getAllSessions();
        const allSessions = response.data?.sessions || [];

        // Filter out cancelled or rejected sessions
        const visibleSessions = allSessions.filter(
          session => session.status !== 'cancelled' && session.status !== 'rejected'
        );

        // Categorize sessions
        const categorizedSessions = {
          ongoing: [],
          previous: [],
          upcoming: []
        };

        visibleSessions.forEach(session => {
          if (!session) return; // Skip if session is null or undefined

          // Log for debugging
          if (session.manuallyCompleted) {
            console.log(`Session ${session._id || session.title} is manually completed.`);
          }

          const sessionDate = new Date(session.date);
          const sessionTime = (session.time || '00:00').split(':');
          sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));

          // Format the session data
          const formattedSession = {
            title: session.title || 'Untitled Session',
            description: session.description || 'No description available',
            conductedBy: session.sessionHead || { fullName: 'TBA' },
            profileImage: (session.sessionHead && session.sessionHead.profilePhoto) || '/default-profile.png',
            date: sessionDate.getDate().toString(),
            month: sessionDate.toLocaleString('default', { month: 'long' }),
            venue: session.venue || 'TBA',
            location: session.venue || 'TBA',
            id: session._id,
            status: session.status || 'upcoming',
            time: session.time || '',
            department: session.department || '',
            manuallyCompleted: session.manuallyCompleted || false,
            targetAudience: Array.isArray(session.targetAudience) ? session.targetAudience : [session.targetAudience || 'all'],
            targetDepartments: Array.isArray(session.targetDepartments) ? session.targetDepartments : [session.targetDepartments || 'ALL'],
          };

          // If session is manually completed, always treat as completed
          if (session.manuallyCompleted) {
            formattedSession.status = 'completed';
            categorizedSessions.previous.push(formattedSession);
            console.log(`Session ${session._id || session.title} pushed to previous (completed) due to manual completion.`);
            return;
          }

          // Calculate session end time (assuming 2 hours duration)
          const sessionEndDate = new Date(sessionDate);
          sessionEndDate.setHours(sessionEndDate.getHours() + 2);

          // Get current date/time and normalize to same day comparison
          const now = new Date();
          const isToday = sessionDate.toDateString() === now.toDateString();
          
          // Categorize based on date and time
          if (isToday) {
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const sessionStartTime = parseInt(sessionTime[0]) * 60 + parseInt(sessionTime[1]);
            const sessionEndTime = sessionStartTime + 120; // 2 hours in minutes

            if (currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
              // Session is currently ongoing
              formattedSession.status = 'ongoing';
              categorizedSessions.ongoing.push(formattedSession);
            } else if (currentTime < sessionStartTime) {
              // Session is today but hasn't started
              formattedSession.status = 'upcoming';
              categorizedSessions.upcoming.push(formattedSession);
            } else {
              // Session has ended
              formattedSession.status = 'completed';
              categorizedSessions.previous.push(formattedSession);
            }
          } else if (sessionDate > now) {
            // Future session
            formattedSession.status = 'upcoming';
            categorizedSessions.upcoming.push(formattedSession);
          } else {
            // Past session
            formattedSession.status = 'completed';
            categorizedSessions.previous.push(formattedSession);
          }
        });

        // Sort sessions by date
        categorizedSessions.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        categorizedSessions.previous.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
        
        // After categorizing sessions
        // Filter out cancelled/rejected sessions from each list
        const filteredSessions = {
          upcoming: categorizedSessions.upcoming.filter(s => s.status !== 'cancelled' && s.status !== 'rejected'),
          ongoing: categorizedSessions.ongoing.filter(s => s.status !== 'cancelled' && s.status !== 'rejected'),
          previous: categorizedSessions.previous.filter(s => s.status !== 'cancelled' && s.status !== 'rejected'),
        };
        setSessions(filteredSessions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err.response?.data?.message || 'Failed to load sessions. Please try again later.');
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        await sessionService.deleteSession(sessionId);
        // Refresh sessions after deletion
        const response = await sessionService.getAllSessions();
        const allSessions = response.data?.sessions || [];
        
        // Re-categorize sessions
        const categorizedSessions = {
          ongoing: [],
          previous: [],
          upcoming: []
        };

        allSessions.forEach(session => {
          if (!session) return;

          const sessionDate = new Date(session.date);
          const sessionTime = (session.time || '00:00').split(':');
          sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));

          const formattedSession = {
            title: session.title || 'Untitled Session',
            description: session.description || 'No description available',
            conductedBy: session.sessionHead || { fullName: 'TBA' },
            profileImage: (session.sessionHead && session.sessionHead.profilePhoto) || '/default-profile.png',
            date: sessionDate.getDate().toString(),
            month: sessionDate.toLocaleString('default', { month: 'long' }),
            venue: session.venue || 'TBA',
            location: session.venue || 'TBA',
            id: session._id,
            status: session.status || 'upcoming',
            time: session.time || '',
            department: session.department || '',
          };

          if (session.status === 'ongoing') {
            categorizedSessions.ongoing.push(formattedSession);
          } else if (session.status === 'completed') {
            categorizedSessions.previous.push(formattedSession);
          } else {
            categorizedSessions.upcoming.push(formattedSession);
          }
        });

        setSessions(categorizedSessions);
      } catch (err) {
        console.error('Error deleting session:', err);
        setError('Failed to delete session. Please try again later.');
      }
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to cancel this session? This will mark the session as cancelled.')) {
      try {
        await sessionService.updateSessionStatus(sessionId, 'cancelled');
        // Refresh sessions after cancellation
        const response = await sessionService.getAllSessions();
        const allSessions = response.data?.sessions || [];
        
        // Re-categorize sessions
        const categorizedSessions = {
          ongoing: [],
          previous: [],
          upcoming: []
        };

        allSessions.forEach(session => {
          if (!session) return;

          const sessionDate = new Date(session.date);
          const sessionTime = (session.time || '00:00').split(':');
          sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));

          const formattedSession = {
            title: session.title || 'Untitled Session',
            description: session.description || 'No description available',
            conductedBy: session.sessionHead || { fullName: 'TBA' },
            profileImage: (session.sessionHead && session.sessionHead.profilePhoto) || '/default-profile.png',
            date: sessionDate.getDate().toString(),
            month: sessionDate.toLocaleString('default', { month: 'long' }),
            venue: session.venue || 'TBA',
            location: session.venue || 'TBA',
            id: session._id,
            status: session.status || 'upcoming',
            time: session.time || '',
            department: session.department || '',
          };

          if (session.status === 'ongoing') {
            categorizedSessions.ongoing.push(formattedSession);
          } else if (session.status === 'completed') {
            categorizedSessions.previous.push(formattedSession);
          } else {
            categorizedSessions.upcoming.push(formattedSession);
          }
        });

        setSessions(categorizedSessions);
      } catch (err) {
        console.error('Error cancelling session:', err);
        setError('Failed to cancel session. Please try again later.');
      }
    }
  };

  const handleCompleteSession = async (sessionId) => {
    if (window.confirm('Mark this session as completed?')) {
      try {
        await sessionService.updateSessionStatus(sessionId, 'completed');
        // Refresh sessions after completion
        const response = await sessionService.getAllSessions();
        const allSessions = response.data?.sessions || [];
        // Re-categorize sessions (reuse logic from above)
        const categorizedSessions = {
          ongoing: [],
          previous: [],
          upcoming: []
        };
        allSessions.forEach(session => {
          if (!session) return;
          const sessionDate = new Date(session.date);
          const sessionTime = (session.time || '00:00').split(':');
          sessionDate.setHours(parseInt(sessionTime[0]), parseInt(sessionTime[1]));
          const formattedSession = {
            title: session.title || 'Untitled Session',
            description: session.description || 'No description available',
            conductedBy: session.sessionHead || { fullName: 'TBA' },
            profileImage: (session.sessionHead && session.sessionHead.profilePhoto) || '/default-profile.png',
            date: sessionDate.getDate().toString(),
            month: sessionDate.toLocaleString('default', { month: 'long' }),
            venue: session.venue || 'TBA',
            location: session.venue || 'TBA',
            id: session._id,
            status: session.status || 'upcoming',
            time: session.time || '',
            department: session.department || '',
          };
          if (session.status === 'ongoing') {
            categorizedSessions.ongoing.push(formattedSession);
          } else if (session.status === 'completed') {
            categorizedSessions.previous.push(formattedSession);
          } else {
            categorizedSessions.upcoming.push(formattedSession);
          }
        });
        setSessions(categorizedSessions);
      } catch (err) {
        setError('Failed to mark session as completed. Please try again later.');
      }
    }
  };

  // Scroll to the top or specific section based on the hash fragment
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Only scroll to top if there's no hash (coming from navbar)
      window.scrollTo(0, 0);
    }
  }, [window.location.hash]); // React to hash changes

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        <Header />
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        <Header />
        <Breadcrumb />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white/90 backdrop-blur-lg border border-red-200 rounded-2xl p-8 shadow-lg">
            <p className="text-red-700 text-lg font-semibold">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <Header />
      <Breadcrumb />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-12 px-4 md:px-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-50 overflow-hidden">
        <div className="max-w-3xl mx-auto z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow">Knowledge Sharing Sessions</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium">Explore ongoing, upcoming, and previous sessions conducted by our vibrant alumni, faculty, and students. Join, learn, and grow with the RGUKT community!</p>
        </div>
        {/* Decorative shapes */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-blue-400/10 rounded-full blur-2xl opacity-60 z-0"></div>
        <div className="absolute -bottom-24 right-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-blue-400/10 rounded-full blur-2xl opacity-50 z-0"></div>
      </section>
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-0 space-y-16">
        {/* Ongoing Sessions */}
        <section id="ongoing-sessions" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-green-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-2">Ongoing Sessions</h2>
          </div>
          <ThreeSessions 
            sessions={sessions.ongoing} 
            type="Ongoing" 
            isAdmin={user?.role === 'admin'}
            onDelete={handleDeleteSession}
            onCancel={handleCancelSession}
            onComplete={handleCompleteSession}
            sectionId="ongoing-sessions"
          />
        </section>
        {/* Upcoming Sessions */}
        <section id="upcoming-sessions" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-blue-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-blue-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2">Upcoming Sessions</h2>
          </div>
          <ThreeSessions 
            sessions={sessions.upcoming} 
            type="Upcoming" 
            isAdmin={user?.role === 'admin'}
            onDelete={handleDeleteSession}
            onCancel={handleCancelSession}
            sectionId="upcoming-sessions"
          />
        </section>
        {/* Previous Sessions */}
        <section id="previous-sessions" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-gray-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-gray-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 flex items-center gap-2">Previous Sessions</h2>
          </div>
          <ThreeSessions 
            sessions={sessions.previous} 
            type="Previous" 
            isAdmin={user?.role === 'admin'}
            onDelete={handleDeleteSession}
            onCancel={handleCancelSession}
            sectionId="previous-sessions"
          />
        </section>
      </div>
      <Footer />
      {/* Custom keyframes for slow spin */}
      <style>{`
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 2.5s linear infinite; }
      `}</style>
    </div>
  );
};

export default Sessions;