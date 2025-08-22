/**
 * AdminNotifications Component
 * 
 * A specialized notification component for administrators that displays system-wide
 * notifications and allows for notification management.
 * 
 * Features:
 * - Real-time notification updates
 * - Notification filtering (All/Unread/Read)
 * - Bulk actions (Mark all as read)
 * - Notification categories
 * - Detailed notification view
 * - Action buttons for each notification
 * 
 * Components Used:
 * - React Hooks: useState, useEffect
 * - NotificationContext: For notification management
 * - Tailwind CSS: For styling
 * - React Icons: For visual indicators
 * 
 * Notification Types:
 * - Session Requests
 * - System Alerts
 * - User Reports
 * - Registration Approvals
 * 
 * API Integration:
 * - GET /api/notifications/admin
 * - PUT /api/notifications/bulk-update
 * - DELETE /api/notifications
 * 
 * @type {dynamic} - Real-time updates and filtering
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (notificationId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/notifications/${notificationId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh notifications
      fetchNotifications();

      // Show success message (you can implement a toast/alert system)
      console.log(`Successfully ${action}ed submission`);
    } catch (error) {
      console.error(`Error ${action}ing submission:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Placement Submissions</h2>
      
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notification.studentName} - {notification.branch} ({notification.year})
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Company: <span className="font-medium">{notification.company}</span>
                  </p>
                  <p className="text-gray-600">
                    Position: <span className="font-medium">{notification.position}</span>
                  </p>
                  <p className="text-gray-600">
                    Package: <span className="font-medium">{notification.package} LPA</span>
                  </p>
                  <p className="text-gray-600">
                    Location: <span className="font-medium">{notification.location}</span>
                  </p>
                  <p className="text-gray-600">
                    Joining Date: <span className="font-medium">
                      {new Date(notification.joiningDate).toLocaleDateString()}
                    </span>
                  </p>
                  {notification.additionalInfo && (
                    <p className="text-gray-600 mt-2">
                      Additional Info: <span className="font-medium">{notification.additionalInfo}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted on: {new Date(notification.submittedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(notification.id, 'accept')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(notification.id, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No pending submissions to review
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications; 