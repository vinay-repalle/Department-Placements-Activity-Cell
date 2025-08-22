import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminNotification from './AdminNotification';
import api from '../services/api';

const NotificationSystem = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const [category, setCategory] = useState('all'); // 'all', 'sessions', 'terms'
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/notifications/user/${user._id}`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.status === filter;
    const matchesCategory = category === 'all' || notification.type === category;
    return matchesFilter && matchesCategory;
  });

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, status: 'read' }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // If user is admin, show AdminNotification component
  if (user?.role === 'admin') {
    return <AdminNotification />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
        
        {/* Filters */}
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>

          {/* Category filter for admin */}
          {user?.role === 'admin' && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="sessions">Sessions</option>
              <option value="terms">Terms & Conditions</option>
            </select>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading notifications...</div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border ${
                notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {notification.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">No notifications found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem; 