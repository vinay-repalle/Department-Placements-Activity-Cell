import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cardData = [
  {
    title: 'Ongoing Placement Drives',
    img: 'src/assets/ongoingDrives.jpg',
    alt: 'Ongoing Placement Drives',
    link: '/placements#ongoing-drives',
    subtitle: 'Placement drives currently happening',
    description: 'Explore ongoing placement opportunities and apply for positions that are currently open for applications.',
    accent: 'bg-gradient-to-r from-green-500 to-emerald-500',
    btn: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Upcoming Placement Drives',
    img: 'src/assets/upcomingDrives.jpg',
    alt: 'Upcoming Placement Drives',
    link: '/placements#upcoming-drives',
    subtitle: 'Future placement opportunities',
    description: 'Stay updated with upcoming placement drives and prepare for future career opportunities.',
    accent: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    btn: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Previous Placement Drives',
    img: 'src/assets/previousDrives.jpg',
    alt: 'Previous Placement Drives',
    link: '/placements#previous-drives',
    subtitle: 'Archive of past placement drives',
    description: 'Browse through completed placement drives to understand past opportunities and company requirements.',
    accent: 'bg-gradient-to-r from-gray-500 to-slate-500',
    btn: 'from-gray-500 to-slate-500',
  },
];

const PlacementDriveCards = () => {
  const { user } = useAuth();
  
  // Only show for admin, student, and faculty, NOT for alumni
  const allowedRoles = ['admin', 'student', 'faculty'];
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <div className="mx-auto p-2 mt-12 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cardData.map((card, idx) => (
          <div
            key={card.title}
            className="relative flex flex-col items-center bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl pt-16 pb-8 px-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:ring-2 hover:ring-blue-200 group"
            style={{ minHeight: '370px' }}
          >
            {/* Circular Image - Overlapping Card */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-lg border-4 border-white overflow-hidden flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Title with Accent Underline */}
            <h3 className="mt-6 text-2xl font-extrabold text-gray-900 text-center tracking-tight">
              {card.title}
            </h3>
            <div className={`mx-auto mt-2 mb-3 w-16 h-1 rounded-full ${card.accent} opacity-80`} />
            {/* Subtitle/Description */}
            <p className="text-gray-700 text-center text-base mb-2 min-h-[32px]">
              {card.subtitle}
            </p>
            {/* New Description */}
            <p className="text-sm text-gray-600 text-center mb-6 min-h-[40px]">
              {card.description}
            </p>
            {/* Button */}
            <Link
              className={`mt-auto px-7 py-2 rounded-full bg-gradient-to-r ${card.btn} text-lg font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200`}
              to={card.link}
            >
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementDriveCards; 