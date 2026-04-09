import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/app' },
    { id: 'discover', icon: '👀', label: 'Discover', path: '/app/discover' },
    { id: 'matches', icon: '💀', label: 'Matches', path: '/app/matches' },
    { id: 'profile', icon: '😈', label: 'Profile', path: '/app/profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-badfriends-bg/95 backdrop-blur-lg border-t border-badfriends-border py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? 'text-primary scale-105'
                : 'text-badfriends-text-dim hover:text-badfriends-text-muted'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;