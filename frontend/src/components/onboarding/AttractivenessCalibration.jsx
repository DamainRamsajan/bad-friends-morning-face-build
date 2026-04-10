// frontend/src/components/onboarding/AttractivenessCalibration.jsx
import React, { useState, useEffect } from 'react';

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
  
  const currentFace = faceImages[currentIndex];
  const progress = ((currentIndex + 1) / faceImages.length) * 100;
  
  const handleRating = (value) => {
    const newRatings = { ...ratings, [currentFace.id]: value };
    setRatings(newRatings);
    onProgress(progress);
    
    if (currentIndex + 1 < faceImages.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate average rating (user's attractiveness scale anchor)
      const values = Object.values(newRatings);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      onComplete({ calibration_score: parseFloat(avg.toFixed(1)) });
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 rounded-2xl">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Face {currentIndex + 1} of {faceImages.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <img 
            src={currentFace.url} 
            alt="Rate this face"
            className="w-48 h-48 rounded-full mx-auto object-cover mb-6 border-4 border-gray-700"
          />
          
          <p className="text-white text-center mb-4">How attractive is this person?</p>
          
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                onClick={() => handleRating(val)}
                className="py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm hover:border-cheeto transition"
              >
                {val}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Not attractive</span>
            <span>Very attractive</span>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          This helps us find people in your league. Be honest.
        </p>
      </div>
    </div>
  );
};

export default AttractivenessCalibration;