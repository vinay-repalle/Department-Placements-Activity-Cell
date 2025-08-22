import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    switch (selectedRole) {
      case 'student':
        navigate('/studentsignup');
        break;
      case 'alumni':
        navigate('/alumnisignup');
        break;
      case 'faculty':
        navigate('/facultysignup');
        break;
      case 'admin':
        navigate('/adminsignup');
        break;
      default:
        alert('Please select a valid role');
    }
  };

  return (
    <section className="bg-gradient-to-r from-purple-500 to-indigo-500 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Select Your Role</h1>
        <p className="mt-2 text-sm text-center text-gray-600 mb-8">
          What role do you want to sign up for?
        </p>

        <div className="space-y-6">
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white text-gray-700"
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          <button
            onClick={handleRoleSelect}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300"
          >
            Continue
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-purple-700 hover:text-purple-900 bg-transparent border-none cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection; 