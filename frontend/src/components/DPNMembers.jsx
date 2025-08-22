import React from 'react';

const DPNMembers = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 capitalize lg:text-4xl mb-2">
          Our <span className="text-blue-600">DPN Members</span>
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-600 text-lg">
          Department placements Nomies are the persons in each department for the placements of students.
        </p>

        <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="relative">
                    <img
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100"
                src="https://dummyimage.com/80x80"
                alt="Arthur Melo"
              />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800 capitalize md:text-2xl">
                  Dr. R.Chinthayya Naidu<sub className='text-sm text-gray-500'>M.Tech,Ph.D</sub>
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Designation:</span> Faculty Incharge Placement Cell
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Department:</span>Chemical Engineering
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Other Roles:</span>Assistant Professor(C) 
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 006.218 6.218l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Contact:</span> +91 9876543210
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="relative">
                    <img
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-purple-100"
                src="https://dummyimage.com/80x80"
                alt="Amelia Anderson"
              />
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800 capitalize md:text-2xl">
                  Kiran G
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Designation:</span> Longterm Internship & Placement
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Department:</span> CDPC
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Other Roles:</span> Placement Trainee
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 006.218 6.218l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Contact:</span> +91 9876543211
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="relative">
                    <img
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-green-100"
                src="https://dummyimage.com/80x80"
                alt="Olivia Wathan"
              />
                    <div className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800 capitalize md:text-2xl">
                  Olivia Wathan
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Designation:</span> Lead Designer
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Department:</span> Mechanical
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Other Roles:</span> Career Counselor
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 006.218 6.218l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Contact:</span> +91 9876543212
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="relative">
                    <img
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-red-100"
                src="https://dummyimage.com/80x80"
                alt="John Doe"
              />
                    <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold text-gray-800 capitalize md:text-2xl">
                  John Doe
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Designation:</span> Full Stack Developer
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Department:</span> Civil
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Other Roles:</span> Placement Coordinator
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 006.218 6.218l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </span>
                      <p className="text-gray-700">
                        <span className="font-semibold">Contact:</span> +91 9876543213
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Developed By Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-10 mt-8 rounded-2xl">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Developed By</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
            {/* Assisted by - Lakshmi Kanth */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 flex flex-col items-center w-72 hover:shadow-2xl transition-all duration-300">
              <img src="/src/assets/profile1.jpg" alt="Lakshmi Kanth" className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 mb-3" />
              <h3 className="text-xl font-bold text-blue-900">Mr.K.Lakshmi Kanth<sub className='text-[10px] text-gray-500'>M.Tech</sub></h3>
              <p className="text-blue-700 font-medium">Assisted by</p>
            </div>
            {/* Lead Developer - Repalle.Vinay */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6 flex flex-col items-center w-72 hover:shadow-2xl transition-all duration-300">
              <img src="/src/assets/vinay.JPG" alt="Repalle.Vinay" className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 mb-3" />
              <h3 className="text-xl font-bold text-blue-900">Repalle.Vinay</h3>
              <p className="text-blue-700 font-medium">Lead Developer</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <span className="font-semibold text-blue-800">Team Members: </span>
            <span className="text-gray-700">CH.Mahesh, D.Prasad, MD.Nouheera, T.Chowsika</span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DPNMembers;