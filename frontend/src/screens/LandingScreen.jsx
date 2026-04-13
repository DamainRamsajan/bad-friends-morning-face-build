import React from 'react';
import { Link } from 'react-router-dom';

const LandingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center py-16 md:py-24">
          {/* BFMF Banner Logo */}
          <img 
            src="/BFMF_Banner..png" 
            alt="BF Morning Face" 
            className="w-64 md:w-80 mx-auto mb-8 drop-shadow-[0_0_24px_rgba(245,130,10,0.5)]"
          />
          
          {/* Tagline - Heavy display font */}
          <h1 className="font-['Bebas_Neue'] text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide mb-4">
            Morning <span className="text-[#f5c518]">Faces.</span> Bad Jokes. Real Matches.
          </h1>
          
          {/* Subheadline */}
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-8">
            No filters. No retakes. Just you and your worst friend energy.
          </p>
          
          {/* SINGLE CTA BUTTON - Try BF Morning Face */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link to="/register">
              <button className="bg-[#f5c518] hover:bg-[#f5820a] text-black font-bold text-xl py-4 px-12 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-orange-500/30">
                🍜 TRY BF MORNING FACE
              </button>
            </Link>
          </div>
          
          {/* Social Proof Micro-copy */}
          <p className="text-gray-500 text-sm mt-4">
            <span className="text-[#f5c518] font-bold">🍜 Join the community</span> — Be yourself. Find your people.
          </p>
        </div>

        {/* Differentiators Section */}
        <div className="text-center mb-12">
          <h2 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
            What Makes <span className="text-[#f5c518]">BF Morning Face</span> Different
          </h2>
          <div className="w-16 h-1 bg-[#f5820a] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-4xl mb-3">🌅</div>
            <h3 className="text-[#f5c518] font-bold text-xl mb-2">Morning Face Required</h3>
            <p className="text-gray-400 text-sm">No filters. No retakes. Daily vulnerability creates authentic connections.</p>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-4xl mb-3">🎭</div>
            <h3 className="text-[#f5c518] font-bold text-xl mb-2">Humor-First Matching</h3>
            <p className="text-gray-400 text-sm">Personality revealed before photos. Your humor finds your match.</p>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="text-[#f5c518] font-bold text-xl mb-2">The Sisterhood</h3>
            <p className="text-gray-400 text-sm">Women-only safety network. Anonymous vetting. No screenshots.</p>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-4xl mb-3">💀</div>
            <h3 className="text-[#f5c518] font-bold text-xl mb-2">Worst Friend Energy</h3>
            <p className="text-gray-400 text-sm">Rate answers as 💀. The funniest rise to the top.</p>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h2 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
            How <span className="text-[#f5c518]">It Works</span>
          </h2>
          <div className="w-16 h-1 bg-[#f5820a] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16 relative">
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-[#f5820a] bg-opacity-30"
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, #f5820a, #f5820a 10px, transparent 10px, transparent 20px)' }}>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center relative z-10">
            <div className="absolute top-2 right-4 text-8xl font-bold text-[#f5820a]/10 font-['Bebas_Neue']">1</div>
            <div className="text-4xl mb-3 relative">📸</div>
            <h3 className="text-white font-bold text-xl mb-2 relative">Morning Face</h3>
            <p className="text-gray-400 text-sm relative">Take one photo per day. No makeup. No filters. Just you.</p>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center relative z-10">
            <div className="absolute top-2 right-4 text-8xl font-bold text-[#f5820a]/10 font-['Bebas_Neue']">2</div>
            <div className="text-4xl mb-3 relative">🍜</div>
            <h3 className="text-white font-bold text-xl mb-2 relative">Bad Questions</h3>
            <p className="text-gray-400 text-sm relative">Answer absurd daily questions. Show off your humor.</p>
          </div>
          
          <div className="bg-[#1a1a1a] border-t-4 border-[#f5820a] rounded-xl p-6 text-center relative z-10">
            <div className="absolute top-2 right-4 text-8xl font-bold text-[#f5820a]/10 font-['Bebas_Neue']">3</div>
            <div className="text-4xl mb-3 relative">💀</div>
            <h3 className="text-white font-bold text-xl mb-2 relative">Real Connections</h3>
            <p className="text-gray-400 text-sm relative">Find your Bad Friend. Or your Worst Friend. Your call.</p>
            <span className="inline-block mt-2 text-xs text-[#f5820a] font-semibold">Bad Friends approved ✅</span>
          </div>
        </div>
        
        {/* Safety Section - 2x2 Grid */}
        <div className="text-center mb-12">
          <h2 className="font-['Bebas_Neue'] text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
            Safety <span className="text-[#f5c518]">First</span>
          </h2>
          <div className="w-16 h-1 bg-[#f5820a] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400 text-md">Built for women, by people who actually give a damn.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#1a1a1a] border border-[#f5820a]/30 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-3xl mb-3">👭</div>
            <h4 className="text-[#f5c518] font-bold text-lg mb-2">The Sisterhood</h4>
            <p className="text-gray-400 text-sm">Women-only anonymous vetting network</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#f5820a]/30 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-3xl mb-3">📈</div>
            <h4 className="text-[#f5c518] font-bold text-lg mb-2">Graduated Trust</h4>
            <p className="text-gray-400 text-sm">Features unlock as you prove yourself</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#f5820a]/30 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-3xl mb-3">📞</div>
            <h4 className="text-[#f5c518] font-bold text-lg mb-2">Bad Friend Backup</h4>
            <p className="text-gray-400 text-sm">Share date details with trusted contacts</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#f5820a]/30 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200">
            <div className="text-3xl mb-3">🚨</div>
            <h4 className="text-[#f5c518] font-bold text-lg mb-2">Emergency Kill Switch</h4>
            <p className="text-gray-400 text-sm">One-tap lockdown of location sharing</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">
            Built by fans, for fans of the Bad Friends podcast.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link to="/features" className="hover:text-[#f5820a] transition">Features</Link>
            <Link to="/investors" className="hover:text-[#f5820a] transition">Investors</Link>
            <a href="#" className="hover:text-[#f5820a] transition">Privacy</a>
            <a href="#" className="hover:text-[#f5820a] transition">Terms</a>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            v1.0.0 • Authenticity first. Humor always.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default LandingScreen;