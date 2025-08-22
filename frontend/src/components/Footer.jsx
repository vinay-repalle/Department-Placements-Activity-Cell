/**
 * Footer Component
 * 
 * A reusable footer component that appears at the bottom of every page,
 * providing essential links and information about the application.
 * 
 * Features:
 * - Responsive design
 * - Social media links
 * - Quick navigation links
 * - Contact information
 * - Copyright notice
 * - Newsletter subscription (if enabled)
 * 
 * Components Used:
 * - React Icons: For social media icons
 * - React Router: For internal navigation
 * - Tailwind CSS: For styling
 * 
 * Sections:
 * - About Us
 * - Quick Links
 * - Social Media
 * - Contact Info
 * - Copyright
 * 
 * Layout:
 * - Desktop: 4-column grid
 * - Tablet: 2-column grid
 * - Mobile: Single column
 * 
 * @type {static} - Content remains consistent across pages
 */

import React from 'react';

const Footer = () => {
  return (
    <footer className="left-0 bottom-0 w-full z-50 bg-white text-black py-3 px-4 rounded-t-2xl shadow-lg border-t border-gray-200">
      <div className="flex flex-col items-center justify-center">
        <span className="font-semibold text-lg tracking-wide">RGUKT Alumni Portal</span>
        <span className="text-xs mt-1">&copy; {new Date().getFullYear()} Rajiv Gandhi University of Knowledge Technologies</span>
            </div>
        </footer>
  );
};

export default Footer;