// frontend/src/components/onboarding/BaselineCMI.jsx
import React, { useState, useEffect } from 'react';

const BaselineCMI = ({ onComplete, onProgress, apiUrl, getToken }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBaselineQuestions();
  }, []);

  const fetchBaselineQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/questions/baseline`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setError('No baseline questions available');
      }
    } catch (err) {
      console.error('Error fetching baseline questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSubmitAnswer = async (answerText) => {
    const newAnswers = { ...answers, [currentQ.id]: answerText };
    setAnswers(newAnswers);
    onProgress(progress);
    
    setSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/questions/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          question_id: currentQ.id,
          answer_text: answerText
        })
      });
      
      if (response.ok) {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete(newAnswers);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to submit answer');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="bf-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading baseline questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchBaselineQuestions}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <p className="text-gray-400">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl">
      <div className="max-w-md mx-auto">
        
        {/* Estimated Time Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="estimated-time">
            <span>⏱️</span> About 3 minutes
          </div>
          <div className="estimated-time">
            <span>🎭</span> Comedy calibration
          </div>
        </div>
        
        {/* Progress Bar - Thick & Visible */}
        <div className="mb-6">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Baseline {currentIndex + 1} of {questions.length}</span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-4">
          <div className="text-center mb-2">
            <span className="question-category">
              🎤 Comedy Match Index
            </span>
          </div>
          
          <p className="question-text text-center mb-6">
            {currentQ?.text}
          </p>
          
          <textarea
            placeholder="Write your funniest answer here... (min 10 characters)"
            className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f5820a] transition"
            rows="3"
            id="baselineAnswerInput"
          />
          
          <button
            onClick={() => {
              const input = document.getElementById('baselineAnswerInput');
              if (input.value.trim().length >= 10) {
                handleSubmitAnswer(input.value.trim());
              } else {
                alert('Answer must be at least 10 characters. Be funnier.');
              }
            }}
            disabled={submitting}
            className="btn-primary w-full mt-4"
          >
            {submitting ? 'Submitting...' : 'Next Question 💀'}
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          Your funniest answers help us find your comedy soulmate.
        </p>
      </div>
    </div>
  );
};

export default BaselineCMI;