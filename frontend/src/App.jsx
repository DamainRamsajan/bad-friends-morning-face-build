import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import MorningFaceCapture from './components/MorningFaceCapture'
import { useState, useEffect } from 'react'

function HomeScreen() {
  const [streak, setStreak] = useState(0)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch('http://localhost:8000/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setStreak(data.profile.streak_days || 0)
        setUserName(data.profile.name || data.profile.email?.split('@')[0] || 'Friend')
      }
    }
    fetchProfile()
  }, [])

  const handleUploadComplete = (newStreak) => {
    setStreak(newStreak)
  }

  return (
    <div className="min-h-screen bg-badfriends-bg p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🍜 Bad Friends</h1>
          <p className="text-gray-400">Morning faces. Bad jokes. Real matches.</p>
          {streak > 0 && (
            <div className="inline-block mt-2 px-3 py-1 bg-cheeto/20 border border-cheeto rounded-full">
              <span className="text-cheeto text-sm font-semibold">🔥 {streak} day streak</span>
            </div>
          )}
        </div>
        
        <MorningFaceCapture 
          onUploadComplete={handleUploadComplete}
          currentStreak={streak}
        />
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-gray-500 text-sm hover:text-gray-400 transition"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-badfriends-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <HomeScreen /> : <Navigate to="/login" />} />
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
