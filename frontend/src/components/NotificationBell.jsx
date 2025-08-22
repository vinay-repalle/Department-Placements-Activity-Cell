import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, loading, error, markAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const allNotifications = notifications;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        <div className="absolute right-0 mt-2 w-96 max-h-[70vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowDropdown(false)}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 transition"
              aria-label="Close notifications"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          <div className="space-y-2 p-4">
            {loading ? (
              <div className="text-center py-4">Loading notifications...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-600">{error}</div>
            ) : allNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-2">No notifications</p>
            ) : (
              allNotifications.slice(0, 8).map((notification) => (
                <div
                  key={notification._id}
                  className={`flex flex-col gap-1 p-4 rounded-lg border transition shadow-sm ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-base truncate">{notification.title}</h4>
                      <p className="text-gray-600 text-sm mt-0.5 break-words">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-4 text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                    {notification.link && (
                      <a href={notification.link} className="text-xs text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))
              )}
            <div className="pt-2 text-center">
              <a href="/notifications" className="text-blue-600 hover:underline text-sm font-medium">View All Notifications</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 