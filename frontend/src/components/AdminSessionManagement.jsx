import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/api';

const AdminSessionManagement = ({ session, onUpdate }) => {
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [feedbackLink, setFeedbackLink] = useState('');
  const [uploadingFeedback, setUploadingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (session && session.id) {
      fetchAttendanceStats();
    }
  }, [session]);

  const fetchAttendanceStats = async () => {
    if (!session?.id) return;
    
    setLoadingStats(true);
    try {
      const response = await sessionService.getAttendanceStats(session.id);
      setAttendanceStats(response.data);
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleFeedbackLinkUpload = async () => {
    if (!feedbackLink.trim()) {
      alert('Please enter a feedback form link');
      return;
    }

    setUploadingFeedback(true);
    try {
      await sessionService.uploadFeedbackLink(session.id, feedbackLink.trim());
      
      setFeedbackLink('');
      setShowFeedbackForm(false);
      alert('Feedback link uploaded successfully and students notified!');
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error uploading feedback link:', error);
      alert(error.response?.data?.message || 'Failed to upload feedback link');
    } finally {
      setUploadingFeedback(false);
    }
  };

  const downloadAttendanceReport = async () => {
    if (!session?.id) return;
    
    try {
      const blob = await sessionService.getAttendanceReport(session.id);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `session_attendance_${session.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attendance report:', error);
      alert('Failed to download attendance report');
    }
  };

  if (!session) return null;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Session Management</h3>
      
      {/* Target Audience Info
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm font-semibold text-blue-800 mb-2">Target Audience:</div>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div> */}

      {/* Attendance Statistics */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Attendance Statistics</h4>
          <button
            onClick={fetchAttendanceStats}
            disabled={loadingStats}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
          >
            {loadingStats ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        {attendanceStats ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{attendanceStats.willAttendCount}</div>
              <div className="text-xs text-green-600">Will Attend</div>
              <div className="text-xs text-green-500">{attendanceStats.willAttendPercentage}%</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">{attendanceStats.willNotAttendCount}</div>
              <div className="text-xs text-red-600">Will Not Attend</div>
              <div className="text-xs text-red-500">{attendanceStats.willNotAttendPercentage}%</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 col-span-2">
              <div className="text-lg font-bold text-blue-700">{attendanceStats.totalResponses}</div>
              <div className="text-xs text-blue-600">Total Responses</div>
              <div className="text-xs text-blue-500">Response Rate: {attendanceStats.responseRate}%</div>
            </div>
            
            {/* Feedback Statistics */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 col-span-2">
              <div className="text-lg font-bold text-yellow-700">{attendanceStats.feedbackSubmittedCount}</div>
              <div className="text-xs text-yellow-600">Feedback Submitted</div>
              <div className="text-xs text-yellow-500">{attendanceStats.feedbackSubmittedPercentage}%</div>
              {attendanceStats.averageRating > 0 && (
                <div className="text-xs text-yellow-500 mt-1">
                  Avg Rating: {attendanceStats.averageRating}/5
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No attendance data available</div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* Download Report */}
        <button
          onClick={downloadAttendanceReport}
          className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Attendance Report
        </button>

        {/* Feedback Link Upload */}
        {session.status === 'ongoing' && (
          <div>
            {!showFeedbackForm ? (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Upload Feedback Link
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={feedbackLink}
                  onChange={(e) => setFeedbackLink(e.target.value)}
                  placeholder="Enter feedback form link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleFeedbackLinkUpload}
                    disabled={uploadingFeedback}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {uploadingFeedback ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setFeedbackLink('');
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Controls */}
        <div className="flex gap-2">
          {session.status === 'upcoming' && (
            <button
              onClick={() => onUpdate && onUpdate('start')}
              className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition"
            >
              Start Session
            </button>
          )}
          {session.status === 'ongoing' && (
            <button
              onClick={() => onUpdate && onUpdate('complete')}
              className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
            >
              Complete Session
            </button>
          )}
          {/* <button
            onClick={() => onUpdate && onUpdate('cancel')}
            className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
          >
            Cancel Session
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AdminSessionManagement; 