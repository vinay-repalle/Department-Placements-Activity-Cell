import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Statistics Page Component
 * 
 * Comprehensive dashboard displaying various statistics and analytics
 * about users, sessions, and system performance.
 * 
 * Features:
 * - Real-time data visualization
 * - Interactive charts and graphs
 * - Filterable data tables
 * - Export functionality
 * - Period-based analysis
 * 
 * Data Categories:
 * 1. User Statistics
 *    - Total users by role
 *    - Active users
 *    - Registration trends
 *    - Department distribution
 * 
 * 2. Session Statistics
 *    - Total sessions
 *    - Success rate
 *    - Popular time slots
 *    - Participation metrics
 * 
 * 3. System Performance
 *    - Response times
 *    - Error rates
 *    - Resource usage
 *    - API health
 * 
 * 4. Academic Metrics
 *    - Department performance
 *    - Student engagement
 *    - Faculty contribution
 *    - Alumni participation
 * 
 * Components:
 * - Charts: Line, Bar, Pie charts
 * - Data Tables: Sortable, filterable
 * - Export Tools: CSV, Excel export
 * - Filter Controls: Date, category filters
 * 
 * Props:
 * @param {string} timeRange - Time period for data
 * @param {Array} metrics - Metrics to display
 * @param {Function} onExport - Export handler
 * @param {Object} filters - Active filters
 * 
 * Dependencies:
 * - Chart.js for visualizations
 * - API services for data
 * - Excel service for exports
 * - Date utilities
 * 
 * @component Statistics
 * @example
 * ```jsx
 * <Statistics
 *   timeRange="month"
 *   metrics={['users', 'sessions']}
 *   onExport={handleExport}
 *   filters={{ department: 'CSE' }}
 * />
 * ```
 */

