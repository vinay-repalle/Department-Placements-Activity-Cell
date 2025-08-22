// this for the alumni and faculty how many sessions they conducted and requested   

import React, { useState } from 'react';

const SessionStats = ({ sessions }) => {
  const [showRequestedSessions, setShowRequestedSessions] = useState(false);
  const [showConductedSessions, setShowConductedSessions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-xl font-semibold text-gray-800">Sessions</h1>

      {/* Sessions Requested */}
      <div className="mt-4">
        <button
          onClick={() => setShowRequestedSessions(!showRequestedSessions)}
          className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Sessions Requested ({sessions.requested.length})
        </button>
        {showRequestedSessions && (
          <div className="mt-2 space-y-4">
            {sessions.requested.length > 0 ? (
              sessions.requested.map((session, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{session.sessionTitle}</h3>
                      <p className="text-sm text-gray-600">{session.sessionDescription}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Type: {session.sessionType}</p>
                        <p>Target: {session.targetAudience}</p>
                        <p>Mode: {session.sessionMode}</p>
                        {session.preferredDate && (
                          <p>Preferred: {new Date(session.preferredDate).toLocaleDateString()} at {session.preferredTime}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(session.status)}`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  {session.status === 'rejected' && session.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <p className="text-sm text-red-600">
                        <span className="font-semibold">Rejection Reason:</span> {session.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No requested sessions.</p>
            )}
          </div>
        )}
      </div>

      {/* Sessions Conducted */}
      <div className="mt-4">
        <button
          onClick={() => setShowConductedSessions(!showConductedSessions)}
          className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Sessions Conducted ({sessions.conducted.length})
        </button>
        {showConductedSessions && (
          <div className="mt-2 space-y-4">
            {sessions.conducted.length > 0 ? (
              sessions.conducted.map((session, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{session.sessionTitle}</h3>
                      <p className="text-sm text-gray-600">{session.sessionDescription}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Type: {session.sessionType}</p>
                        <p>Target: {session.targetAudience}</p>
                        <p>Mode: {session.sessionMode}</p>
                        {session.date && (
                          <p>Date: {new Date(session.date).toLocaleDateString()} at {session.time}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No conducted sessions.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionStats;