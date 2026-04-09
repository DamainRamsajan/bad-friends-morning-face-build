import React from 'react';

const Banner = ({ streak, userName }) => {
  const currentHour = new Date().getHours();
  const isMorning = currentHour < 12;
  
  return (
    <div className="text-center mb-6">
      {/* Your Banner Image */}
      <img 
        src="/BFMF_Banner..png" 
        alt="Bad Friends Morning Face"
        className="w-full rounded-lg mb-3"
      />
      
      <h1 className="text-2xl font-bold text-white mb-1">🍜 Bad Friends</h1>
      <p className="text-gray-400 text-sm">Morning faces. Bad jokes. Real matches.</p>
      {userName && (
        <p className="text-gray-500 text-xs mt-1">Hey, {userName}!</p>
      )}
      {streak > 0 && (
        <div className="inline-block mt-2 px-3 py-1 bg-red-500/20 border border-red-500 rounded-full">
          <span className="text-red-500 text-xs font-semibold">🔥 {streak} day streak</span>
        </div>
      )}
      <p className="text-gray-600 text-xs mt-2 italic">
        "{isMorning ? "You look terrible." : "Still terrible."} Let's match."
      </p>
    </div>
  );
};

export default Banner;