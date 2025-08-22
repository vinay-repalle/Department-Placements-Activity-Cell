 
  // Not used in the project Because of the statistics page is already created

import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const AdminStatistics = () => {
  // State to track animated values
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    alumni: 0,
    faculty: 0,
    sessions: {
      total: 0,
      previous: 0,
      ongoing: 0,
      upcoming: 0
    },
    branchWise: {}
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data for statistics
  const stats = {
    users: {
      students: 1500,
      alumni: 800,
      faculty: 100,
      // Branch-wise student distribution with year-wise breakdown
      branchWise: {
        CSE: {
          total: 400,
          yearWise: {
            'E4-regular': 60,
            'E4-intern': 40,
            E3: 120,
            E2: 100,
            E1: 80
          }
        },
        ECE: {
          total: 300,
          yearWise: {
            'E4-regular': 50,
            'E4-intern': 30,
            E3: 90,
            E2: 70,
            E1: 60
          }
        },
        EEE: {
          total: 250,
          yearWise: {
            'E4-regular': 40,
            'E4-intern': 30,
            E3: 80,
            E2: 60,
            E1: 40
          }
        },
        CIVIL: {
          total: 200,
          yearWise: {
            'E4-regular': 30,
            'E4-intern': 20,
            E3: 60,
            E2: 50,
            E1: 40
          }
        },
        MECH: {
          total: 200,
          yearWise: {
            'E4-regular': 30,
            'E4-intern': 20,
            E3: 60,
            E2: 50,
            E1: 40
          }
        },
        CHEM: {
          total: 100,
          yearWise: {
            'E4-regular': 15,
            'E4-intern': 10,
            E3: 30,
            E2: 25,
            E1: 20
          }
        },
        MME: {
          total: 100,
          yearWise: {
            'E4-regular': 15,
            'E4-intern': 10,
            E3: 30,
            E2: 25,
            E1: 20
          }
        }
      }
    },
    sessions: {
      total: 45,
      previous: 20,
      ongoing: 5,
      upcoming: 20,
    },
    recentSessions: [
      {
        title: 'AI Workshop',
        date: '2024-03-25',
        department: 'CSE, ECE',
        status: 'ongoing',
        venue: 'SAC Auditorium'
      },
      {
        title: 'Career Guidance',
        date: '2024-03-20',
        department: 'All Departments',
        status: 'previous',
        venue: 'Mini SAC'
      },
      {
        title: 'Cloud Computing',
        date: '2024-04-05',
        department: 'CSE, EEE',
        status: 'upcoming',
        venue: 'Lecture Hall-1'
      },
    ],
  };

  // Animation effect for counting up numbers
  useEffect(() => {
    // Initialize branch-wise data structure
    const initialBranchWise = {};
    Object.keys(stats.users.branchWise).forEach(branch => {
      initialBranchWise[branch] = {
        total: 0,
        yearWise: {}
      };
      
      // Initialize year-wise counts
      Object.keys(stats.users.branchWise[branch].yearWise).forEach(year => {
        initialBranchWise[branch].yearWise[year] = 0;
      });
    });
    
    setAnimatedStats({
      students: 0,
      alumni: 0,
      faculty: 0,
      sessions: {
        total: 0,
        previous: 0,
        ongoing: 0,
        upcoming: 0
      },
      branchWise: initialBranchWise
    });

    // Animation duration in milliseconds
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    // Calculate step size for each value
    const studentStep = stats.users.students / steps;
    const alumniStep = stats.users.alumni / steps;
    const facultyStep = stats.users.faculty / steps;
    const sessionTotalStep = stats.sessions.total / steps;
    const sessionPreviousStep = stats.sessions.previous / steps;
    const sessionOngoingStep = stats.sessions.ongoing / steps;
    const sessionUpcomingStep = stats.sessions.upcoming / steps;
    
    // Calculate step sizes for branch-wise data
    const branchSteps = {};
    Object.keys(stats.users.branchWise).forEach(branch => {
      branchSteps[branch] = {
        total: stats.users.branchWise[branch].total / steps,
        yearWise: {}
      };
      
      Object.keys(stats.users.branchWise[branch].yearWise).forEach(year => {
        branchSteps[branch].yearWise[year] = stats.users.branchWise[branch].yearWise[year] / steps;
      });
    });
    
    let currentStep = 0;
    
    const animationInterval = setInterval(() => {
      currentStep++;
      
      if (currentStep >= steps) {
        // Final step - set exact values
        setAnimatedStats({
          students: stats.users.students,
          alumni: stats.users.alumni,
          faculty: stats.users.faculty,
          sessions: {
            total: stats.sessions.total,
            previous: stats.sessions.previous,
            ongoing: stats.sessions.ongoing,
            upcoming: stats.sessions.upcoming
          },
          branchWise: stats.users.branchWise
        });
        
        clearInterval(animationInterval);
        return;
      }
      
      // Update animated values
      setAnimatedStats(prev => {
        const newBranchWise = { ...prev.branchWise };
        
        // Update branch-wise data
        Object.keys(stats.users.branchWise).forEach(branch => {
          newBranchWise[branch] = {
            total: Math.round(branchSteps[branch].total * currentStep),
            yearWise: { ...prev.branchWise[branch].yearWise }
          };
          
          // Update year-wise data
          Object.keys(stats.users.branchWise[branch].yearWise).forEach(year => {
            newBranchWise[branch].yearWise[year] = Math.round(branchSteps[branch].yearWise[year] * currentStep);
          });
        });
        
        return {
          students: Math.round(studentStep * currentStep),
          alumni: Math.round(alumniStep * currentStep),
          faculty: Math.round(facultyStep * currentStep),
          sessions: {
            total: Math.round(sessionTotalStep * currentStep),
            previous: Math.round(sessionPreviousStep * currentStep),
            ongoing: Math.round(sessionOngoingStep * currentStep),
            upcoming: Math.round(sessionUpcomingStep * currentStep)
          },
          branchWise: newBranchWise
        };
      });
    }, interval);
    
    return () => clearInterval(animationInterval);
  }, []);

  // Helper function to group years into pairs
  const groupYearsIntoPairs = (yearWise) => {
    const entries = Object.entries(yearWise);
    const pairs = [];
    
    for (let i = 0; i < entries.length; i += 2) {
      pairs.push(entries.slice(i, i + 2));
    }
    
    return pairs;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <hr />
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Statistics</h1>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600">{animatedStats.students}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Alumni</h3>
            <p className="text-3xl font-bold text-green-600">{animatedStats.alumni}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Faculty</h3>
            <p className="text-3xl font-bold text-purple-600">{animatedStats.faculty}</p>
          </div>
        </div>

        {/* Branch-wise Student Distribution with Year-wise Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Branch-wise Student Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats.users.branchWise).map(([branch, data]) => (
              <div key={branch} className="bg-gray-50 rounded-lg p-4">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">{branch}</h3>
                  <p className="text-2xl font-bold text-blue-600">{animatedStats.branchWise[branch]?.total || 0}</p>
                  <p className="text-sm text-gray-500">
                    {((animatedStats.branchWise[branch]?.total || 0) / stats.users.students * 100).toFixed(1)}% of total
                  </p>
                </div>
                <div className="space-y-3">
                  {groupYearsIntoPairs(data.yearWise).map((pair, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      {pair.map(([year, count]) => (
                        <div key={year} className="flex justify-between items-center bg-white p-2 rounded">
                          <span className="text-sm font-medium text-gray-600">{year}</span>
                          <span className="text-sm text-gray-500">{animatedStats.branchWise[branch]?.yearWise[year] || 0}</span>
                        </div>
                      ))}
                      {pair.length === 1 && <div className="bg-transparent"></div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Sessions</h3>
            <p className="text-3xl font-bold text-indigo-600">{animatedStats.sessions.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Previous Sessions</h3>
            <p className="text-3xl font-bold text-gray-600">{animatedStats.sessions.previous}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ongoing Sessions</h3>
            <p className="text-3xl font-bold text-yellow-600">{animatedStats.sessions.ongoing}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Sessions</h3>
            <p className="text-3xl font-bold text-green-600">{animatedStats.sessions.upcoming}</p>
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sessions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentSessions.map((session, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${session.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                          session.status === 'previous' ? 'bg-gray-100 text-gray-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminStatistics; 