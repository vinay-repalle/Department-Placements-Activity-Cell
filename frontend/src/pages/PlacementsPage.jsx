import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = '/api/placementdrives';

const typeStyles = {
  ongoing: {
    badge: 'bg-green-100 text-green-700',
    chip: 'bg-green-50 text-green-700',
    icon: '🟢',
  },
  upcoming: {
    badge: 'bg-blue-100 text-blue-700',
    chip: 'bg-blue-50 text-blue-700',
    icon: '🔵',
  },
  previous: {
    badge: 'bg-gray-200 text-gray-700',
    chip: 'bg-gray-100 text-gray-700',
    icon: '⚪',
  },
};

const PlacementsPage = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState({ ongoing: [], upcoming: [], previous: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axios.get(API_URL);
      const all = res.data.data.drives || [];
      const now = new Date();
      const categorized = { ongoing: [], upcoming: [], previous: [] };
      all.forEach(drive => {
        const driveDate = new Date(drive.dateOfDrive);
        if (driveDate.toDateString() === now.toDateString()) {
          categorized.ongoing.push(drive);
        } else if (driveDate > now) {
          categorized.upcoming.push(drive);
        } else {
          categorized.previous.push(drive);
        }
      });
      setDrives(categorized);
      setLoading(false);
    } catch (err) {
      setError('Failed to load placement drives.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this placement drive? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDrives();
    } catch (err) {
      setError('Failed to delete drive');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this placement drive?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDrives();
    } catch (err) {
      setError('Failed to cancel drive');
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this drive as completed? It will move to Previous section.')) return;
    try {
      // Set dateOfDrive to yesterday to move to Previous
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await axios.put(`${API_URL}/${id}`, { dateOfDrive: yesterday.toISOString() }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDrives();
    } catch (err) {
      setError('Failed to complete drive');
    }
  };

  const renderDriveCard = (drive, type) => (
    <div
      key={drive._id}
      className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-7 flex flex-col min-h-[260px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] group mb-6"
    >
      {/* Status Badge */}
      <div className={`absolute top-5 right-5 px-4 py-1 rounded-full text-xs font-bold shadow ${typeStyles[type]?.badge || 'bg-blue-100 text-blue-700'}`}
        title={type}
      >
        <span className="mr-1">{typeStyles[type]?.icon}</span> {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
      {/* Company & Role */}
      <div className="mb-2">
        <div className="font-bold text-lg text-blue-900 group-hover:text-blue-700 transition">{drive.companyName}</div>
        <div className="text-xs text-blue-500 font-semibold">{drive.role}</div>
      </div>
      {/* Info Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow ${typeStyles[type]?.chip}`}>
          <span role="img" aria-label="calendar">📅</span> {drive.dateOfDrive?.slice(0,10)}
        </span>
        <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
          💰 {drive.package}
        </span>
        {drive.bond && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Bond: {drive.bond}</span>}
        {drive.targetDepartments && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Department: {drive.targetDepartments}</span>}
        {drive.stipend && <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Stipend: {drive.stipend}</span>}
      </div>
      {/* Requirements & Description */}
      <div className="text-gray-700 text-sm mb-2"><b>Requirements:</b> {drive.requirements}</div>
      {drive.description && <div className="text-gray-700 text-sm mb-2"><b>Description:</b> {drive.description}</div>}
      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <div className="flex gap-3 mt-auto pt-2">
          {type === 'upcoming' && (
            <>
              <button
                onClick={() => handleCancel(drive._id)}
                className="p-2 rounded-full bg-yellow-50 hover:bg-yellow-200 text-yellow-700 shadow transition"
                title="Cancel Drive"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(drive._id)}
                className="p-2 rounded-full bg-red-50 hover:bg-red-200 text-red-700 shadow transition"
                title="Delete Drive"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
          {type === 'ongoing' && (
            <button
              onClick={() => handleComplete(drive._id)}
              className="p-2 rounded-full bg-green-50 hover:bg-green-200 text-green-700 shadow transition"
              title="Mark as Complete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="max-w-5xl mx-auto py-10 px-4 md:px-0 space-y-16">
        {/* Ongoing Drives */}
        <section id="ongoing-drives" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-green-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-2">Ongoing Placement Drives</h2>
        </div>
          {loading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
            drives.ongoing.length === 0 ? <p>No ongoing drives.</p> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">{drives.ongoing.map(drive => renderDriveCard(drive, 'ongoing'))}</div>
          )}
      </section>
        {/* Upcoming Drives */}
        <section id="upcoming-drives" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-blue-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-blue-400 rounded-full animate-pulse"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2">Upcoming Placement Drives</h2>
        </div>
          {loading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
            drives.upcoming.length === 0 ? <p>No upcoming drives.</p> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">{drives.upcoming.map(drive => renderDriveCard(drive, 'upcoming'))}</div>
          )}
      </section>
        {/* Previous Drives */}
        <section id="previous-drives" className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-t-4 border-gray-300">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-4 h-4 bg-gray-400 rounded-full"></span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 flex items-center gap-2">Previous Placement Drives</h2>
                </div>
          {loading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
            drives.previous.length === 0 ? <p>No previous drives.</p> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">{drives.previous.map(drive => renderDriveCard(drive, 'previous'))}</div>
          )}
        </section>
        </div>
    </div>
  );
};

export default PlacementsPage;