import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

const HomeRedirector = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes = {
        admin: '/admin',
        student: '/student',
        alumni: '/alumni',
        faculty: '/faculty'
      };
      navigate(dashboardRoutes[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  // If not authenticated, show the landing page
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  // Optionally, show nothing or a loader while redirecting
  return null;
};

export default HomeRedirector; 