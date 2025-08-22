/**
 * Profile Component
 * 
 * Displays and manages user profile information with role-specific features
 * and dynamic content sections.
 * 
 * Features:
 * - Personal information display and editing
 * - Role-specific content (Student/Alumni/Faculty)
 * - Profile image management
 * - Session history and contributions
 * - Academic/Professional details
 * 
 * Props:
 * @param {Object} user - Current user object
 * @param {string} role - User role (student/alumni/faculty)
 * @param {Function} onUpdate - Profile update handler
 * @param {boolean} isEditable - Whether profile is in edit mode
 * 
 * State:
 * - editMode: Profile editing state
 * - loading: Data loading state
 * - error: Error message state
 * - formData: Form field values
 * 
 * Sections:
 * 1. Profile Header
 *    - Profile image
 *    - Basic information
 *    - Edit controls
 * 
 * 2. Personal Details
 *    - Contact information
 *    - Biography
 *    - Social links
 * 
 * 3. Role-Specific Content
 *    - Student: Academic details, placements
 *    - Alumni: Professional experience
 *    - Faculty: Department, expertise
 * 
 * 4. Session Information
 *    - Conducted sessions
 *    - Attended sessions
 *    - Upcoming sessions
 * 
 * Dependencies:
 * - AuthContext for user data
 * - API services for data fetching
 * - Image upload utilities
 * 
 * @component Profile
 * @example
 * ```jsx
 * <Profile 
 *   user={currentUser}
 *   role="student"
 *   onUpdate={handleUpdate}
 *   isEditable={true}
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TermsAndConditions from './TermsAndConditions';
import axios from 'axios';
import md5 from 'md5'; // Add this import for Gravatar
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getGravatarUrl = (email) => {
  if (!email) return null;
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const Profile = ({ profileData, overviewFields, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(profileData || {});
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sessionContributions, setSessionContributions] = useState({
    requested: [],
    conducted: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Update data when profileData changes
  useEffect(() => {
    if (profileData) {
      setData(profileData);
    }
  }, [profileData]);

  // Fetch session contributions for alumni, faculty, and admin
  useEffect(() => {
    if (user?.role === 'alumni' || user?.role === 'faculty' || user?.role === 'admin') {
      const fetchSessionContributions = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/api/sessions/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Show all requested sessions, not just approved
          const requested = response.data.data?.requestedSessions || [];
          setSessionContributions({
            requested,
            conducted: response.data.data?.conductedSessions || []
          });
        } catch (error) {
          console.error('Error fetching session contributions:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSessionContributions();
    }
  }, [user?.role, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfileImage = reader.result;
        setData(prevData => ({
          ...prevData,
          profileImage: newProfileImage
        }));
        if (user) {
          const updatedUser = { ...user, profilePhoto: newProfileImage };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    setIsPhotoEditing(false);
    if (onSave) {
      await onSave(data);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Default overview fields if none provided
  const defaultOverviewFields = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' }
  ];

  const fieldsToUse = overviewFields || defaultOverviewFields;

  return (
    <div className="p-6 flex-grow">
      {/* Profile Cover Section */}
      <div
        className="relative bg-cover bg-center h-45 rounded-lg shadow-md"
        style={{
          backgroundImage: 'url(assets/images/background/profile-cover.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 rounded-lg h-25"></div>
        <div className="absolute bottom-0 left-0 p-6 flex items-center space-x-4">
          <div className="relative">
            <img
              src={
                data.profileImage
                  ? data.profileImage
                  : (data.mailId || data.email)
                    ? getGravatarUrl(data.mailId || data.email)
                    : '/src/assets/profile1.jpg'
              }
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-scale-up"
              alt="Profile"
              style={{ transform: 'translateY(18%)' }}
            />
            {isPhotoEditing && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            )}
            <button
              onClick={() => {
                setIsPhotoEditing(true);
                fileInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 bg-blue-600 text-gray-800 rounded-full p-2 hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div className="" style={{ transform: 'translateY(40%)' }}>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="fullName"
                  value={data.fullName || ''}
                  onChange={handleInputChange}
                  className="text-2xl font-semibold bg-transparent border-b border-white text-gray-800 focus:outline-none"
                />
                <input
                  type="text"
                  name="username"
                  value={data.username || ''}
                  onChange={handleInputChange}
                  className="text-gray-800 bg-transparent border-b border-white focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold">{data.fullName || 'User'}</h2>
                <p className="text-gray-800">@{data.username || 'username'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Overview Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Profile Overview</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldsToUse.map((field) => (
            <div key={field.name}>
              <h5 className="text-sm font-semibold text-gray-800 uppercase">{field.label}</h5>
              {isEditing ? (
                field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={data[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={data[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                )
              ) : (
                <p className="text-gray-600">{data[field.name] || 'Not specified'}</p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Session Contributions Section for Alumni and Faculty */}
      {(user?.role === 'alumni' || user?.role === 'faculty' || user?.role === 'admin') && (
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow">📚</span>
            <h3 className="text-2xl font-extrabold text-blue-900 tracking-tight">Session Contributions</h3>
          </div>
          {isLoading ? (
            <div className="text-center py-4">Loading session data...</div>
          ) : (
            <>
              {/* Requested Sessions */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-blue-700 flex items-center gap-2">Requested Sessions <span className="text-base">📝</span></h4>
                  <button
                    onClick={() => document.getElementById('requestedSessions').classList.toggle('hidden')}
                    className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
                  >
                    Toggle
                  </button>
                </div>
                <div id="requestedSessions" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessionContributions.requested.length > 0 ? (
                    sessionContributions.requested.map((session) => (
                      <div key={session._id} className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col min-h-[140px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow ${
                          session.status === 'accepted' || session.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : session.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                        </div>
                        <div className="text-lg font-bold text-blue-900 mb-1 truncate group-hover:text-blue-700 transition">{session.sessionTitle || session.title}</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                            <span role="img" aria-label="calendar">📅</span> {session.preferredDate ? new Date(session.preferredDate).toLocaleDateString() : (session.date ? new Date(session.date).toLocaleDateString() : 'N/A')}
                          </span>
                        </div>
                        <div className="text-gray-700 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                          {session.sessionDescription || session.description || 'No description.'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No requested sessions found
                    </div>
                  )}
                </div>
              </div>

              {/* Conducted Sessions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-blue-700 flex items-center gap-2">Conducted Sessions <span className="text-base">🎤</span></h4>
                  <button
                    onClick={() => document.getElementById('conductedSessions').classList.toggle('hidden')}
                    className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
                  >
                    Toggle
                  </button>
                </div>
                <div id="conductedSessions" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessionContributions.conducted.length > 0 ? (
                    sessionContributions.conducted.map((session) => (
                      <div key={session._id} className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col min-h-[140px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow ${
                          session.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : session.status === 'ongoing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1) || 'Completed'}
                        </div>
                        <div className="text-lg font-bold text-blue-900 mb-1 truncate group-hover:text-blue-700 transition">{session.title}</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                            <span role="img" aria-label="calendar">📅</span> {session.date ? new Date(session.date).toLocaleDateString() : 'N/A'}
                          </span>
                          {session.venue && (
                            <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                              <span role="img" aria-label="venue">🏛️</span> {session.venue}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                          {session.description || 'No description.'}
                        </div>
                        {session.participants && (
                          <div className="mt-2 text-xs text-gray-500">Attendees: {session.participants.length}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No conducted sessions found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Terms and Conditions Form for E3/E4 Students */}
      {user?.role === 'student' && ['E3', 'E-3', 'E4', 'E-4'].includes(user?.yearOfStudy) && (
        <div className="mt-8">
          <TermsAndConditions />
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;