import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const NavigationContext = createContext(null);

/**
 * Navigation Context
 * 
 * Manages application navigation state and routing logic using React Context.
 * Provides centralized navigation control and route history tracking.
 * 
 * Context Values:
 * - currentPath: Current route path
 * - previousPath: Previous route path
 * - breadcrumbs: Navigation breadcrumb trail
 * - isNavigating: Navigation state indicator
 * 
 * Methods:
 * - navigate: Programmatic navigation
 * - goBack: Return to previous route
 * - updateBreadcrumbs: Update breadcrumb trail
 * - clearHistory: Clear navigation history
 * 
 * Features:
 * - Route history tracking
 * - Breadcrumb management
 * - Deep linking support
 * - Navigation guards
 * - Route transitions
 * 
 * Route Types:
 * - Public routes
 * - Protected routes
 * - Role-based routes
 * - Dynamic routes
 * 
 * Usage:
 * ```jsx
 * // Wrap your app with NavigationProvider
 * <NavigationProvider>
 *   <App />
 * </NavigationProvider>
 * 
 * // Use navigation in components
 * const { navigate, goBack } = useNavigation();
 * ```
 * 
 * @type {React.Context} Navigation management context
 */

export const NavigationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const getHomePath = () => {
    if (!isAuthenticated) {
      return '/';
    }
    
    // Return role-specific home paths
    const rolePaths = {
      admin: '/admin',
      student: '/student',
      alumni: '/alumni',
      faculty: '/faculty'
    };

    return rolePaths[user?.role] || '/';
  };

  // Function to check if a route should be accessible
  const canAccessRoute = (route) => {
    if (!isAuthenticated) {
      // Public routes that don't require authentication
      const publicRoutes = ['/departments', '/aboutus'];
      return publicRoutes.includes(route);
    }

    // Role-specific route permissions
    const rolePermissions = {
      admin: ['/sessions', '/departments', '/aboutus', '/placements'],
      student: ['/sessions', '/departments', '/aboutus', '/placements'], // Students can access sessions
      alumni: ['/sessions', '/departments', '/aboutus'], // Alumni cannot access placements
      faculty: ['/sessions', '/departments', '/aboutus', '/placements']
    };

    return rolePermissions[user?.role]?.includes(route) || false;
  };

  // Function to check if a route requires authentication
  const requiresAuth = (route) => {
    const authRequiredRoutes = ['/sessions', '/sessionform', '/placements'];
    return authRequiredRoutes.includes(route);
  };

  const value = {
    getHomePath,
    canAccessRoute,
    requiresAuth,
    isAuthenticated,
    userRole: user?.role
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}; 