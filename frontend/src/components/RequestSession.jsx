
// It is just a component which displays the session requesting card.....

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const RequestSession = () => {
  return (
    <div className="mx-auto p-2 mt-12 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div
          className="relative flex flex-col items-center bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl pt-16 pb-8 px-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:ring-2 hover:ring-blue-200 group"
          style={{ minHeight: '370px' }}
        >
          {/* Circular Image - Overlapping Card */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-lg border-4 border-white overflow-hidden flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-300">
            <img
              src="src/assets/reqSession.jpg"
              alt="Request Session"
              className="w-full h-full object-cover object-center"
            />
          </div>
          {/* Title with Accent Underline */}
          <h3 className="mt-6 text-2xl font-extrabold text-gray-900 text-center tracking-tight">
            Request a Session
          </h3>
          <div className="mx-auto mt-2 mb-3 w-16 h-1 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 opacity-80" />
          {/* Subtitle */}
          <p className="text-gray-700 text-center text-base mb-2 min-h-[32px] font-semibold">
            Alumni & Faculty
          </p>
          {/* Description */}
          <p className="text-sm text-gray-600 text-center mb-6 min-h-[40px]">
            Want to share your knowledge or experience? Request to host a session for students and make an impact! Inspire, guide, and empower the next generation by leading a knowledge-sharing event.
          </p>
          {/* Button */}
          <Link
            to="/sessionform"
            className="mt-auto px-7 py-2 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 text-lg font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Request Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RequestSession;