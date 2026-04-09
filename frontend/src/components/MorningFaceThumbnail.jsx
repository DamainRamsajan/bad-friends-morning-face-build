import React, { useState } from 'react';
import MorningFaceCapture from './MorningFaceCapture';

const MorningFaceThumbnail = ({ streak, onUploadComplete }) => {
  const [showCamera, setShowCamera] = useState(false);
  
  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-badfriends-bg">
        <div className="p-4">
          <button 
            onClick={() => setShowCamera(false)}
            className="bf-btn-icon text-badfriends-text mb-4"
          >
            ← Back
          </button>
          <MorningFaceCapture 
            onUploadComplete={(newStreak) => {
              setShowCamera(false);
              onUploadComplete(newStreak);
            }}
            currentStreak={streak}
          />
        </div>
      </div>
    );
  }
  
  return (
    <button 
      onClick={() => setShowCamera(true)}
      className="w-16 h-16 bg-badfriends-input border-2 border-badfriends-border rounded-2xl flex flex-col items-center justify-center hover:border-primary transition-all duration-200 active:scale-95"
    >
      <span className="text-2xl">📷</span>
      <span className="text-[10px] text-badfriends-text-dim mt-1">TAP</span>
    </button>
  );
};

export default MorningFaceThumbnail;