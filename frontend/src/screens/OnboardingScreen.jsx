import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import PsychologicalScales from '../components/onboarding/PsychologicalScales';
import BaselineCMI from '../components/onboarding/BaselineCMI';
import AttractivenessCalibration from '../components/onboarding/AttractivenessCalibration';
import Dealbreakers from '../components/onboarding/Dealbreakers';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [psychologicalData, setPsychologicalData] = useState(null);
  const [cmiData, setCmiData] = useState(null);
  const [calibrationData, setCalibrationData] = useState(null);
  const [dealbreakersData, setDealbreakersData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };
  
  // Save progress to localStorage so user can resume
  const saveProgress = (stepNum, data) => {
    localStorage.setItem('bf_onboarding_step', stepNum);
    localStorage.setItem('bf_onboarding_data', JSON.stringify(data || {}));
  };
  
  const clearProgress = () => {
    localStorage.removeItem('bf_onboarding_step');
    localStorage.removeItem('bf_onboarding_data');
  };
  
  const handleSaveAndExit = () => {
    // Save current progress before exiting
    if (step === 1 && psychologicalData) saveProgress(step, psychologicalData);
    if (step === 2 && cmiData) saveProgress(step, cmiData);
    if (step === 3 && calibrationData) saveProgress(step, calibrationData);
    if (step === 4 && dealbreakersData) saveProgress(step, dealbreakersData);
    navigate('/');
  };
  
  const savePsychologicalData = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/onboarding/psychological`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setPsychologicalData(data);
      saveProgress(2, data);
      setStep(2);
      setProgress(0);
    } catch (error) {
      console.error('Error saving psychological data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveBaselineCMI = async (answers) => {
    setLoading(true);
    try {
      setCmiData(answers);
      saveProgress(3, answers);
      setStep(3);
      setProgress(0);
    } catch (error) {
      console.error('Error saving CMI data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveCalibration = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/onboarding/calibration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setCalibrationData(data);
      saveProgress(4, data);
      setStep(4);
      setProgress(0);
    } catch (error) {
      console.error('Error saving calibration data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveDealbreakers = async (data) => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/onboarding/dealbreakers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setDealbreakersData(data);
        localStorage.setItem('bf_onboarding_complete', 'true');
        clearProgress(); // Clear saved progress
        // Use React Router navigation instead of hard reload
        navigate('/app');
      }
    } catch (error) {
      console.error('Error saving dealbreakers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // UPDATED FEATURES LIST - With bold name + muted description
  const featuresList = [
    { icon: "🌅", name: "Daily Morning Face", desc: "Earn trust points with daily streaks" },
    { icon: "🎭", name: "Answers-First Discovery", desc: "Personality before photos" },
    { icon: "👥", name: "Four Friendship Layers", desc: "Friends → Bad → Worst → Matches" },
    { icon: "💀", name: "Worst Friend Reactions", desc: "Community gold standard for humor" },
    { icon: "👭", name: "The Sisterhood", desc: "Women-only safety network" },
    { icon: "📈", name: "Graduated Trust Levels", desc: "Earn features through behavior" },
  ];
  
  // UPDATED SAFETY LIST - As mini-cards with checkmarks
  const safetyList = [
    { icon: "🛡️", text: "Women-First Safety Design", verified: true },
    { icon: "🔒", text: "End-to-End Encryption for Messages", verified: true },
    { icon: "📞", text: "Bad Friend Backup - Share date with trusted contact", verified: true },
    { icon: "🚨", text: "Emergency Kill Switch - One-tap lockdown", verified: true },
    { icon: "🚫", text: "No Screenshots in Sisterhood", verified: true },
    { icon: "📍", text: "Graduated Location Sharing - Level 4+ only", verified: true },
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="bf-spinner"></div>
          <p className="text-gray-400 mt-4">Saving your secrets...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Nav Bar - Logo left, Save & Exit right */}
      <div className="nav-bar max-w-6xl mx-auto px-4 py-4">
        <img src="/BFMF_Banner..png" alt="BF Morning Face" className="h-10 w-auto" />
        <button onClick={handleSaveAndExit} className="save-exit-btn">
          Save & Exit →
        </button>
      </div>
      
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Three-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Left Column - Features (UPDATED with bold name + muted description) */}
            <div className="bf-card rounded-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                <span>⚡</span> BF Morning Face Features
              </h3>
              <div className="space-y-3">
                {featuresList.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <div className="flex items-start gap-2">
                      <span className="text-base">{feature.icon}</span>
                      <div>
                        <div className="feature-name">{feature.name}</div>
                        <div className="feature-desc">{feature.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Center Column - Questions */}
            <div className="md:col-span-2">
              {step === 1 && (
                <PsychologicalScales 
                  onComplete={savePsychologicalData}
                  onProgress={setProgress}
                />
              )}
              {step === 2 && (
                <BaselineCMI 
                  onComplete={saveBaselineCMI}
                  onProgress={setProgress}
                  apiUrl={API_URL}
                  getToken={getToken}
                />
              )}
              {step === 3 && (
                <AttractivenessCalibration 
                  onComplete={saveCalibration}
                  onProgress={setProgress}
                />
              )}
              {step === 4 && (
                <Dealbreakers 
                  onComplete={saveDealbreakers}
                />
              )}
            </div>
            
            {/* Right Column - Trusted Architecture (UPDATED with mini-cards) */}
            <div className="bf-card rounded-2xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                <span>🛡️</span> Trusted Architecture
              </h3>
              <div className="space-y-2">
                {safetyList.map((item, idx) => (
                  <div key={idx} className="safety-card flex items-center">
                    <span className="safety-icon">{item.icon}</span>
                    <span className="safety-text flex-1">{item.text}</span>
                    {item.verified && <span className="safety-check">✓</span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800">
                <button 
                  onClick={() => document.getElementById('safety-cta')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-cta-solid w-full text-center"
                >
                  Women-First Safety
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;