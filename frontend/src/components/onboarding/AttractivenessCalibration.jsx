// frontend/src/components/onboarding/AttractivenessCalibration.jsx
import React, { useState } from 'react';

// 10 diverse stock faces (using placeholder images - replace with your actual images)
const faceImages = [
  { id: 1, url: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, url: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, url: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 4, url: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, url: "https://randomuser.me/api/portraits/women/5.jpg" },
  { id: 6, url: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: 7, url: "https://randomuser.me/api/portraits/women/7.jpg" },
  { id: 8, url: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 9, url: "https://randomuser.me/api/portraits/women/9.jpg" },
  { id: 10, url: "https://randomuser.me/api/portraits/men/10.jpg" },
];

const AttractivenessCalibration = ({ onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  
  const currentFace = faceImages[currentIndex];
  const progress = ((currentIndex + 1) / faceImages.length) * 100;
  
  const handleRating = (value) => {
    setSelectedValue(value);
    
    // Add subtle delay to show selected state before moving on
    setTimeout(() => {
      const newRatings = { ...ratings, [currentFace.id]: value };
      setRatings(newRatings);
      onProgress(progress);
      setSelectedValue(null);
      
      if (currentIndex + 1 < faceImages.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Calculate average rating (user's attractiveness scale anchor)
        const values = Object.values(newRatings);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        onComplete({ calibration_score: parseFloat(avg.toFixed(1)) });
      }
    }, 150);
  };
  
  return (
    <div className="rounded-2xl">
      <div className="max-w-md mx-auto">
        
        {/* Estimated Time Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="estimated-time">
            <span>⏱️</span> About 2 minutes
          </div>
          <div className="estimated-time">
            <span>🎯</span> Attractiveness calibration
          </div>
        </div>
        
        {/* Progress Bar - Thick & Visible */}
        <div className="mb-6">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Face {currentIndex + 1} of {faceImages.length}</span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-4">
          <div className="text-center mb-2">
            <span className="question-category">
              👀 Calibration
            </span>
          </div>
          
          <img 
            src={currentFace.url} 
            alt="Rate this face"
            className="w-48 h-48 rounded-full mx-auto object-cover mb-6 border-4 border-[#f5820a] shadow-lg"
          />
          
          <p className="question-text text-center mb-6">
            How attractive is this person?
          </p>
          
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                onClick={() => handleRating(val)}
                className={`answer-btn text-center ${selectedValue === val ? 'selected' : ''}`}
              >
                {val}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-3">
            <span>Not attractive</span>
            <span>Very attractive</span>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          This helps us find people in your league. Be honest, you coward.
        </p>
      </div>
    </div>
  );
};

export default AttractivenessCalibration;