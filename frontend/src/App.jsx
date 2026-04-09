// frontend/src/App.jsx - CORRECTED VERSION (No broken import)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'

// Public Screens
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

// HomeScreen Component (inline since it was never extracted)
const HomeScreen = () => {
  const [streak, setStreak] = useState(0)
  const [userName, setUserName] = useState('')
  const [hasUploadedToday, setHasUploadedToday] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  useEffect(() => {
    fetchProfile()
  }, [])
  
  const fetchProfile = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setStreak(data.profile.streak_days || 0)
        setUserName(data.profile.name || data.profile.email?.split('@')[0] || 'Friend')
        if (data.profile.last_morning_face) {
          const lastUpload = new Date(data.profile.last_morning_face).toISOString().split('T')[0]
          const today = new Date().toISOString().split('T')[0]
          setHasUploadedToday(lastUpload === today)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">🍜 Bad Friends</h1>
          <p className="text-gray-400 text-sm">Morning faces. Bad jokes. Real matches.</p>
          {streak > 0 && (
            <div className="inline-block mt-2 px-3 py-1 bg-cheeto/20 border border-cheeto rounded-full">
              <span className="text-cheeto text-xs font-semibold">🔥 {streak} day streak</span>
            </div>
          )}
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-4">
          <h2 className="text-white font-semibold mb-2">🌅 Morning Face</h2>
          <p className="text-gray-400 text-xs mb-3">Coming soon...</p>
        </div>
        
        <div className="text-center mt-6">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 text-xs hover:text-gray-400 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

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
  
  try {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    
    if (data.success && data.profile) {
      // Check if onboarding is complete using the new column
      const onboardingComplete = data.profile.onboarding_complete === true
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
      
      {/* App Routes */}
      <Route path="/app" element={user && hasCompletedOnboarding ? <HomeScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/feed" element={user && hasCompletedOnboarding ? <HomeScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/discover" element={user && hasCompletedOnboarding ? <DiscoverScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/matches" element={user && hasCompletedOnboarding ? <MatchesScreen /> : <Navigate to="/onboarding" />} />
      <Route path="/app/profile" element={user && hasCompletedOnboarding ? <ProfileScreen /> : <Navigate to="/onboarding" />} />
      
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