"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, ArrowLeft, Loader2, CheckCircle2, X, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function RequestProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const checkUser = async () => {
    const firebaseUid = localStorage.getItem("firebase_uid")
    if (firebaseUid) {
      // User is logged in with Firebase, treat as authenticated
      setUser({ id: firebaseUid })
    }
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    window.location.href = '/profile'
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Camera error:', error)
      alert('Could not access camera. Please check permissions.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob(async (blob) => {
          if (blob) {
            await uploadImage(blob)
            stopCamera()
          }
        }, 'image/jpeg', 0.9)
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const blob = new Blob([file], { type: file.type })
    await uploadImage(blob)
    e.target.value = ''
  }

  const uploadImage = async (blob: Blob) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", blob, "product-request.jpg")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setImageUrl(data.url)
    } catch (error: any) {
      alert("Error uploading image: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!imageUrl) {
      alert('Please upload or capture an image')
      return
    }

    setSubmitting(true)

    try {
      const firebaseUid = localStorage.getItem("firebase_uid")
      if (!firebaseUid) {
        alert('Please sign in first')
        window.location.href = '/profile'
        return
      }

      const { error } = await supabase
        .from('product_requests')
        .insert([{
          user_id: firebaseUid,
          image_url: imageUrl,
          description: description || null,
          status: 'pending'
        }])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile/requests')
      }, 3000)
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#1E293B]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="container mx-auto max-w-3xl flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Request Product</h1>
          </div>
        </header>

        <div className="container mx-auto max-w-md px-4 py-16">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sign In Required</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Please sign in to request products
              </p>
            </div>

            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#1E293B] px-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Request Submitted!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Your product request has been submitted successfully.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your product will be listed on the website within 24 hours. / आपका उत्पाद 24 घंटे के भीतर वेबसाइट पर सूचीबद्ध कर दिया जाएगा।
            </p>
          </div>
          <p className="text-xs text-slate-400">Redirecting to your requests...</p>
        </div>
      </div>
    )
  }

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={stopCamera}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-300" />
            </button>
          </div>
          <p className="text-center text-white/70 text-sm mt-4">Tap the button to capture</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-3xl flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Request Product</h1>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Upload Product Image
          </h2>

          {!imageUrl ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                disabled={uploading}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center justify-center gap-3 p-6"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Take Photo
                </span>
              </button>

              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all flex flex-col items-center justify-center gap-3 p-6 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-green-600 dark:text-green-400 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {uploading ? 'Uploading...' : 'Upload from Gallery'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Product"
                  className="w-full h-auto"
                />
                <button
                  onClick={() => setImageUrl(null)}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {imageUrl && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-6">
            <Label htmlFor="description" className="text-lg font-semibold text-slate-900 dark:text-white mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any details about the product you want (color, size, specifications, etc.)"
              rows={4}
              className="w-full"
            />
          </div>
        )}

        {imageUrl && (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
