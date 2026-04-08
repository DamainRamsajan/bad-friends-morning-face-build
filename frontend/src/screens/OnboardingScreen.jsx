// frontend/src/screens/OnboardingScreen.jsx
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
      // CMI already saved via individual answer submissions
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
      await fetch(`${API_URL}/onboarding/dealbreakers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      setDealbreakersData(data);
      // Onboarding complete - redirect to app
      navigate('/app');
    } catch (error) {
      console.error('Error saving dealbreakers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cheeto mx-auto mb-4"></div>
          <p className="text-gray-400">Saving your secrets...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
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
    </>
  );
};

export default OnboardingScreen;