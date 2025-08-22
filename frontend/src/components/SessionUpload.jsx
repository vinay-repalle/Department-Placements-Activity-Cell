import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSuccessAlert from './ModernSuccessAlert';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SessionUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowBlur(true); // Show blur immediately after button click

    try {
      const title = e.target.elements.title.value.trim();
      const description = e.target.elements.description.value.trim();
      const date = e.target.elements.date.value;
      const time = e.target.elements.time.value;
      const venue = e.target.elements.venue.value.trim();
      const feedbackFormLink = e.target.elements.feedbackFormLink.value.trim();
      const sessionHead = e.target.elements.sessionHead.value.trim();
      const department = e.target.elements.department.value;

      // Check if all required fields are filled
      if (!title || !description || !date || !time || !venue || !sessionHead || !department) {
        setError('Please fill in all required fields.');
        setIsLoading(false);
        setShowBlur(false);
        return;
      }

      // Validate date is in the future
      const sessionDate = new Date(date);
      const now = new Date();
      if (sessionDate <= now) {
        setError('Session date must be in the future');
        setIsLoading(false);
        setShowBlur(false);
        return;
      }

      // Prepare session data
      const sessionData = {
        title,
        description,
        date,
        time,
        venue,
        feedbackFormLink,
        sessionHead,
        department,
        status: 'upcoming'
      };

      // Call API to create session
      const response = await sessionService.createSession(sessionData);
      
      if (response.status === 'success') {
        setShowSuccessAlert(true);
      } else {
        setError(response.message || 'Failed to create session');
        setShowBlur(false);
      }
    } catch (err) {
      console.error('Session upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred during session upload';
      setError(errorMessage);
      setShowBlur(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
    setShowBlur(false);
    navigate('/admin');
  };

  return (
    <div className="relative min-h-screen">
      <div className={`min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8 ${showBlur ? 'blur-sm' : ''}`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 border border-blue-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">Upload Session</h1>
              <p className="mt-2 text-sm sm:text-base text-blue-600">
                Create a new session for students and faculty
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter session title"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter session description"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-blue-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    min={minDate}
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-blue-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-blue-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    id="venue"
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter venue"
                  />
                </div>

                <div>
                  <label htmlFor="sessionHead" className="block text-sm font-medium text-blue-700 mb-1">
                    Session Head
                  </label>
                  <input
                    type="text"
                    name="sessionHead"
                    id="sessionHead"
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter session head name"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-blue-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    id="department"
                    required
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="All">All Departments</option>
                    <option value="CSE">Computer Science Engineering</option>
                    <option value="ECE">Electronics & Communication Engineering</option>
                    <option value="EEE">Electrical & Electronics Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                    <option value="CHEM">Chemical Engineering</option>
                    <option value="MME">Metallurgical and Materials Engineering</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="feedbackFormLink" className="block text-sm font-medium text-blue-700 mb-1">
                    Feedback Form Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="feedbackFormLink"
                    id="feedbackFormLink"
                    className="block w-full px-4 py-3 text-base border border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter feedback form URL"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base hover:cursor-pointer font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creating Session...' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Alert - Now positioned absolutely over the blurred background */}
      {showSuccessAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <ModernSuccessAlert
              message="Session created successfully! Redirecting to admin dashboard..."
              onClose={handleCloseAlert}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionUpload; 