// frontend/src/components/onboarding/Dealbreakers.jsx
import React, { useState } from 'react';

const Dealbreakers = ({ onComplete }) => {
  const [wantsKids, setWantsKids] = useState(null);
  const [maxDistance, setMaxDistance] = useState(25);
  const [ageMin, setAgeMin] = useState(25);
  const [ageMax, setAgeMax] = useState(35);
  const [politics, setPolitics] = useState(null);
  const [religion, setReligion] = useState(null);
  
  const handleComplete = () => {
    onComplete({
      wants_kids: wantsKids,
      max_distance: maxDistance,
      age_min: ageMin,
      age_max: ageMax,
      politics: politics,
      religion: religion
    });
  };
  
  const isValid = wantsKids !== null && politics !== null;
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 rounded-2xl">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Dealbreakers</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Be honest. We won't judge.</p>
        
        <div className="space-y-6">
          {/* Children */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Do you want children?</p>
            <div className="flex gap-3">
              {['Yes', 'No', 'Open to it'].map((option) => (
                <button
                  key={option}
                  onClick={() => setWantsKids(option)}
                  className={`flex-1 py-2 rounded-lg transition ${
                    wantsKids === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Distance */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Max distance: {maxDistance} miles</p>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 mi</span>
              <span>25 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
          
          {/* Age Range */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Age range: {ageMin} - {ageMax}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500">Minimum</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(parseInt(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white"
                  min="18"
                  max={ageMax}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">Maximum</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(parseInt(e.target.value))}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg p-2 text-white"
                  min={ageMin}
                  max="99"
                />
              </div>
            </div>
          </div>
          
          {/* Politics */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Political leanings</p>
            <div className="flex flex-wrap gap-2">
              {['Liberal', 'Moderate', 'Conservative', 'Libertarian', 'Not Political'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPolitics(option)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    politics === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Religion */}
          <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
            <p className="text-white font-semibold mb-3">Religion (optional)</p>
            <div className="flex flex-wrap gap-2">
              {['Christian', 'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Atheist', 'Spiritual', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => setReligion(religion === option ? null : option)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    religion === option 
                      ? 'bg-cheeto text-white' 
                      : 'bg-[#0a0e1a] text-gray-400 border border-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            Complete Onboarding 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dealbreakers;