// Get the base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const Statistics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: {
      total: 0,
      byRole: {
        students: 0,
        alumni: 0,
        faculty: 0,
        admin: 0
      },
      studentsByBranch: {},
      studentsByYear: {
        E1: { CSE: 0, ECE: 0, EEE: 0, MECH: 0, CIVIL: 0, CHEM: 0, MME: 0 },
        E2: { CSE: 0, ECE: 0, EEE: 0, MECH: 0, CIVIL: 0, CHEM: 0, MME: 0 },
        E3: { CSE: 0, ECE: 0, EEE: 0, MECH: 0, CIVIL: 0, CHEM: 0, MME: 0 },
        E4: { CSE: 0, ECE: 0, EEE: 0, MECH: 0, CIVIL: 0, CHEM: 0, MME: 0 }
      },
      alumniByYear: {},
      alumniByBranch: {}
    },
    sessions: {
      total: 0,
      upcoming: 0,
      ongoing: 0,
      completed: 0
    },
    placements: {
      total: 0,
      accepted: 0,
      rejected: 0,
      pending: 0,
      submissions: []
    },
    rejectedSignups: [],
    failedSignups: []
  });

  // New state for student filters and data
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for alumni data
  const [alumniData, setAlumniData] = useState([]);
  const [selectedAlumniBranch, setSelectedAlumniBranch] = useState('ALL');
  const [selectedAlumniYear, setSelectedAlumniYear] = useState('ALL');

  const branches = ['ALL', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'CHEM', 'MME'];
  const years = ['ALL', 'E1', 'E2', 'E3', 'E4'];

  // Fetch student data based on filters
  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/statistics/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          branch: selectedBranch,
          year: selectedYear
        }
      });

      setStudentData(response.data.data.students);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error.response?.data?.message || 'Failed to fetch student data');
    }
  };

  // Fetch alumni data based on filters
  const fetchAlumniData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/statistics/alumni`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          branch: selectedAlumniBranch,
          year: selectedAlumniYear
        }
      });

      setAlumniData(response.data.data.alumni);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      setError(error.response?.data?.message || 'Failed to fetch alumni data');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && typeof response.data === 'object') {
          setStats(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to fetch statistics'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    fetchStudentData();
    fetchAlumniData();
  }, [user, navigate]);

  // Fetch student data when filters change
  useEffect(() => {
    fetchStudentData();
  }, [selectedBranch, selectedYear]);

  // Fetch alumni data when filters change
  useEffect(() => {
    fetchAlumniData();
  }, [selectedAlumniBranch, selectedAlumniYear]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Statistics Dashboard</h1>
          {loading && (
            <div className="text-blue-600">Loading...</div>
          )}
          {error && (
            <div className="text-red-600 bg-red-50 px-4 py-2 rounded-md">{error}</div>
          )}
        </div>

        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Statistics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.users?.total || '0'}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Students</h3>
              <p className="text-3xl font-bold text-green-600">{stats.users?.byRole?.students || '0'}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Alumni</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.users?.byRole?.alumni || '0'}</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Faculty</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.users?.byRole?.faculty || '0'}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Admins</h3>
              <p className="text-3xl font-bold text-red-600">{stats.users?.byRole?.admin || '0'}</p>
            </div>
          </div>
        </div>

        {/* Student Year-wise Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Year-wise Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['E1', 'E2', 'E3', 'E4'].map((year) => (
              <div key={year} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{year}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MME'].map((branch) => (
                    <div key={`${year}-${branch}`} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">{branch}</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.users?.studentsByYear?.[year]?.[branch] || '0'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Data Section with existing table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Data</h2>
          
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentData.length > 0 ? (
                  studentData.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.branch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alumni Year-wise Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Alumni Year-wise Statistics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => 2014 + i).map((year) => (
              <div key={year} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Batch {year}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MME'].map((branch) => (
                    <div key={`${year}-${branch}`} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700">{branch}</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {stats.users?.alumniByYear?.[year]?.[branch] || '0'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Alumni Data</h2>
          
          {/* Alumni Filters */}
          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={selectedAlumniBranch}
                onChange={(e) => setSelectedAlumniBranch(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedAlumniYear}
                onChange={(e) => setSelectedAlumniYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">All Years</option>
                {Array.from({ length: new Date().getFullYear() - 2013 }, (_, i) => (
                  <option key={2014 + i} value={2014 + i}>{2014 + i}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Alumni Table */}
          <div className="overflow-x-auto bg-gray-50 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Graduation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alumniData.length > 0 ? (
                  alumniData.map((alumni) => (
                    <tr key={alumni.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.graduationYear}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alumni.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No alumni found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Session Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Sessions</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.sessions?.total || '0'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Upcoming</h3>
              <p className="text-3xl font-bold text-green-600">{stats.sessions?.upcoming || '0'}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Ongoing</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.sessions?.ongoing || '0'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-3xl font-bold text-gray-600">{stats.sessions?.completed || '0'}</p>
            </div>
          </div>
        </div>

        {/* Placement Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Placement Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Placements</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.placements?.total || '0'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Accepted</h3>
              <p className="text-3xl font-bold text-green-600">{stats.placements?.accepted || '0'}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Rejected</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.placements?.rejected || '0'}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800">Pending</h3>
              <p className="text-3xl font-bold text-red-600">{stats.placements?.pending || '0'}</p>
            </div>
          </div>

          {/* Placement Submissions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Placement Submissions</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {stats.placements?.submissions?.length > 0 ? (
                <div className="space-y-2">
                  {stats.placements.submissions.map((submission, index) => (
                    <div key={index} className="p-3 bg-white rounded shadow-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">{submission.student}</span>
                        <span className="mx-2">•</span>
                        <span>{submission.company}</span>
                        <span className="mx-2">•</span>
                        <span>{submission.position}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          submission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">No placement submissions</div>
              )}
            </div>
          </div>
        </div>

        {/* Rejected Signups */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Rejected Signups</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {stats.rejectedSignups?.length > 0 ? (
              <div className="space-y-2">
                {stats.rejectedSignups.map((signup, index) => (
                  <div key={index} className="p-3 bg-white rounded shadow-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">{signup.name}</span>
                      <span className="mx-2">•</span>
                      <span>{signup.email}</span>
                      <span className="mx-2">•</span>
                      <span className="text-red-600">{signup.reason}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{new Date(signup.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No rejected signups</div>
            )}
          </div>
        </div>

        {/* Failed Signups */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Failed Signups</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {stats.failedSignups?.length > 0 ? (
              <div className="space-y-2">
                {stats.failedSignups.map((signup, index) => (
                  <div key={index} className="p-3 bg-white rounded shadow-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">{signup.name}</span>
                      <span className="mx-2">•</span>
                      <span>{signup.email}</span>
                      <span className="mx-2">•</span>
                      <span className="text-red-600">{signup.error}</span>
                      <span className="mx-2">•</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        signup.status === 'checked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {signup.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No failed signups</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Statistics; 