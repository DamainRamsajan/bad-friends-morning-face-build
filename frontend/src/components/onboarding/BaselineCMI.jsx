// frontend/src/components/onboarding/BaselineCMI.jsx
import React, { useState } from 'react';

const baselineQuestions = [
  {
    id: 1,
    text: "Would you suck Jamie Lee Curtis's big toe for a Klondike bar?"
  },
  {
    id: 2,
    text: "If you had unlimited money, would you buy Janice Joplin's toenail collection?"
  },
  {
    id: 3,
    text: "Would you rather fight one Bobby-Lee-sized ant or 100 ant-sized Bobby Lees?"
  },
  {
    id: 4,
    text: "Rate your current tiredness as a weather forecast."
  },
  {
    id: 5,
    text: "What's something you're NOT going to feel guilty about today?"
  }
];

const BaselineCMI = ({ onComplete, onProgress, apiUrl, getToken }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const currentQ = baselineQuestions[currentIndex];
  const progress = ((currentIndex + 1) / baselineQuestions.length) * 100;

  const handleSubmitAnswer = async (answerText) => {
    const newAnswers = { ...answers, [currentQ.id]: answerText };
    setAnswers(newAnswers);
    onProgress(progress);
    
    // Submit to backend for CMI calculation
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
          question_id: currentQ.id.toString(),
          answer_text: answerText
        })
      });
      
      if (response.ok) {
        if (currentIndex + 1 < baselineQuestions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete(newAnswers);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Baseline {currentIndex + 1} of {baselineQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <p className="text-white text-lg text-center mb-6 leading-relaxed">
            {currentQ.text}
          </p>
          
          <textarea
            placeholder="Write your funniest answer here..."
            className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cheeto"
            rows="3"
            id="answerInput"
          />
          
          <button
            onClick={() => {
              const input = document.getElementById('answerInput');
              if (input.value.trim().length >= 10) {
                handleSubmitAnswer(input.value.trim());
              } else {
                alert('Answer must be at least 10 characters. Be funnier.');
              }
            }}
            disabled={submitting}
            className="w-full mt-4 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
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