import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/api';
import AdminSessionManagement from './AdminSessionManagement';
import SessionFeedback from './SessionFeedback';

const typeStyles = {
  Ongoing: {
    badge: 'bg-green-100 text-green-700',
    chip: 'bg-green-50 text-green-700',
    icon: '🟢',
  },
  Upcoming: {
    badge: 'bg-blue-100 text-blue-700',
    chip: 'bg-blue-50 text-blue-700',
    icon: '🔵',
  },
  Previous: {
    badge: 'bg-gray-200 text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
    icon: '⚪',
  },
};

const ThreeSessions = ({ sessions, type, isAdmin, onDelete, onCancel, onComplete, sectionId }) => {
  const [showAll, setShowAll] = useState(false);
  const [studentResponses, setStudentResponses] = useState({});
  const [loadingResponses, setLoadingResponses] = useState({});
  const { user } = useAuth();
  const displayedSessions = showAll ? sessions : sessions.slice(0, 3);
  const hasMoreSessions = sessions.length > 3;

  // Check if current user is a student
  const isStudent = user?.role === 'student';

  // Load existing student responses on component mount
  useEffect(() => {
    if (isStudent && user?._id) {
      loadStudentResponses();
    }
  }, [isStudent, user?._id, sessions]);

  const loadStudentResponses = async () => {
    try {
      const responses = {};
      for (const session of sessions) {
        if (isStudentEligible(session)) {
          try {
            const response = await sessionService.getStudentAttendance(session.id);
            if (response.data && response.data.attendance) {
              responses[session.id] = response.data.attendance.willAttend;
            }
          } catch (error) {
            // No response found, that's okay
          }
        }
      }
      setStudentResponses(responses);
    } catch (error) {
      console.error('Error loading student responses:', error);
    }
  };

  const handleViewMore = () => {
    setShowAll(!showAll);
    if (!showAll) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handle student attendance response
  const handleAttendanceResponse = async (sessionId, willAttend) => {
    if (!isStudent) return;

    setLoadingResponses(prev => ({ ...prev, [sessionId]: true }));
    
    try {
      await sessionService.submitAttendanceResponse(sessionId, willAttend);
      setStudentResponses(prev => ({ ...prev, [sessionId]: willAttend }));
    } catch (error) {
      console.error('Error submitting attendance response:', error);
      alert(error.response?.data?.message || 'Failed to submit attendance response');
    } finally {
      setLoadingResponses(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  // Check if student is eligible for session
  const isStudentEligible = (session) => {
    if (!isStudent || !user) return false;
    
    const yearEligible = !session.targetAudience || 
                        (Array.isArray(session.targetAudience) ? 
                          session.targetAudience.includes('all') || session.targetAudience.includes(user.yearOfStudy) :
                          session.targetAudience === 'all' || user.yearOfStudy === session.targetAudience);
    
    const deptEligible = !session.targetDepartments || 
                        (Array.isArray(session.targetDepartments) ? 
                          session.targetDepartments.includes('ALL') || session.targetDepartments.includes(user.department) :
                          session.targetDepartments === 'ALL' || user.department === session.targetDepartments);
    
    return yearEligible && deptEligible;
  };

  if (sessions.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/60 rounded-2xl p-10 text-center shadow-lg border border-blue-100">
        <p className="text-blue-500 text-lg font-semibold">No {type.toLowerCase()} sessions available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {displayedSessions.map((session) => {
          const isEligible = isStudentEligible(session);
          const currentResponse = studentResponses[session.id];
          const isLoading = loadingResponses[session.id];

          return (
            <div
              key={session.id}
              className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-7 flex flex-col min-h-[340px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] group"
            >
              {/* Status Badge */}
              <div className={`absolute top-5 right-5 px-4 py-1 rounded-full text-xs font-bold shadow ${typeStyles[type]?.badge || 'bg-blue-100 text-blue-700'}`}
                title={type}
              >
                <span className="mr-1">{typeStyles[type]?.icon}</span> {type}
              </div>
              
              {/* Profile & Title */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={session.profileImage}
                  alt={session.conductedBy?.fullName || 'Session Head'}
                  className="w-14 h-14 rounded-full border-4 border-blue-200 shadow object-cover bg-gray-100"
                />
                <div>
                  <div className="font-bold text-lg text-blue-900 group-hover:text-blue-700 transition">{session.conductedBy?.fullName || session.conductedBy || 'TBA'}</div>
                  <div className="text-xs text-blue-500 font-semibold">Session Head</div>
                </div>
              </div>
              
              {/* Session Title */}
              <div className="mb-2">
                <div className="text-xl font-extrabold text-gray-900 mb-1 truncate group-hover:text-blue-700 transition">{session.title}</div>
              </div>
              
              {/* Target Audience & Department Info */}
              {(session.targetAudience || session.targetDepartments) && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Target Audience:</div>
                  <div className="flex flex-wrap gap-2">
                    {session.targetAudience && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs font-medium text-blue-700">Years:</span>
                        {Array.isArray(session.targetAudience) ? (
                          session.targetAudience.map(year => (
                            <span key={year} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {year === 'all' ? 'All Years' : year}
                            </span>
                          ))
                        ) : (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {session.targetAudience === 'all' ? 'All Years' : session.targetAudience}
                          </span>
                        )}
                      </div>
                    )}
                    {session.targetDepartments && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs font-medium text-blue-700">Depts:</span>
                        {Array.isArray(session.targetDepartments) ? (
                          session.targetDepartments.map(dept => (
                            <span key={dept} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {dept === 'ALL' ? 'All Departments' : dept}
                            </span>
                          ))
                        ) : (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {session.targetDepartments === 'ALL' ? 'All Departments' : session.targetDepartments}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Info Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow ${typeStyles[type]?.chip}`}>
                  <span role="img" aria-label="calendar">📅</span> {session.month} {session.date}
                </span>
                <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="clock">⏰</span> {session.time || 'TBA'}
                </span>
                <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {session.venue}
                </span>
              </div>
              
              {/* Description */}
              <div className="text-gray-700 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                {session.description}
              </div>
              
              {/* Student Attendance Buttons */}
              {isStudent && isEligible && type === 'Upcoming' && (
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Will you attend this session?</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendanceResponse(session.id, true)}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        currentResponse === true
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? 'Submitting...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => handleAttendanceResponse(session.id, false)}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        currentResponse === false
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? 'Submitting...' : 'No'}
                    </button>
                  </div>
                  {currentResponse !== undefined && (
                    <div className="text-xs text-gray-500 mt-2">
                      Response submitted: {currentResponse ? 'Yes' : 'No'}
                    </div>
                  )}
                </div>
              )}

              {/* Student Feedback for Completed Sessions */}
              {isStudent && isEligible && type === 'Previous' && (
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <SessionFeedback session={session} />
                </div>
              )}
              
              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex gap-3 mt-auto pt-2">
                  {type === 'Ongoing' && (
                    <button
                      onClick={() => onComplete && onComplete(session.id)}
                      className="p-2 rounded-full bg-green-50 hover:bg-green-200 text-green-700 shadow transition"
                      title="Mark as Complete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(session.id)}
                    className="p-2 rounded-full bg-yellow-50 hover:bg-yellow-200 text-yellow-700 shadow transition"
                    title="Cancel Session"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(session.id)}
                    className="p-2 rounded-full bg-red-50 hover:bg-red-200 text-red-700 shadow transition"
                    title="Delete Session"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Admin Session Management - Show on hover only */}
              {isAdmin && (
                <div className="mt-4 transition-opacity duration-300">
                  <AdminSessionManagement 
                    session={session} 
                    onUpdate={(action) => {
                      if (action === 'start') {
                        // Handle session start
                        console.log('Session started:', session.id);
                      } else if (action === 'complete') {
                        onComplete && onComplete(session.id);
                      } else if (action === 'cancel') {
                        onCancel(session.id);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {hasMoreSessions && (
        <div className="mt-10 text-center">
          <button
            onClick={handleViewMore}
            className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            {showAll ? 'Show Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreeSessions;