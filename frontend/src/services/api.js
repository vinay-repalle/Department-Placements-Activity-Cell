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
  // OTP-related functions
  sendOTP: async (email, fullName) => {
    try {
      const response = await api.post('/api/otp/send', { email, fullName });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },
  verifyOTP: async (email, otp, userData) => {
    try {
      const response = await api.post('/api/otp/verify', { email, otp, userData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify OTP' };
    }
  },
  resendOTP: async (email, fullName) => {
    try {
      const response = await api.post('/api/otp/resend', { email, fullName });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resend OTP' };
    }
  },
  // Password reset OTP functions
  sendPasswordResetOTP: async (email) => {
    try {
      const response = await api.post('/api/otp/password-reset/send', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send password reset OTP' };
    }
  },
  verifyPasswordResetOTP: async (email, otp, newPassword) => {
    try {
      const response = await api.post('/api/otp/password-reset/verify', { email, otp, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify password reset OTP' };
    }
  },
  resendPasswordResetOTP: async (email) => {
    try {
      const response = await api.post('/api/otp/password-reset/resend', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resend password reset OTP' };
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
  },
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
    // Support both response.data.data.pendingRequests and response.data.pendingRequests
    return {
      data: response.data.data?.pendingRequests || response.data.pendingRequests || []
    };
  },
  sendSessionStatusEmail: async (sessionId, status, reason = '') => {
    const response = await api.post(`/api/sessions/${sessionId}/notify`, { status, reason });
    return response.data;
  },
  getUserSessions: async (userId) => {
    const response = await api.get(`/api/sessions/user/${userId}`);
    return response.data;
  },
  approveSessionRequest: async (id, { venue, date, time }) => {
    const response = await api.patch(`/api/sessions/requests/${id}/approve`, { venue, date, time });
    return response.data;
  },
  rejectSessionRequest: async (id) => {
    const response = await api.patch(`/api/sessions/requests/${id}/reject`);
    return response.data;
  },
  getAllSessionRequests: async () => {
    const response = await api.get('/api/sessions/requests');
    return { data: response.data.data?.requests || [] };
  },
  updateSessionRequestStatus: async (id, status) => {
    const response = await api.patch(`/api/sessions/requests/${id}/status`, { status });
    return response.data;
  },
  // New attendance and feedback endpoints
  submitAttendanceResponse: async (sessionId, willAttend) => {
    const response = await api.post(`/api/sessions/${sessionId}/attendance`, { willAttend });
    return response.data;
  },
  getStudentAttendance: async (sessionId) => {
    const response = await api.get(`/api/sessions/${sessionId}/student-attendance`);
    return response.data;
  },
  submitFeedback: async (sessionId, feedbackText, feedbackRating) => {
    const response = await api.post(`/api/sessions/${sessionId}/feedback`, { feedbackText, feedbackRating });
    return response.data;
  },
  getAttendanceStats: async (sessionId) => {
    const response = await api.get(`/api/sessions/${sessionId}/attendance-stats`);
    return response.data;
  },
  getAttendanceReport: async (sessionId) => {
    const response = await api.get(`/api/sessions/${sessionId}/attendance-report`, {
      responseType: 'blob'
    });
    return response.data;
  },
  uploadFeedbackLink: async (sessionId, feedbackFormLink) => {
    const response = await api.patch(`/api/sessions/${sessionId}/feedback-link`, { feedbackFormLink });
    return response.data;
  },
  // Debug function to check session department information
  debugSessions: async () => {
    const response = await api.get('/api/sessions/debug/sessions');
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
    const response = await api.get('/api/placements');
    return response.data;
  },
  getPlacementStats: async () => {
    const response = await api.get('/api/placements/stats');
    return response.data;
  },
  updatePlacementStatus: async (id, data) => {
    // data can include status and approvalTag
    const response = await api.put(`/api/placements/${id}`, data);
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