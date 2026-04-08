import { useState, useEffect, useRef } from 'react'
import { supabase } from '../utils/supabaseClient'

function MorningFaceCapture({ onUploadComplete, currentStreak }) {
  const [step, setStep] = useState('camera')
  const [capturedImage, setCapturedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [streak, setStreak] = useState(currentStreak || 0)
  const [cameraReady, setCameraReady] = useState(false)
  
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Start camera on mount only once
  useEffect(() => {
    let mounted = true

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        })
        
        if (!mounted) return
        
        streamRef.current = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setCameraReady(true)
            }
          }
        }
      } catch (err) {
        if (mounted) {
          setError('Could not access camera. Please allow camera permissions.')
        }
      }
    }

    startCamera()

    // Cleanup on unmount
    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReady) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    
    // Stop camera stream after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const handleCapture = () => {
    const photo = capturePhoto()
    if (photo) {
      setCapturedImage(photo)
      setStep('preview')
      setCameraReady(false)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setStep('camera')
    setError(null)
    setCameraReady(false)
    
    // Restart camera
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    }).then(mediaStream => {
      streamRef.current = mediaStream
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true)
        }
      }
    }).catch(err => {
      setError('Could not access camera. Please allow camera permissions.')
    })
  }

  const handleUpload = async () => {
    if (!capturedImage) return
    
    setUploading(true)
    setError(null)
    
    try {
      // Convert base64 to blob
      const blob = await fetch(capturedImage).then(res => res.blob())
      const fileName = `${Date.now()}.jpg`
      const file = new File([blob], fileName, { type: 'image/jpeg' })
      
      // Upload to Supabase Storage
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
      const { error: storageError } = await supabase.storage
        .from('morning-faces')
        .upload(filePath, file)
      
      if (storageError) throw storageError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('morning-faces')
        .getPublicUrl(filePath)
      
      // Save to backend
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch('http://localhost:8000/morning-face', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          image_url: publicUrl,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }
      
      const result = await response.json()
      setStreak(result.streak_days)
      setStep('camera')
      setCapturedImage(null)
      onUploadComplete(result.streak_days)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (step === 'camera') {
    return (
      <div className="bg-badfriends-card rounded-xl overflow-hidden border border-badfriends-border">
        <div className="relative bg-black" style={{ minHeight: '300px' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover"
            style={{ minHeight: '300px' }}
          />
          {!cameraReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-white">Starting camera...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-red-500 text-center p-4">{error}</div>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-gray-400 text-sm text-center mb-4">
            No makeup. No filters. No good lighting.
            Just you, fresh from bed.
          </p>
          
          <button
            onClick={handleCapture}
            disabled={!cameraReady}
            className="w-full py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📸 Take Morning Face
          </button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="bg-badfriends-card rounded-xl overflow-hidden border border-badfriends-border">
        <div className="bg-black flex items-center justify-center" style={{ minHeight: '300px' }}>
          <img src={capturedImage} alt="Preview" className="w-full h-auto object-cover" />
        </div>
        
        <div className="p-4 space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              disabled={uploading}
              className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              Retake
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-3 bg-cheeto text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload ✓'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default MorningFaceCapture
