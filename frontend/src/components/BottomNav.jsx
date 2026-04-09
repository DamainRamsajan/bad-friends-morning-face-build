// frontend/src/components/BottomNav.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { id: 'feed', icon: '📰', label: 'Feed', path: '/app/feed' },
    { id: 'discover', icon: '👀', label: 'Discover', path: '/app/discover' },
    { id: 'matches', icon: '💀', label: 'Matches', path: '/app/matches' },
    { id: 'profile', icon: '😈', label: 'Profile', path: '/app/profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-gray-800 py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
              location.pathname === item.path
                ? 'text-red-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;