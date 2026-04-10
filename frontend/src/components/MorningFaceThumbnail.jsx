import React, { useState } from 'react';
import MorningFaceCapture from './MorningFaceCapture';

const MorningFaceThumbnail = ({ streak, onUploadComplete }) => {
  const [showCamera, setShowCamera] = useState(false);
  
  if (showCamera) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 z-50"
          onClick={() => setShowCamera(false)}
        />
        {/* Modal */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-badfriends-card rounded-2xl border border-badfriends-border overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-badfriends-border flex justify-between items-center">
            <h3 className="text-white font-semibold">Take Morning Face</h3>
            <button 
              onClick={() => setShowCamera(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <MorningFaceCapture 
              onUploadComplete={(newStreak) => {
                setShowCamera(false);
                onUploadComplete(newStreak);
              }}
              currentStreak={streak}
            />
          </div>
        </div>
      </>
    );
  }
  
  return (
    <button 
      onClick={() => setShowCamera(true)}
      className="w-16 h-16 bg-gradient-to-br from-[#f5820a] to-[#f5c518] border-2 border-[#f5820a] rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 active:scale-95 shadow-lg"
    >
      <span className="text-2xl">📷</span>
      <span className="text-[10px] text-white font-semibold mt-1">TAP</span>
    </button>
  );
};

export default MorningFaceThumbnail;
