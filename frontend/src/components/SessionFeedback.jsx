import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/api';

const SessionFeedback = ({ session, onFeedbackSubmitted }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if feedback has already been submitted
    checkExistingFeedback();
  }, [session]);

  const checkExistingFeedback = async () => {
    if (!session?.id) return;
    
    try {
      const response = await sessionService.getStudentAttendance(session.id);
      if (response.data?.attendance?.feedbackSubmitted) {
        setHasSubmitted(true);
        setFeedbackText(response.data.attendance.feedbackText || '');
        setFeedbackRating(response.data.attendance.feedbackRating || 5);
      }
    } catch (error) {
      // No feedback submitted yet
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      alert('Please enter your feedback');
      return;
    }

    if (!feedbackRating || feedbackRating < 1 || feedbackRating > 5) {
      alert('Please provide a rating between 1 and 5');
      return;
    }

    setSubmitting(true);
    try {
      await sessionService.submitFeedback(session.id, feedbackText.trim(), feedbackRating);
      
      setFeedbackText('');
      setFeedbackRating(5);
      setShowForm(false);
      setHasSubmitted(true);
      alert('Feedback submitted successfully!');
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session || session.status !== 'completed') {
    return null;
  }

  if (hasSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
        <h4 className="text-sm font-semibold text-green-900 mb-2">Session Feedback</h4>
        <div className="text-sm text-green-700">
          <div className="mb-2">
            <span className="font-medium">Rating:</span> {feedbackRating}/5
          </div>
          {feedbackText && (
            <div className="mb-2">
              <span className="font-medium">Your feedback:</span>
              <div className="mt-1 text-gray-600 bg-white p-2 rounded border">
                {feedbackText}
              </div>
            </div>
          )}
          <div className="text-xs text-green-600">
            ✓ Feedback submitted successfully
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-3">Session Feedback</h4>
      
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Submit Feedback
        </button>
      ) : (
        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rating (1-5) *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFeedbackRating(rating)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                    feedbackRating === rating
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {feedbackRating === 1 && 'Poor'}
              {feedbackRating === 2 && 'Fair'}
              {feedbackRating === 3 && 'Good'}
              {feedbackRating === 4 && 'Very Good'}
              {feedbackRating === 5 && 'Excellent'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Suggestions (Optional)
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your suggestions for improvement..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength="1000"
            />
            <div className="text-xs text-gray-500 mt-1">
              {feedbackText.length}/1000 characters
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFeedbackText('');
                setFeedbackRating(5);
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SessionFeedback; 