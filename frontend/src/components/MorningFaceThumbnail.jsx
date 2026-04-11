import React, { useState } from 'react';
import MorningFaceCapture from './MorningFaceCapture';

const MorningFaceThumbnail = ({ streak, onUploadComplete }) => {
  const [showCamera, setShowCamera] = useState(false);
  
  // Illustrated Camera SVG - BMFM brand style
  const CameraIcon = () => (
    <svg
      className="cta-icon"
      width="115"
      height="90"
      viewBox="0 0 115 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Camera body */}
      <rect x="5" y="24" width="105" height="62" rx="11" fill="#FFF8E7" stroke="#0D0400" strokeWidth="4"/>
      {/* Viewfinder bump */}
      <rect x="38" y="10" width="30" height="18" rx="7" fill="#FFF8E7" stroke="#0D0400" strokeWidth="4"/>
      {/* Lens outer ring (ink) */}
      <circle cx="57" cy="55" r="21" fill="#0D0400"/>
      {/* Lens fill (orange) */}
      <circle cx="57" cy="55" r="16" fill="#FF6600"/>
      {/* Lens pupil (ink) */}
      <circle cx="57" cy="55" r="9" fill="#0D0400"/>
      {/* Lens highlight */}
      <circle cx="61" cy="50" r="4" fill="#FFE000" opacity="0.9"/>
      {/* Flash block */}
      <rect x="87" y="32" width="11" height="7" rx="2.5" fill="#FF6600" stroke="#0D0400" strokeWidth="2"/>
      {/* Viewfinder dot */}
      <circle cx="18" cy="38" r="5" fill="#FF6600" stroke="#0D0400" strokeWidth="2"/>
    </svg>
  );
  
  if (showCamera) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 z-50"
          onClick={() => setShowCamera(false)}
        />
        {/* Modal */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-[#161616] rounded-2xl border border-[#f5820a]/30 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#f5820a]/30 flex justify-between items-center">
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
      className="morning-face-cta"
      aria-label="Take photo"
    >
      <CameraIcon />
      <span className="cta-label">TAP</span>
      <div className="shimmer" aria-hidden="true"></div>
    </button>
  );
};

export default MorningFaceThumbnail;