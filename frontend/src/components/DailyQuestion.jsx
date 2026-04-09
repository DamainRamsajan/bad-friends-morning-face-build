import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const DailyQuestion = () => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  useEffect(() => {
    fetchQuestion();
  }, []);
  
  const fetchQuestion = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch(`${API_URL}/questions/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.question) {
        setQuestion(data.question);
        setHasAnswered(data.question.has_answered);
      }
    } catch (err) {
      console.error('Error fetching question:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const submitAnswer = async () => {
    if (!answer.trim() || answer.length < 10) {
      alert('Answer must be at least 10 characters');
      return;
    }
    setSubmitting(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch(`${API_URL}/questions/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          question_id: question.id,
          answer_text: answer
        })
      });
      setHasAnswered(true);
      setAnswer('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-20 bg-gray-700 rounded mb-3"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (hasAnswered) {
    return (
      <div className="bg-[#1a1f2e] rounded-xl border border-gray-700 p-4 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-white text-sm">You answered today's question!</p>
        <p className="text-gray-500 text-xs mt-2">Come back tomorrow for a new question</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🍜</span>
        <h3 className="text-white font-semibold">Today's Bad Question</h3>
      </div>
      
      <p className="text-white text-sm leading-relaxed mb-4">
        {question?.question_text}
      </p>
      
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your funniest answer... (min 10 characters)"
        className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        rows="3"
      />
      
      <button
        onClick={submitAnswer}
        disabled={submitting}
        className="w-full mt-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Answer 💀'}
      </button>
      
      <p className="text-gray-500 text-xs text-center mt-3">
        Best answers get 💀 reactions from the community
      </p>
    </div>
  );
};

export default DailyQuestion;