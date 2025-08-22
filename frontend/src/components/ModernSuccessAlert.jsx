import React, { useEffect } from 'react';

const ModernSuccessAlert = ({ message, onClose }) => {
  // Auto-close the alert after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // 4 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [onClose]);

  return (
    <>
      {/* Blurred Background */}
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40"></div>

      {/* Alert Container */}
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <div className="flex items-center p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg text-white font-poppins transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          {/* Icon */}
          <div className="bg-white bg-opacity-20 p-3 rounded-full flex items-center justify-center mr-4 shadow-md">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-lg font-bold uppercase tracking-wider">Success</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="ml-4 text-white text-xl font-bold opacity-80 hover:opacity-100 transition-opacity"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default ModernSuccessAlert;