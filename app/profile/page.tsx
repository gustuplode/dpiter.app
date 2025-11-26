"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { UserAvatar } from "@/components/user-avatar"
import { auth, googleProvider } from "@/lib/firebase"
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth form states
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Store Firebase UID for ratings
        localStorage.setItem("firebase_uid", firebaseUser.uid)

        // Load avatar
        if (firebaseUser.photoURL) {
          setAvatarUrl(firebaseUser.photoURL)
        } else {
          const savedAvatar = localStorage.getItem(`avatar_${firebaseUser.uid}`)
          if (savedAvatar) setAvatarUrl(savedAvatar)
        }

        // Load review count from localStorage
        const ratings = localStorage.getItem("user_ratings_count")
        setReviewCount(ratings ? Number.parseInt(ratings) : 0)
      }

      setLoading(false)
    })

    // Load counts
    const products = localStorage.getItem("wishlist")
    const collections = localStorage.getItem("wishlist_collections")
    const productCount = products ? JSON.parse(products).length : 0
    const collectionCount = collections ? JSON.parse(collections).length : 0
    setWishlistCount(productCount + collectionCount)

    const liked = localStorage.getItem("liked_products")
    setLikedCount(liked ? JSON.parse(liked).length : 0)

    return () => unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setEmail("")
      setPassword("")
    } catch (error: any) {
      setAuthError(error.message.replace("Firebase: ", ""))
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setAuthSuccess("Account created successfully!")
      setEmail("")
      setPassword("")
    } catch (error: any) {
      setAuthError(error.message.replace("Firebase: ", ""))
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      setAuthError(error.message.replace("Firebase: ", ""))
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    setProfileDropdownOpen(false)
    setAvatarUrl(null)
    localStorage.removeItem("firebase_uid")
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setAvatarUrl(base64)
      localStorage.setItem(`avatar_${user.uid}`, base64)
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Not logged in - show auth form with Firebase
  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white text-4xl">person</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
              {authMode === "signin" ? "Sign in to access your account" : "Sign up to get started"}
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={authLoading}
            className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 mb-4 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={authMode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {authError}
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
                {authSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : authMode === "signin" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === "signin" ? "signup" : "signin")
                setAuthError(null)
                setAuthSuccess(null)
              }}
              className="text-primary hover:underline text-sm"
            >
              {authMode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Admin Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Logged in - show profile
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 pt-8 pb-16 px-4 relative">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img src={avatarUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserAvatar size="lg" showFallback={true} />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg"
              >
                <span className="material-symbols-outlined text-primary text-sm">edit</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">
                {user.displayName || user.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-white/80 text-sm">{user.email}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 bg-white/20 rounded-full"
              >
                <span className="material-symbols-outlined text-white">more_vert</span>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-lg mx-auto px-4 -mt-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
          <div className="grid grid-cols-3 gap-4">
            <Link href="/profile/reviews" className="text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-yellow-600">star</span>
              </div>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{reviewCount}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">My Reviews</p>
            </Link>
            <Link href="/wishlist" className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-red-600">favorite</span>
              </div>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{wishlistCount}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Wishlist</p>
            </Link>
            <Link href="/profile/liked" className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-blue-600">thumb_up</span>
              </div>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">{likedCount}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Liked</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
          Quick Actions
        </h2>
        <div className="space-y-2">
          <Link href="/profile/reviews" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-600">star</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary-light dark:text-text-primary-dark">My Reviews</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                View your ratings and reviews
              </p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
          <Link href="/wishlist" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600">favorite</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary-light dark:text-text-primary-dark">My Wishlist</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Products you saved for later
              </p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
          <Link href="/profile/liked" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">thumb_up</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Liked Products</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Products you liked</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
