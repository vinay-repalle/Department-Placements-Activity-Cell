import React, { useEffect, useState } from 'react';
import { placementService } from '../services/api';

const statusStyles = {
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-800',
};

const AdminNOCSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const response = await placementService.getAllPlacements();
        setSubmissions(response.data?.placements || []);
      } catch (err) {
        setError('Failed to fetch NOC submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleAction = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await placementService.updatePlacementStatus(id, { status });
      setSubmissions(prev => prev.map(sub => sub._id === id ? { ...sub, status } : sub));
    } catch (err) {
      alert('Action failed.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleApproveClick = async (sub) => {
    setActionLoading(prev => ({ ...prev, [sub._id]: true }));
    try {
      await placementService.updatePlacementStatus(sub._id, { status: 'accepted' });
      setSubmissions(prev => prev.map(s => s._id === sub._id ? { ...s, status: 'accepted' } : s));
    } catch (err) {
      alert('Approval failed.');
    } finally {
      setActionLoading(prev => ({ ...prev, [sub._id]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center">Loading NOC submissions...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow">📄</span>
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Manage NOC (Placement/Internship) Submissions</h2>
        </div>
        <button
          onClick={() => window.open('/api/placements/export/excel', '_blank')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </button>
      </div>
      {submissions.length === 0 ? (
        <div className="backdrop-blur-md bg-white/60 rounded-2xl p-10 text-center shadow-lg border border-blue-100 text-blue-500 font-semibold">
          No NOC submissions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {submissions.map((sub, idx) => (
            <div key={sub._id || idx} className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl p-7 flex flex-col min-h-[320px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] group">
              {/* Status Badge */}
              <div className={`absolute top-5 right-5 px-4 py-1 rounded-full text-xs font-bold shadow ${statusStyles[sub.status] || 'bg-gray-100 text-gray-700'}`}
                title={sub.status}
              >
                {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
              </div>
              {/* Company & Position */}
              <div className="mb-2">
                <div className="text-xl font-extrabold text-gray-900 mb-1 truncate group-hover:text-blue-700 transition">{sub.company} <span className="text-sm text-gray-500">({sub.type})</span></div>
                <div className="text-gray-700 text-sm mb-1">Position: <span className="font-semibold">{sub.position || 'N/A'}</span></div>
              </div>
              {/* Info Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="student">🎓</span> {sub.studentName}
                </span>
                <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="year">📅</span> {sub.year}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="id">🆔</span> {sub.idNumber || 'N/A'}
                </span>
                <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                  <span role="img" aria-label="phone">📞</span> {sub.contact || 'N/A'}
                </span>
                {sub.location && (
                  <span className="flex items-center gap-1 bg-white/80 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    <span role="img" aria-label="location">📍</span> {sub.location}
                  </span>
                )}
                {sub.package && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    💰 {sub.package}
                  </span>
                )}
                {sub.approvalTag && (
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {sub.approvalTag}
                  </span>
                )}
              </div>
              {/* Additional Info */}
              <div className="text-gray-700 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
                {sub.additionalInfo || 'No additional info.'}
              </div>

              {/* E3/E4 Specific Information */}
              {(sub.year === 'E3' || sub.year === 'E4') && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-blue-800 mb-2">E3/E4 Student Details:</div>
                  {sub.driveType && (
                    <div className="text-sm text-blue-700 mb-1">
                      <span className="font-medium">Drive Type:</span> {sub.driveType === 'offcampus' ? 'Off Campus' : 'On Campus'}
                    </div>
                  )}
                  {sub.mailScreenshot && (
                    <div className="text-sm text-blue-700 mb-1">
                      <span className="font-medium">Mail Screenshot:</span>
                      <a 
                        href={`/uploads/placements/${sub.mailScreenshot}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {sub.offerLetter && (
                    <div className="text-sm text-blue-700 mb-1">
                      <span className="font-medium">Offer Letter:</span>
                      <a 
                        href={`/uploads/placements/${sub.offerLetter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Submitted Date */}
              <div className="text-xs text-gray-500 mb-2">Submitted: {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'N/A'}</div>
              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  className={`px-5 py-2 rounded-full font-semibold shadow transition text-white ${sub.status === 'accepted' ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={actionLoading[sub._id] || sub.status === 'accepted'}
                  onClick={() => handleApproveClick(sub)}
                  title="Approve"
                >
                  Approve
                </button>
                <button
                  className={`px-5 py-2 rounded-full font-semibold shadow transition text-white ${sub.status === 'rejected' ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  disabled={actionLoading[sub._id] || sub.status === 'rejected'}
                  onClick={() => handleAction(sub._id, 'rejected')}
                  title="Reject"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNOCSubmissions; 