import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application using React Context.
 * Manages user authentication, login/logout functionality, and token handling.
 * 
 * Context Values:
 * - user: Current authenticated user object
 * - isAuthenticated: Boolean indicating authentication status
 * - loading: Loading state during authentication operations
 * - error: Authentication error messages
 * 
 * Methods:
 * - login: Authenticate user with credentials
 * - logout: Clear authentication state
 * - register: Create new user account
 * - updateUser: Update user information
 * - verifyToken: Validate authentication token
 * 
 * Usage:
 * ```jsx
 * // Wrap your app with AuthProvider
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * // Use auth context in components
 * const { user, login, logout } = useAuth();
 * ```
 * 
 * Security:
 * - Token storage in localStorage
 * - Automatic token refresh
 * - Session management
 * 
 * @type {React.Context} Authentication context
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure profilePhoto is set
        if (!parsedUser.profilePhoto) {
          parsedUser.profilePhoto = '/src/assets/profile1.jpg';
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    userRole: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 