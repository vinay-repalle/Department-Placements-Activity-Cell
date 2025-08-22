import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import ProfileIcon from './ProfileIcon';

const LandingPageNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignUpDropdownOpen, setIsSignUpDropdownOpen] = useState(false);
  const [isMobileMenuClosedByToggle, setIsMobileMenuClosedByToggle] = useState(false);

  // Refs for dropdown containers
  const mobileMenuRef = useRef(null);
  const signUpDropdownRef = useRef(null);

  const { user, isAuthenticated } = useAuth();
  const { requiresAuth } = useNavigation();
  const navigate = useNavigate();

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setIsMobileMenuOpen(false);
    setIsSignUpDropdownOpen(false);
  };

  // Handle navigation with authentication check
  const handleNavigation = (path) => {
    if (requiresAuth(path) && !isAuthenticated) {
      navigate('/signin', { state: { from: path } });
    } else {
      navigate(path);
    }
    closeAllDropdowns();
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) &&
        (signUpDropdownRef.current && !signUpDropdownRef.current.contains(event.target))
      ) {
        if (!isMobileMenuClosedByToggle) {
          closeAllDropdowns();
        }
      }
    };

    // Handle scroll events
    const handleScroll = () => {
      if (!isMobileMenuClosedByToggle) {
        closeAllDropdowns();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('scroll', handleScroll);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuClosedByToggle]); // Track state changes

  // Function to handle opening a dropdown and closing others
  const openDropdown = (dropdownType) => {
    closeAllDropdowns(); // Close all dropdowns first
    switch (dropdownType) {
      case 'mobile':
        setIsMobileMenuOpen(true);
        setIsMobileMenuClosedByToggle(false); // Reset the flag when opening
        break;
      case 'signup':
        setIsSignUpDropdownOpen(true);
        break;
      default:
        break;
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosedByToggle(true); // Ensure menu stays closed
    } else {
      openDropdown('mobile');
    }
  };

  return (
    <div>
      {/* Main Navbar */}
      <header className="relative bg-cyan-700 shadow mb-[1px] mt-0.5">
        <div className="flex items-center justify-between mx-auto max-w-7xl px-2 py-1.5">
          {/* Left Side: Mobile Menu Button (Visible on Small and Medium Screens) */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="text-white cursor-pointer hover:text-primary focus:outline-none"
              aria-label="toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Center: Navigation Links (Visible on Large Screens) */}
          <div className="hidden md:flex md:justify-center md:flex-1">
            <div className="flex space-x-19">
              <Link to="/" className="text-white hover:text-black cursor-pointer">Home</Link>
              <Link to="/departments" className="text-white hover:text-black cursor-pointer">Departments</Link>
              <button 
                onClick={() => handleNavigation('/sessions')} 
                className="text-white hover:text-black cursor-pointer"
              >
                Sessions
              </button>
              <button 
                onClick={() => handleNavigation('/placements')} 
                className="text-white hover:text-black cursor-pointer"
              >
                Placements
              </button>
              {/* <Link to="alumni" className="text-white hover:text-black cursor-pointer">Alumni</Link> */}
              <Link to="/aboutus" className="text-white hover:text-black cursor-pointer">About Us</Link>
            </div>
          </div>

          {/* Right Side: Sign In Button and Profile Icon */}
          <div className="flex items-center justify-end space-x-2 relative" ref={signUpDropdownRef}>
            <Link
              to="/signin"
              className="items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in text-sm py-1.5 px-3 shadow-sm hover:shadow bg-black hover:bg-gray-700 text-white rounded-lg transition cursor-pointer"
            >
              Sign In
            </Link>
            {isAuthenticated && <ProfileIcon />}
          </div>
        </div>

        {/* Mobile Menu (Visible on Small and Medium Screens) */}
        {!isMobileMenuClosedByToggle && (
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-gray-800  md:hidden ${
              isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
            }`}
            ref={mobileMenuRef}
          >
            <div className="flex flex-col space-y-2 ">
              <Link to="/" className="text-white hover:text-primary hover:text-blue-600 cursor-pointer">Home</Link>
              <Link to="/departments" className="text-white hover:text-primary hover:text-blue-600 cursor-pointer">Departments</Link>
              <button 
                onClick={() => handleNavigation('/sessions')} 
                className="text-white hover:text-primary hover:text-blue-600 cursor-pointer text-left"
              >
                Sessions
              </button>
              <button 
                onClick={() => handleNavigation('/placements')} 
                className="text-white hover:text-primary hover:text-blue-600 cursor-pointer text-left"
              >
                Placements
              </button>
              {/* <Link to="alumni" className="text-white hover:text-primary hover:text-blue-600 cursor-pointer">Alumni</Link> */}
              <Link to="/aboutus" className="text-white hover:text-primary hover:text-blue-600 cursor-pointer">About Us</Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default LandingPageNavbar;
