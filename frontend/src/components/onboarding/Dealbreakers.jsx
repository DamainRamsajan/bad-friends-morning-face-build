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
    <div className="rounded-2xl">
      <div className="max-w-md mx-auto">
        
        {/* Header with estimated time */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 font-['Bebas_Neue'] tracking-wide">
            Dealbreakers
          </h2>
          <p className="text-gray-400 text-sm mb-1">Be honest. We won't judge.</p>
          <div className="estimated-time justify-center mt-2">
            <span>⏱️</span> About 2 minutes
          </div>
        </div>
        
        <div className="space-y-5">
          
          {/* Children */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5">
            <p className="text-white font-semibold mb-3">Do you want children?</p>
            <div className="flex gap-3">
              {['Yes', 'No', 'Open to it'].map((option) => (
                <button
                  key={option}
                  onClick={() => setWantsKids(option)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all duration-150 ${
                    wantsKids === option 
                      ? 'btn-primary text-center' 
                      : 'bg-[#0d0d0d] text-gray-400 border border-gray-700 hover:border-[#f5820a] hover:text-[#f5c518]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Distance */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5">
            <p className="text-white font-semibold mb-3">Max distance: <span className="text-[#f5c518]">{maxDistance} miles</span></p>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#f5820a]"
              style={{
                accentColor: '#f5820a'
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5 mi</span>
              <span>25 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
          
          {/* Age Range */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5">
            <p className="text-white font-semibold mb-3">Age range: <span className="text-[#f5c518]">{ageMin} - {ageMax}</span></p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Minimum</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(parseInt(e.target.value))}
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#f5820a] transition"
                  min="18"
                  max={ageMax}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Maximum</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(parseInt(e.target.value))}
                  className="w-full bg-[#0d0d0d] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#f5820a] transition"
                  min={ageMin}
                  max="99"
                />
              </div>
            </div>
          </div>
          
          {/* Politics */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5">
            <p className="text-white font-semibold mb-3">Political leanings</p>
            <div className="flex flex-wrap gap-2">
              {['Liberal', 'Moderate', 'Conservative', 'Libertarian', 'Not Political'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPolitics(option)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    politics === option 
                      ? 'btn-primary text-center' 
                      : 'bg-[#0d0d0d] text-gray-400 border border-gray-700 hover:border-[#f5820a] hover:text-[#f5c518]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Religion (Optional) */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5">
            <p className="text-white font-semibold mb-3">Religion <span className="text-gray-500 text-sm font-normal">(optional)</span></p>
            <div className="flex flex-wrap gap-2">
              {['Christian', 'Jewish', 'Muslim', 'Buddhist', 'Hindu', 'Atheist', 'Spiritual', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => setReligion(religion === option ? null : option)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    religion === option 
                      ? 'btn-primary text-center' 
                      : 'bg-[#0d0d0d] text-gray-400 border border-gray-700 hover:border-[#f5820a] hover:text-[#f5c518]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className={`btn-primary w-full text-center py-3 text-lg ${
              !isValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Complete Onboarding 🎉
          </button>
          
          {!isValid && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Select your preference on children and politics to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dealbreakers;