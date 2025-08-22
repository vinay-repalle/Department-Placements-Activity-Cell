/**
 * NotificationIcon Component
 * 
 * A dynamic notification bell icon that displays real-time notifications
 * and provides interaction with the notification system.
 * 
 * Features:
 * - Real-time notification updates
 * - Unread count badge
 * - Dropdown notification list
 * - Mark as read functionality
 * - Notification filtering
 * 
 * Props:
 * @param {boolean} showBadge - Whether to show unread count badge
 * @param {string} size - Icon size (sm/md/lg)
 * @param {Function} onClick - Click handler for the icon
 * @param {string} className - Additional CSS classes
 * 
 * States:
 * - isOpen: Dropdown open state
 * - notifications: Current notifications list
 * - unreadCount: Number of unread notifications
 * - loading: Loading state indicator
 * 
 * Interactions:
 * 1. Click Behavior
 *    - Toggle dropdown
 *    - Mark notifications as read
 *    - Navigate to full view
 * 
 * 2. Notification Display
 *    - Title and preview
 *    - Timestamp
 *    - Read/Unread status
 *    - Priority indicators
 * 
 * 3. Animation
 *    - Smooth dropdown transition
 *    - Badge animations
 *    - Loading states
 * 
 * Dependencies:
 * - NotificationContext for data
 * - useNotifications hook
 * - Tailwind CSS for styling
 * 
 * @component NotificationIcon
 * @example
 * ```jsx
 * <NotificationIcon
 *   showBadge={true}
 *   size="md"
 *   onClick={handleClick}
 *   className="text-gray-600"
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationIcon = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const notificationDropdownRef = useRef(null);
  const { notifications, loading, error, markAsRead } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  // Get recent notifications (last 5)
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={notificationDropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none hover:cursor-pointer"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <Link
                to="/notifications"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setShowDropdown(false)}
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-700">Loading notifications...</div>
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : recentNotifications.length === 0 ? (
                <div className="text-sm text-gray-700">No notifications</div>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <span className="mt-2 inline-block text-xs text-blue-600">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;