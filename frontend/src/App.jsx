import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { supabase } from './utils/supabaseClient'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'

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
      <Route path="/" element={
        user ? (
          <div className="min-h-screen bg-badfriends-bg flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">🍜 Bad Friends</h1>
              <p className="text-gray-400 mb-4">Welcome, {user.user_metadata?.name || user.email}!</p>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 bg-cheeto text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : <Navigate to="/login" />
      } />
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
