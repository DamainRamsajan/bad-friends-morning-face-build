import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password, phone, gender, name)
      alert('Registration successful! Please check your email to confirm.')
      // Clear form
      setEmail('')
      setPassword('')
      setPhone('')
      setName('')
      setGender('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-badfriends-bg flex items-center justify-center p-4">
      <div className="bg-badfriends-card rounded-xl p-8 w-full max-w-md border border-badfriends-border">
        <h1 className="text-3xl font-bold text-white text-center mb-6">🍜 Join Bad Friends</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          />
          
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 bg-[#1a1f2e] border border-badfriends-border rounded-lg text-white focus:outline-none focus:border-cheeto"
            required
          >
            <option value="">Select Gender</option>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="non_binary">Non-binary</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-4">
          Already have an account? <a href="/login" className="text-cheeto hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterScreen
