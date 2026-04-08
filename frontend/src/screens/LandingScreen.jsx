// frontend/src/screens/LandingScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-cheeto rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f59e0b] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🍜</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Bad Friends
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Morning faces. Bad jokes. Real matches.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Join the Beta
          </Link>
        </div>
      </div>
      
      {/* Differentiators (Vague but compelling) */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          What Makes Bad Friends Different
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🌅</div>
            <h3 className="text-xl font-semibold text-white mb-2">Morning Face Required</h3>
            <p className="text-gray-400 text-sm">
              Daily vulnerability creates authentic connections. No filters. No retakes.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Humor-First Matching</h3>
            <p className="text-gray-400 text-sm">
              Personality revealed before photos. Our proprietary algorithm finds your comedy soulmate.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Trust-Based Safety</h3>
            <p className="text-gray-400 text-sm">
              Graduated access to features. Trust is earned, not given.
            </p>
          </div>
          
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
            <div className="text-3xl mb-3">👭</div>
            <h3 className="text-xl font-semibold text-white mb-2">Community-Verified Network</h3>
            <p className="text-gray-400 text-sm">
              Peer-vetted safety system puts users in control.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-[#1a1f2e]/50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-white font-semibold mb-2">1. Morning Face</h3>
              <p className="text-gray-400 text-sm">
                Take one photo per day. No makeup. No filters. Just you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🍜</div>
              <h3 className="text-white font-semibold mb-2">2. Bad Questions</h3>
              <p className="text-gray-400 text-sm">
                Answer absurd daily questions. Show off your humor.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💀</div>
              <h3 className="text-white font-semibold mb-2">3. Real Connections</h3>
              <p className="text-gray-400 text-sm">
                Find your Bad Friend. Or your Worst Friend. Your call.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Footer */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 mb-4">
          Built by fans, for fans of the Bad Friends podcast.
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          <Link to="/features" className="hover:text-gray-400">Features</Link>
          <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;