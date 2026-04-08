// frontend/src/screens/InvestorScreen.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvestorScreen = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  
  const INVESTOR_PASSWORD = import.meta.env.VITE_INVESTOR_PASSWORD || 'badfriends2026';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === INVESTOR_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };
  
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-4">Investor Portal</h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            This page is password protected. Contact the team for access.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-3 text-white mb-4 focus:outline-none focus:border-cheeto"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Access
            </button>
          </form>
          <Link to="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-cheeto text-sm hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">Bad Friends - Investor Overview</h1>
        <p className="text-gray-400 mb-8">Confidential - For qualified investors only</p>
        
        {/* Executive Summary */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
          <p className="text-gray-300 mb-4">
            Bad Friends is a humor-first dating app that solves the authenticity crisis in online dating.
            By requiring daily morning faces (no filters, no retakes) and measuring generated humor
            through our proprietary Comedy Match Index (CMI), we've built a platform where
            personality matters more than photos.
          </p>
          <p className="text-gray-300">
            With the backing of the Bad Friends podcast (2M+ monthly listeners), we're positioned
            to capture the growing demand for authentic, humor-driven connections.
          </p>
        </div>
        
        {/* Market Opportunity */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Market Opportunity</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Global dating app market</p>
              <p className="text-white text-2xl font-bold">$10B+</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Bad Friends podcast audience</p>
              <p className="text-white text-2xl font-bold">2M+ monthly</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            The authenticity gap in existing apps is growing. Users are tired of curated perfection.
            Bad Friends offers the first genuine alternative.
          </p>
        </div>
        
        {/* Business Model */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Business Model (v2)</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Free tier</span>
              <span className="text-white">Core features, morning faces, matching</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-300">Fancy B tier ($9.99/mo)</span>
              <span className="text-white">See who liked you, unlimited matches, custom reactions</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-300">Projected MRR at 10k users</span>
              <span className="text-cheeto font-bold">$50k+</span>
            </div>
          </div>
        </div>
        
        {/* Technical Architecture (High-Level) */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Technical Architecture</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {['React', 'FastAPI', 'Supabase', 'Groq', 'Tailwind', 'Netlify', 'Render'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-[#0a0e1a] rounded-full text-gray-400 text-sm">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm">
            Scalable, serverless architecture. PostgreSQL with RLS. AI-powered matching.
            Ready for 100k+ users with minimal infrastructure changes.
          </p>
        </div>
        
        {/* Growth Strategy */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Growth Strategy</h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-300">
            <li>Bad Friends podcast integration (launch day)</li>
            <li>Organic growth via humor sharing on social media</li>
            <li>Referral program (v1.1)</li>
            <li>Campus ambassadors (v2)</li>
          </ol>
        </div>
        
        {/* Team */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Team</h2>
          <p className="text-gray-300">
            Solo founder with full-stack development expertise. Built working prototype in 5 days.
            Previously [your background - add your experience].
          </p>
        </div>
        
        {/* Request */}
        <div className="bg-gradient-to-r from-cheeto to-[#f59e0b] rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Request</h2>
          <p className="text-white mb-4">
            Current: Self-funded, building v1 prototype
          </p>
          <p className="text-white mb-4">
            Seeking: $50k for marketing + infrastructure scaling
          </p>
          <p className="text-white text-sm">
            Use of funds: Podcast integration, user acquisition, server costs, legal
          </p>
        </div>
        
        {/* Contact */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
          <p className="text-gray-300">
            For full pitch deck and financial projections:
          </p>
          <p className="text-cheeto font-semibold mt-2">
            [Your email address]
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorScreen;