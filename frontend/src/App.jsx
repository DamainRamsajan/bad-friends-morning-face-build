// frontend/src/App.jsx - v1.0.0 Release
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'

// Public Screens
import HomeScreen from './screens/HomeScreen';
import LandingScreen from './screens/LandingScreen'
import FeaturesScreen from './screens/FeaturesScreen'
import InvestorScreen from './screens/InvestorScreen'

// Auth Screens
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'

// Onboarding Screens
import OnboardingScreen from './screens/OnboardingScreen'

// App Screens (Authenticated)
import DiscoverScreen from './screens/DiscoverScreen'
import MatchesScreen from './screens/MatchesScreen'
import ProfileScreen from './screens/ProfileScreen'
import SisterhoodScreen from './screens/SisterhoodScreen'

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cheeto mx-auto mb-4"></div>
      <p className="text-gray-400">Loading Bad Friends...</p>
    </div>
  </div>
)

function AppContent() {
  const { user, loading } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)
  const [userGender, setUserGender] = useState(null)
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setCheckingOnboarding(false)
        return
      }
      
      // First check localStorage for fast response
      const localFlag = localStorage.getItem('bf_onboarding_complete');
      if (localFlag === 'true') {
        console.log('Using localStorage flag - onboarding complete');
        setHasCompletedOnboarding(true);
        setCheckingOnboarding(false);
        return;
      }
      
      // Fallback to API check
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token
        const response = await fetch(`${API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json()
        
        console.log('API check - onboarding_complete:', data.profile?.onboarding_complete)
        
        if (data.success && data.profile) {
          const onboardingComplete = data.profile.onboarding_complete === true
          if (onboardingComplete) {
            localStorage.setItem('bf_onboarding_complete', 'true');
          }
          setHasCompletedOnboarding(onboardingComplete)
          setUserGender(data.profile.gender)
        }
      } catch (error) {
        console.error('Error checking onboarding:', error)
      } finally {
        setCheckingOnboarding(false)
      }
    }
    
    checkOnboardingStatus()
  }, [user])
  
  if (loading || checkingOnboarding) {
    return <LoadingScreen />
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingScreen />} />
      <Route path="/features" element={<FeaturesScreen />} />
      <Route path="/investors" element={<InvestorScreen />} />
      
      {/* Auth Routes */}
      <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/onboarding" />} />
      
      {/* Onboarding */}
      <Route path="/onboarding" element={user ? <OnboardingScreen /> : <Navigate to="/login" />} />
      
      {/* App Routes - No onboarding check needed (localStorage handles it) */}
      <Route path="/app" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
      <Route path="/app/feed" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
      <Route path="/app/discover" element={user ? <DiscoverScreen /> : <Navigate to="/login" />} />
      <Route path="/app/matches" element={user ? <MatchesScreen /> : <Navigate to="/login" />} />
      <Route path="/app/profile" element={user ? <ProfileScreen /> : <Navigate to="/login" />} />
      
      {/* Sisterhood - Women Only */}
      <Route 
        path="/app/sisterhood" 
        element={user && hasCompletedOnboarding && userGender === 'woman' ? <SisterhoodScreen /> : <Navigate to="/app" />} 
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
