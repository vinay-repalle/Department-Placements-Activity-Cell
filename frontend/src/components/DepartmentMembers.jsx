import React from 'react';

const departments = [
  {
    name: 'Computer Science and Engineering',
    color: 'from-blue-500 to-blue-700',
    icon: '💻',
    members: [
      {
        name: 'K.Lakshmi Kanth',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543210',
        img: 'https://dummyimage.com/80x80',
      },
      {
        name: 'D.Sri Lakshmi',
        role: 'CTO',
        otherRoles: 'Alumni Coordinator',
        contact: '+91 9876543211',
        img: 'https://dummyimage.com/84x84',
      },
      {
        name: 'S.Sampath',
        role: 'Founder',
        otherRoles: 'Career Counselor',
        contact: '+91 9876543212',
        img: 'https://dummyimage.com/88x88',
      },
    ],
  },
  {
    name: 'Electronics and Communication Engineering',
    color: 'from-green-500 to-green-700',
    icon: '📡',
    members: [
      {
        name: 'Suresh',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543213',
        img: 'https://dummyimage.com/80x80',
      },
      {
        name: 'Henry Letham',
        role: 'CTO',
        otherRoles: 'Alumni Coordinator',
        contact: '+91 9876543214',
        img: 'https://dummyimage.com/84x84',
      },
    ],
  },
  {
    name: 'Electrical and Electronics Engineering',
    color: 'from-purple-500 to-purple-700',
    icon: '⚡',
    members: [
      {
        name: 'Holden Caulfield',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543215',
        img: 'https://dummyimage.com/80x80',
      },
    ],
  },
  {
    name: 'Civil Engineering',
    color: 'from-indigo-500 to-indigo-700',
    icon: '🏗️',
    members: [
      {
        name: 'Holden Caulfield',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543216',
        img: 'https://dummyimage.com/80x80',
      },
    ],
  },
  {
    name: 'Mechanical Engineering',
    color: 'from-red-500 to-red-700',
    icon: '🛠️',
    members: [
      {
        name: 'Holden Caulfield',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543217',
        img: 'https://dummyimage.com/80x80',
      },
    ],
  },
  {
    name: 'Chemical Engineering',
    color: 'from-yellow-400 to-yellow-600',
    icon: '⚗️',
    members: [
      {
        name: 'Holden Caulfield',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543218',
        img: 'https://dummyimage.com/80x80',
      },
    ],
  },
  {
    name: 'Metallurgical and Materials Engineering',
    color: 'from-teal-500 to-teal-700',
    icon: '🔬',
    members: [
      {
        name: 'T.Siva Kumar Pruthvi Raj',
        role: 'UI Designer',
        otherRoles: 'Placement Coordinator',
        contact: '+91 9876543219',
        img: 'https://dummyimage.com/80x80',
      },
    ],
  },
];

const DepartmentMembers = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen py-10 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 drop-shadow-sm">Departments & Placement Nominees</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Meet the placement nominees and coordinators for each department. Connect with the right people for guidance, support, and placement opportunities.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, idx) => (
            <div
              key={dept.name}
              className="group bg-white rounded-2xl shadow-xl border-t-4 border-blue-200 flex flex-col transition-all duration-500 ease-out hover:scale-[1.035] hover:-translate-y-2 hover:shadow-2xl hover:border-transparent hover:ring-4 hover:ring-blue-300/30 relative overflow-hidden"
            >
              {/* Animated border shimmer on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full animate-gradient-x bg-gradient-to-r from-blue-400/30 via-blue-200/10 to-blue-400/30 rounded-2xl"></div>
              </div>
              <div
                className={`rounded-t-2xl px-6 py-4 bg-gradient-to-r ${dept.color} flex items-center gap-3 relative z-10 transition-all duration-500`}
              >
                <span className="text-2xl group-hover:animate-spin-slow group-hover:scale-125 transition-transform duration-700">{dept.icon}</span>
                <h2 className="text-xl font-bold text-white tracking-wide drop-shadow">{dept.name}</h2>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {dept.members.map((m, i) => (
                  <div
                    key={m.name + i}
                    className="flex items-center gap-4 bg-blue-50/40 rounded-xl p-3 border border-blue-100 shadow-sm transition-all duration-400 hover:scale-105 hover:shadow-lg hover:bg-blue-100/80 hover:border-blue-300"
                  >
                    <div className="relative">
                      <img
                        src={m.img}
                        alt={m.name}
                        className="w-14 h-14 rounded-full border-2 border-blue-200 shadow transition-all duration-400 group-hover:border-blue-400 group-hover:shadow-blue-200/60 hover:ring-4 hover:ring-blue-300/40"
                      />
                      {/* Pulsing border on hover */}
                      <span className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-60 animate-pulse pointer-events-none"></span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900 text-lg">{m.name}</div>
                      <div className="text-gray-600 text-sm">{m.role}</div>
                      <div className="text-gray-500 text-xs">Other Roles: {m.otherRoles}</div>
                      <div className="text-gray-500 text-xs">Contact: {m.contact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Custom keyframes for slow spin and gradient shimmer */}
      <style>{`
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 2.5s linear infinite; }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DepartmentMembers;