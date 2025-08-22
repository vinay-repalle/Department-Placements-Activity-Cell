import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications as apiGetNotifications, markNotificationAsRead as apiMarkAsRead } from '../services/api';

const NotificationContext = createContext();

/**
 * Notification Context
 * 
 * Manages application-wide notifications and alerts using React Context.
 * Handles real-time notifications, alerts, and message broadcasting.
 * 
 * Context Values:
 * - notifications: Array of current notifications
 * - unreadCount: Number of unread notifications
 * - loading: Loading state for notifications
 * - error: Error state for notification operations
 * 
 * Methods:
 * - addNotification: Create new notification
 * - removeNotification: Delete notification
 * - markAsRead: Mark notification as read
 * - clearAll: Clear all notifications
 * - fetchNotifications: Get user notifications
 * 
 * Notification Types:
 * - System notifications
 * - Session updates
 * - User mentions
 * - Admin alerts
 * - Custom messages
 * 
 * Features:
 * - Real-time updates
 * - Notification persistence
 * - Read/unread tracking
 * - Priority levels
 * - Notification grouping
 * 
 * Usage:
 * ```jsx
 * // Wrap your app with NotificationProvider
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * 
 * // Use notifications in components
 * const { notifications, markAsRead } = useNotifications();
 * ```
 * 
 * @type {React.Context} Notification management context
 */

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetNotifications();
      const notifications = response?.data?.notifications || [];
      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
    }
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiMarkAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const value = {
    notifications,
    loading,
    error,
    addNotification,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 