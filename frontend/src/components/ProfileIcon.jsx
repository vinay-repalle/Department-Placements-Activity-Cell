import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileIcon = () => {
  const { user } = useAuth();

  // Get the profile link based on user role
  const getProfileLink = () => {
    const profileLinks = {
      admin: '/adminprofile',
      student: '/studentprofile',
      alumni: '/alumniprofile',
      faculty: '/facultyprofile'
    };
    return profileLinks[user?.role] || '#';
  };

  // Use uploaded profile image if available, otherwise fallback
  const profileImg = user?.profilePhoto || user?.profileImage;
  const emailLetter = user?.email ? user.email[0].toUpperCase() : '?';

  return (
    <Link
      to={getProfileLink()}
      className="p-0 rounded-full focus:outline-none transition-shadow duration-200 group hover:shadow-lg"
      style={{ width: 40, height: 40 }}
      aria-label="Go to profile"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#38bdf8"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z"
          />
        </svg>
      </div>
    </Link>
  );
};

export default ProfileIcon;