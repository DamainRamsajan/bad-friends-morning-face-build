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
        window.location.href = '/app';
      }
    } catch (error) {
      console.error('Error saving dealbreakers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // UPDATED FEATURES LIST - More detailed
  const featuresList = [
    { icon: "🌅", text: "Daily Morning Face Streak - Earn trust points" },
    { icon: "🎭", text: "Answers-First Discovery - Personality before photos" },
    { icon: "👥", text: "Four Friendship Layers - Friends → Bad → Worst → Matches" },
    { icon: "💀", text: "Worst Friend Reactions - Community gold standard" },
    { icon: "👭", text: "The Sisterhood - Women-only safety network" },
    { icon: "📈", text: "Graduated Trust Levels - Earn features through behavior" },
  ];
  
  // UPDATED SAFETY LIST - Architecture focused
  const safetyList = [
    { icon: "🛡️", text: "Women-First Safety Design" },
    { icon: "🔒", text: "End-to-End Encryption for Messages" },
    { icon: "📞", text: "Bad Friend Backup - Share date with trusted contact" },
    { icon: "🚨", text: "Emergency Kill Switch - One-tap lockdown" },
    { icon: "🚫", text: "No Screenshots in Sisterhood" },
    { icon: "📍", text: "Graduated Location Sharing - Level 4+ only" },
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bf-spinner"></div>
          <p className="text-gray-400 mt-4">Saving your secrets...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* BFMF Logo */}
        <div className="flex justify-center mb-6">
          <img src="/BFMF_Banner..png" alt="BF Morning Face" className="w-48" />
        </div>
        
        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Left Column - Features (UPDATED TITLE) */}
          <div className="bf-card h-fit rounded-2xl">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>⚡</span> BF Morning Face Features
            </h3>
            <div className="space-y-2">
              {featuresList.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-base">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Center Column - Questions (ADDED ROUNDED CORNERS) */}
          <div className="md:col-span-2 rounded-2xl">
            <div className="rounded-2xl">
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
          </div>
          
          {/* Right Column - Trusted Architecture (UPDATED TITLE) */}
          <div className="bf-card h-fit rounded-2xl">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🛡️</span> Trusted Architecture
            </h3>
            <div className="space-y-2">
              {safetyList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-bf-border">
              <div className="bg-[#1a1f2e] text-white border border-orange-500 px-2 py-1 rounded-full text-xs text-center font-semibold inline-block w-full">
                Women-First Safety
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;