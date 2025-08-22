import React, { useEffect, useState } from 'react';
import { sessionService } from '../services/api';
import Modal from '../components/Modal';

const statusStyles = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-800',
};

const AdminSessionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({});
  const [currentRequestId, setCurrentRequestId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await sessionService.getAllSessionRequests();
        setRequests(response.data || []);
      } catch (err) {
        setError('Failed to fetch session requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await sessionService.updateSessionRequestStatus(id, status);
      setRequests(prev => prev.map(req => req._id === id ? { ...req, status } : req));
    } catch (err) {
      alert('Action failed.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleApproveClick = (req) => {
    setCurrentRequestId(req._id);
    setApproveData({ venue: '', date: '', time: '' });
    setShowApproveModal(true);
  };

  const handleApproveSubmit = async () => {
    setActionLoading(prev => ({ ...prev, [currentRequestId]: true }));
    try {
      await sessionService.approveSessionRequest(currentRequestId, approveData);
      setRequests(prev => prev.map(req => req._id === currentRequestId ? { ...req, status: 'approved' } : req));
      setShowApproveModal(false);
    } catch (err) {
      alert('Approval failed.');
    } finally {
      setActionLoading(prev => ({ ...prev, [currentRequestId]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading session requests...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow">📋</span>
        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Manage Session Requests</h2>
      </div>
      {requests.length === 0 ? (
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-10 text-center shadow-lg border border-blue-100 text-blue-500 font-semibold">
          No session requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {requests.map(req => (
            <div key={req._id} className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-7 flex flex-col min-h-[320px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group">
              {/* Status Badge */}
              <div className={`absolute top-5 right-5 px-4 py-1 rounded-full text-xs font-bold shadow ${statusStyles[req.status] || 'bg-gray-100 text-gray-700'}`}
                title={req.status}
              >
                {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
              </div>
              {/* Profile & Title */}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-blue-200 shadow">
                  {req.fullName ? req.fullName[0].toUpperCase() : '?'}
                </div>
                <div>
                  <div className="font-bold text-lg text-blue-900 group-hover:text-blue-700 transition">{req.fullName || 'Unknown'}</div>
                  <div className="text-xs text-blue-500 font-semibold">{req.userType?.charAt(0).toUpperCase() + req.userType?.slice(1)}</div>
                </div>
              </div>
              {/* Session Title */}
              <div className="mb-2">
                <div className="text-xl font-extrabold text-gray-900 mb-1 truncate group-hover:text-blue-700 transition">{req.sessionTitle}</div>
              </div>
              {/* Info Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="calendar">📅</span> {req.preferredDate}
                </span>
                <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="clock">⏰</span> {req.preferredTime}
                </span>
                <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="mode">🖥️</span> {req.sessionMode}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="id">🆔</span> {req.idNumber || 'N/A'}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="phone">📞</span> {req.contact || 'N/A'}
                </span>
                {req.department && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {req.department}
                  </span>
                )}
                {req.targetAudience && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {req.targetAudience}
                  </span>
                )}
              </div>
              {/* Description */}
              <div className="text-gray-700 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                {req.sessionDescription}
              </div>
              {/* Email */}
              <div className="text-xs text-gray-500 mb-2">{req.email}</div>
              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  className={`px-5 py-2 rounded-full font-semibold shadow transition text-white ${req.status === 'approved' ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={actionLoading[req._id] || req.status === 'approved'}
                  onClick={() => handleApproveClick(req)}
                  title="Approve"
                >
                  Approve
                </button>
                <button
                  className={`px-5 py-2 rounded-full font-semibold shadow transition text-white ${req.status === 'rejected' ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  disabled={actionLoading[req._id] || req.status === 'rejected'}
                  onClick={() => handleAction(req._id, 'rejected')}
                  title="Reject"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showApproveModal && (
        <Modal onClose={() => setShowApproveModal(false)}>
          <h3 className="text-lg font-bold mb-4">Approve Session Request</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Venue"
              value={approveData.venue}
              onChange={e => setApproveData({ ...approveData, venue: e.target.value })}
              className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="date"
              value={approveData.date}
              onChange={e => setApproveData({ ...approveData, date: e.target.value })}
              className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="time"
              value={approveData.time}
              onChange={e => setApproveData({ ...approveData, time: e.target.value })}
              className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg mt-2 font-semibold shadow hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={handleApproveSubmit}
              disabled={actionLoading[currentRequestId]}
            >
              Approve
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSessionRequests; 