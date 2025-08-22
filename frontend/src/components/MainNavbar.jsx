/**
 * MainNavbar Component
 * 
 * The primary navigation component for authenticated users, providing access to
 * various sections of the application based on user role.
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Dynamic navigation links based on user role
 * - Notification integration
 * - Profile dropdown menu
 * - Active link highlighting
 * - Logout functionality
 * 
 * Components Used:
 * - React Hooks: useState, useEffect
 * - React Router: For navigation and active link detection
 * - NotificationIcon: For displaying notifications
 * - ProfileIcon: For user profile menu
 * - AuthContext: For user role and authentication state
 * 
 * Navigation Structure:
 * - Home
 * - Sessions (conditional based on role)
 * - Statistics (admin only)
 * - Profile
 * - Notifications
 * 
 * @type {dynamic} - Adapts to user role and authentication state
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationIcon from './NotificationIcon'; // Import NotificationIcon
import ProfileIcon from './ProfileIcon'; // Import ProfileIcon
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

const MainNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref for mobile menu
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();

  const { getHomePath, canAccessRoute, requiresAuth, isAuthenticated } = useNavigation();
  const { user } = useAuth();
  const location = useLocation();

  // Function to close the mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    if (requiresAuth(path) && !isAuthenticated) {
      navigate('/signin', { state: { from: path } });
    } else {
      navigate(path);
    }
    closeMobileMenu();
  };

  // Determine portal label based on user role
  const getPortalLabel = () => {
    if (user?.role === 'admin') return 'Admin Portal';
    if (user?.role === 'faculty') return 'Faculty Portal';
    if (user?.role === 'student') return 'Student Portal';
    if (user?.role === 'alumni') return 'Alumni Portal';
    return 'Alumni Portal';
  };

  // Navigation items with permission checks
  const navigationItems = [
    { path: getHomePath(), label: 'Home', alwaysShow: true },
    { path: '/departments', label: 'Departments', show: canAccessRoute('/departments') },
    { path: '/sessions', label: 'Sessions', show: true }, // Always show Sessions, but handle auth in click
    { path: '/placements', label: 'Placements', show: canAccessRoute('/placements') && user?.role !== 'alumni' }, // Hide placements for alumni
    { path: '/aboutus', label: 'About Us', show: canAccessRoute('/aboutus') }
  ];
  // Add admin-only links
  if (user?.role === 'admin') {
    navigationItems.push(
      { path: '/admin/session-requests', label: 'Session Requests', show: true },
      { path: '/admin/noc-submissions', label: 'NOC Submissions', show: true }
    );
  }

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-md rounded-b-xl">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-2">
        {/* Left: Logo and Portal Label */}
        <div className="flex items-center space-x-2 select-none flex-shrink-0">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-700 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">RGUKT</span>
          <span className="ml-1 text-lg font-semibold text-cyan-900 tracking-wide">{getPortalLabel()}</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:justify-center md:flex-1 ml-12">
          <div className="flex space-x-8">
            {navigationItems.map((item, index) => {
              // Determine if this link is active
              const isActive = location.pathname === item.path;
              return (
                (item.alwaysShow || item.show) && (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative text-cyan-800 font-medium px-3 py-1.5 rounded-lg transition-colors duration-200
                    hover:bg-cyan-100 hover:text-cyan-900 focus:outline-none
                    ${isActive ? 'text-blue-700' : ''}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Animated underline for active link */}
                  <span
                    className={`absolute left-2 right-2 -bottom-1 h-0.5 rounded bg-blue-600 transition-all duration-300
                      ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
                    `}
                    style={{ transformOrigin: 'center' }}
                  />
                </button>
                )
              );
            })}
          </div>
        </div>

        {/* Notification and Profile Icons */}
        <div className="flex items-center space-x-3">
          <NotificationIcon />
          <div className="rounded-full border-2 border-cyan-300 shadow-md hover:shadow-lg transition-shadow duration-200 hover:border-blue-500">
            <ProfileIcon />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="text-cyan-800 hover:text-cyan-600 focus:outline-none p-2 rounded-lg border border-cyan-100 bg-white shadow-sm"
            aria-label="toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-40 bg-black/40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />
      <div
        className={`fixed top-0 right-0 w-64 h-full z-50 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        ref={mobileMenuRef}
      >
        <div className="flex flex-col h-full p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            {/* Mobile Menu Brand Area */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-700 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">RGUKT</span>
              <span className="ml-1 text-lg font-semibold text-cyan-900 tracking-wide">Alumni Portal</span>
            </div>
            <button onClick={closeMobileMenu} className="text-cyan-800 hover:text-cyan-600 focus:outline-none p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-2">
            {navigationItems.map((item, index) => (
              (item.alwaysShow || item.show) && (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className="text-cyan-800 font-medium px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-cyan-100 hover:text-cyan-900 text-left"
                >
                  {item.label}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;