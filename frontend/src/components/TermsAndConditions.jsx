import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TermsAndConditions = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'placement',
    company: '',
    position: '',
    package: '',
    location: '',
    joiningDate: '',
    additionalInfo: '',
    driveType: '',
    mailScreenshot: null,
    offerLetter: null
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    console.log('useEffect: user =', user);
    if (user && user._id) {
    fetchSubmissions();
    }
  }, [user?._id]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('fetchSubmissions: user._id =', user?._id);
      const url = `${API_BASE_URL}/api/placements/user/${user?._id}`;
      console.log('fetchSubmissions: GET', url);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('fetchSubmissions: response =', response);
      setSubmissions(response.data.data.placements || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to fetch your submissions. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (!userData || !userData.fullName || !userData.yearOfStudy) {
        throw new Error('User data is incomplete. Please ensure you are properly logged in.');
      }

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('studentName', userData.fullName);
      formDataToSend.append('idNumber', userData.studentId);
      formDataToSend.append('contact', userData.phoneNumber);
      formDataToSend.append('year', userData.yearOfStudy);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('package', formData.package);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('joiningDate', formData.joiningDate);
      formDataToSend.append('additionalInfo', formData.additionalInfo);
      
      // Add E3/E4 specific fields
      if (userData.yearOfStudy === 'E3' || userData.yearOfStudy === 'E4') {
        formDataToSend.append('driveType', formData.driveType);
        if (formData.mailScreenshot) {
          formDataToSend.append('mailScreenshot', formData.mailScreenshot);
        }
        if (formData.offerLetter) {
          formDataToSend.append('offerLetter', formData.offerLetter);
        }
      }

      await axios.post(`${API_BASE_URL}/api/placements`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Reset form and show success message
      setFormData({
        type: 'placement',
        company: '',
        position: '',
        package: '',
        location: '',
        joiningDate: '',
        additionalInfo: '',
        driveType: '',
        mailScreenshot: null,
        offerLetter: null
      });
      setShowAlert(true);
      setIsOpen(false);
      fetchSubmissions(); // Refresh submissions list

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.response?.data?.message || 'Failed to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const isE3E4Student = user?.yearOfStudy === 'E3' || user?.yearOfStudy === 'E4';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p>Submitted successfully! We will update you on further progress.</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg font-semibold">Terms and Conditions for Placement/Internship</span>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="p-6 animate-fade-in">
            {/* Terms and Conditions Text */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <h3 className="font-semibold text-gray-800 mb-2">Please read the following terms carefully:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>All information provided must be accurate and truthful.</li>
                <li>Once submitted, you cannot modify the information.</li>
                <li>The submission will be reviewed by the placement cell.</li>
                <li>You may submit multiple applications for different opportunities.</li>
                <li>Keep track of your submission status in the history section below.</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="placement"
                        checked={formData.type === 'placement'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Placement</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="internship"
                        checked={formData.type === 'internship'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Internship</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'placement' ? 'Package (LPA)' : 'Stipend (per month)'}
                  </label>
                  <input
                    type="number"
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'placement' ? 'Joining Date' : 'Internship Start Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* E3/E4 Specific Fields */}
                {isE3E4Student && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type of Drive</label>
                      <select
                        value={formData.driveType}
                        onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Drive Type</option>
                        <option value="offcampus">Off Campus</option>
                        <option value="oncampus">On Campus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mail Screenshot</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('mailScreenshot', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload screenshot of the mail/notification</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Offer Letter</label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange('offerLetter', e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Upload the offer letter document</p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any additional details about the opportunity..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Submission History */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Submissions</h3>
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-gray-800">{submission.company}</p>
                  <span className="text-sm text-gray-500">•</span>
                  <p className="text-sm text-gray-600">{submission.type}</p>
                  <span className="text-sm text-gray-500">•</span>
                  <p className="text-sm text-gray-600">{submission.status}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Student: {submission.studentName} | Year: {submission.year}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted on: {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </span>
            </div>
          ))}
          {submissions.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No submissions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 