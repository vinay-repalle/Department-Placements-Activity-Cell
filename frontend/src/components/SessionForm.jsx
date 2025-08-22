/**
 * SessionForm Component
 * 
 * A form component for creating and editing mentoring sessions with
 * comprehensive validation and dynamic field handling.
 * 
 * Features:
 * - Dynamic form validation
 * - Date and time picker
 * - Resource attachment
 * - Participant management
 * - Session scheduling
 * 
 * Form Fields:
 * 1. Basic Information
 *    - Title
 *    - Description
 *    - Session type
 *    - Target audience
 * 
 * 2. Schedule
 *    - Date picker
 *    - Time slots
 *    - Duration
 *    - Timezone handling
 * 
 * 3. Location
 *    - Venue selection
 *    - Online/Offline mode
 *    - Meeting link (if online)
 * 
 * 4. Additional Details
 *    - Resources/Materials
 *    - Prerequisites
 *    - Maximum participants
 *    - Session rules
 * 
 * Props:
 * @param {Object} initialData - Initial session data
 * @param {string} mode - Create/Edit mode
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} onCancel - Cancel handler
 * @param {boolean} loading - Loading state
 * 
 * Validation:
 * - Required fields
 * - Date/Time constraints
 * - Participant limits
 * - File size/type checks
 * 
 * Dependencies:
 * - Form validation library
 * - Date/Time pickers
 * - File upload utilities
 * - API services
 * 
 * @component SessionForm
 * @example
 * ```jsx
 * <SessionForm
 *   initialData={sessionData}
 *   mode="create"
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   loading={isSubmitting}
 * />
 * ```
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModernSuccessAlert from "./ModernSuccessAlert";
import { sessionService } from '../services/api';

const SessionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: "",
    rguktAffiliation: "",
    userType: user?.role || "alumni", // alumni, faculty, or admin
    graduationYear: "",
    department: "",
    sessionTitle: "",
    sessionDescription: "",
    sessionType: "technical",
    targetAudience: [], // Changed to array for multiple selections
    targetDepartments: [], // Changed to array for multiple selections
    preferredDate: "",
    preferredTime: "",
    sessionMode: "online"
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes for multiple selections
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one year and one department is selected
    if (formData.targetAudience.length === 0) {
      alert('Please select at least one target year');
      return;
    }
    if (formData.targetDepartments.length === 0) {
      alert('Please select at least one target department');
      return;
    }

    try {
      const payload = {
        ...formData,
        userId: user._id,
        userType: user.role,
        status: 'pending',
        idNumber: user.collegeId || user.facultyId || user.studentId || user.adminId || '',
        contact: user.phoneNumber || ''
      };
      await sessionService.createSession(payload);
      setShowSuccess(true);
      setTimeout(() => {
        const roleRoutes = {
          admin: '/admin',
          alumni: '/alumni',
          faculty: '/faculty'
        };
        navigate(roleRoutes[user?.role] || '/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting session request:', error);
      alert(error?.response?.data?.message || 'Failed to submit session request.');
    }
  };

  return (
    <section
      className="min-h-screen bg-cover h-[50px]"
      style={{ backgroundImage: "url('src/assets/session-bg.jpeg')" }}
    >
      <div className="flex flex-col min-h-screen bg-black/60 justify-center items-center w-full">
        <div className="container flex flex-col items-center text-center px-6 py-12 mx-auto">
          <div className="w-full max-w-xl">
            <h1 className="text-2xl font-semibold capitalize lg:text-3xl text-white">
              Host a Knowledge Sharing Session
            </h1>
            <p className="mt-6 text-white">
              Empower students by sharing your insights and experiences. Contribute to meaningful learning by organizing a session. Fill out the form below to get started!
            </p>
          </div>

          <div className="w-full max-w-3xl mt-8 text-left">
            <div className="w-full px-8 py-10 bg-white shadow-2xl rounded-xl dark:bg-gray-900">
              <h1 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                Session Submission Form
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Provide your session details, and we'll take care of the rest. We appreciate your time and effort in guiding students!
              </p>

              {showSuccess ? (
                <ModernSuccessAlert 
                  message="Session request submitted successfully! We will review it and get back to you soon."
                  onClose={() => setShowSuccess(false)}
                />
              ) : (
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        RGUKT Affiliation
                      </label>
                      <input
                        type="text"
                        name="rguktAffiliation"
                        value={formData.rguktAffiliation}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        I am a
                      </label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                        disabled
                      >
                        <option value="alumni">Alumni</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {formData.userType === 'alumni' ? (
                      <div>
                        <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                          Year of Graduation
                        </label>
                        <input
                          type="number"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          min="2000"
                          max="2024"
                          className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Session Title
                      </label>
                      <input
                        type="text"
                        name="sessionTitle"
                        value={formData.sessionTitle}
                        onChange={handleChange}
                        placeholder="e.g., Cracking the GATE Exam"
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Session Description
                    </label>
                    <textarea
                        name="sessionDescription"
                        value={formData.sessionDescription}
                      onChange={handleChange}
                        rows="4"
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      required
                    ></textarea>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Session Type
                      </label>
                      <select
                        name="sessionType"
                        value={formData.sessionType}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      >
                        <option value="technical">Technical</option>
                        <option value="career">Career Guidance</option>
                        <option value="motivational">Motivational</option>
                        <option value="academic">Academic</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Target Audience - Checkboxes */}
                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Target Audience (Years)
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {['all', 'E-1', 'E-2', 'E-3', 'E-4'].map((year) => (
                          <label key={year} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.targetAudience.includes(year)}
                              onChange={() => handleCheckboxChange('targetAudience', year)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {year === 'all' ? 'All Years' : year}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Target Departments - Checkboxes */}
                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Target Departments
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {['ALL', 'CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'CHEM', 'MME'].map((dept) => (
                          <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.targetDepartments.includes(dept)}
                              onChange={() => handleCheckboxChange('targetDepartments', dept)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {dept === 'ALL' ? 'All Departments' : dept}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                        Session Mode
                      </label>
                      <select
                        name="sessionMode"
                        value={formData.sessionMode}
                        onChange={handleChange}
                        className="block w-full px-5 py-3 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                        required
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Submit Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionForm;
