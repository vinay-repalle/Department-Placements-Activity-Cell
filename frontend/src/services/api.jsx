import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to process forgot password request' };
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.patch(`/api/auth/reset-password/${token}`, { password: newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/api/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Email verification failed' };
    }
  }
};

// User services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },
  getFacultyMembers: async () => {
    const response = await api.get('/api/users/faculty');
    return response.data;
  }
};

// Session services
export const sessionService = {
  getAllSessions: async () => {
    const response = await api.get('/api/sessions');
    return response.data;
  },
  createSession: async (sessionData) => {
    const response = await api.post('/api/sessions', sessionData);
    return response.data;
  },
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/api/sessions/${id}`, sessionData);
    return response.data;
  },
  deleteSession: async (id) => {
    const response = await api.delete(`/api/sessions/${id}`);
    return response.data;
  },
  updateSessionStatus: async (id, status, reason = '') => {
    const response = await api.patch(`/api/sessions/${id}/status`, { status, reason });
    return response.data;
  },
  getPendingSessions: async () => {
    const response = await api.get('/api/sessions/pending');
    return response.data;
  },
  sendSessionStatusEmail: async (sessionId, status, reason = '') => {
    const response = await api.post(`/api/sessions/${sessionId}/notify`, { status, reason });
    return response.data;
  },
  getUserSessions: async (userId) => {
    const response = await api.get(`/api/sessions/user/${userId}`);
    return response.data;
  }
};

// Department services
export const departmentService = {
  getAllDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },
  getDepartmentMembers: async (departmentId) => {
    const response = await api.get(`/departments/${departmentId}/members`);
    return response.data;
  },
};

// Placement services
export const placementService = {
  getAllPlacements: async () => {
    const response = await api.get('/placements');
    return response.data;
  },
  getPlacementStats: async () => {
    const response = await api.get('/placements/stats');
    return response.data;
  },
};

// Notification API calls (use shared axios instance so token is added automatically)
export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(`/api/notifications/${notificationId}/read`, {});
  return response.data;
};

export const sendNotification = async (notificationData) => {
  const response = await api.post('/api/notifications', notificationData);
  return response.data;
};

export default api;