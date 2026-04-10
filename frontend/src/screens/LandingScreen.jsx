import React from 'react';
import { Link } from 'react-router-dom';

const LandingScreen = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* BFMF Banner Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/BFMF_Banner..png" 
            alt="BF Morning Face" 
            className="w-64 md:w-80"
          />
        </div>
        
        {/* Tagline */}
        <p className="text-center text-white/80 text-lg mb-8">
          Morning faces. Bad jokes. Real matches.
        </p>
        
        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <Link to="/register">
            <img 
              src="/buttons/Try_BFMF_Button.png" 
              alt="Try BF Morning Face"
              className="h-11 w-auto mx-auto hover:scale-105 transition-transform"
            />
          </Link>
        </div>
        
        {/* Differentiators Section */}
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          What Makes BF Morning Face Different
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">🌅</div>
            <h3 className="text-white font-bold mb-2">Morning Face Required</h3>
            <p className="text-gray-400 text-sm">No filters. No retakes. Daily vulnerability creates authentic connections.</p>
          </div>
          
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-white font-bold mb-2">Humor-First Matching</h3>
            <p className="text-gray-400 text-sm">Personality revealed before photos. Your humor finds your match.</p>
          </div>
          
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-white font-bold mb-2">The Sisterhood</h3>
            <p className="text-gray-400 text-sm">Women-only safety network. Anonymous vetting. No screenshots.</p>
          </div>
          
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">💀</div>
            <h3 className="text-white font-bold mb-2">Worst Friend Energy</h3>
            <p className="text-gray-400 text-sm">Rate answers as 💀. The funniest rise to the top.</p>
          </div>
        </div>
        
        {/* How It Works */}
        <h2 className="text-2xl font-bold text-center text-white mb-8">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="text-white font-bold mb-2">1. Morning Face</h3>
            <p className="text-gray-400 text-sm">Take one photo per day. No makeup. No filters. Just you.</p>
          </div>
          
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">🍜</div>
            <h3 className="text-white font-bold mb-2">2. Bad Questions</h3>
            <p className="text-gray-400 text-sm">Answer absurd daily questions. Show off your humor.</p>
          </div>
          
          <div className="bf-card text-center">
            <div className="text-4xl mb-3">💀</div>
            <h3 className="text-white font-bold mb-2">3. Real Connections</h3>
            <p className="text-gray-400 text-sm">Find your Bad Friend. Or your Worst Friend. Your call.</p>
          </div>
        </div>
        
        {/* Safety Section */}
        <div className="bf-card bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🛡️</span>
            <h3 className="text-white font-bold">Safety First</h3>
          </div>
          <p className="text-gray-300 text-sm mb-2">
            BF Morning Face is built with women's safety as the foundation:
          </p>
          <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
            <li>The Sisterhood - Women-only anonymous vetting network</li>
            <li>Graduated Trust Levels - Features unlock as you prove yourself</li>
            <li>Bad Friend Backup - Share date details with trusted contacts</li>
            <li>Emergency Kill Switch - One-tap lockdown of all location sharing</li>
          </ul>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm mb-4">
            Built by fans, for fans of the Bad Friends podcast.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link to="/features" className="hover:text-orange-500 transition">Features</Link>
            <Link to="/investors" className="hover:text-orange-500 transition">Investors</Link>
            <a href="#" className="hover:text-orange-500 transition">Privacy</a>
            <a href="#" className="hover:text-orange-500 transition">Terms</a>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LandingScreen;
