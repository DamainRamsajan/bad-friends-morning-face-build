// frontend/src/screens/FeaturesScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturesScreen = () => {
  const features = [
    {
      category: "Core Experience",
      items: [
        { name: "Daily Morning Face", desc: "One photo per day, timestamp-verified, no filters" },
        { name: "Bad Questions", desc: "Absurd daily questions inspired by the podcast" },
        { name: "Unified Feed", desc: "See friends' faces and answers in one scroll" }
      ]
    },
    {
      category: "Matching",
      items: [
        { name: "Answers First", desc: "See personality before photos" },
        { name: "Humor Compatibility", desc: "Our engine finds your comedy soulmate" },
        { name: "Four Friendship Layers", desc: "From casual follows to romantic matches" }
      ]
    },
    {
      category: "Safety",
      items: [
        { name: "Graduated Trust", desc: "Features unlock as you prove yourself" },
        { name: "Community Vetting", desc: "Anonymous peer verification network" },
        { name: "Location Control", desc: "You decide who sees where you are" }
      ]
    },
    {
      category: "Coming Soon",
      items: [
        { name: "Voice Notes", desc: "Hear your match's voice" },
        { name: "Video Chat", desc: "Face-to-face before meeting IRL" },
        { name: "Group Challenges", desc: "Island Bullies group activities" },
        { name: "Location Heat Maps", desc: "See where Bad Friends gather" }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-cheeto text-sm hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">Features</h1>
        <p className="text-gray-400 mb-12">
          Everything you need to find your Bad Friend.
        </p>
        
        <div className="space-y-12">
          {features.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-bold text-white mb-4">{section.category}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.name} className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
                    <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Join the Beta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesScreen;