import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BellIcon className="h-7 w-7 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-16 text-gray-500">
              <span className="animate-spin h-8 w-8 mb-2 border-4 border-blue-200 border-t-blue-500 rounded-full inline-block"></span>
              Loading notifications...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-16 text-red-600">
              <ExclamationCircleIcon className="h-8 w-8 mb-2" />
              {error}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-500">
              <CheckCircleIcon className="h-8 w-8 mb-2" />
              {filter === 'all'
                ? 'No notifications'
                : filter === 'unread'
                ? 'No unread notifications'
                : 'No read notifications'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-5 rounded-xl shadow transition-colors border border-gray-100 cursor-pointer hover:bg-blue-50/60 ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === 'session' ? (
                      <BellIcon className="h-6 w-6 text-blue-400" />
                    ) : notification.type === 'terms' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-400" />
                    ) : (
                      <ExclamationCircleIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      {!notification.read && (
                        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                          New
                        </span>
                      )}
                      {notification.type && (
                        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                          notification.type === 'session'
                            ? 'bg-blue-100 text-blue-700'
                            : notification.type === 'terms'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications; 