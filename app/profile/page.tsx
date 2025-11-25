"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth form states
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Load avatar from user metadata
        const avatar = user.user_metadata?.avatar_url
        if (avatar) setAvatarUrl(avatar)

        // Try to load from localStorage as fallback
        const savedAvatar = localStorage.getItem(`avatar_${user.id}`)
        if (savedAvatar && !avatar) setAvatarUrl(savedAvatar)

        const { count } = await supabase
          .from("ratings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
        setReviewCount(count || 0)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const avatar = session.user.user_metadata?.avatar_url
        if (avatar) setAvatarUrl(avatar)
      }
    })

    // Load counts
    const products = localStorage.getItem("wishlist")
    const collections = localStorage.getItem("wishlist_collections")
    const productCount = products ? JSON.parse(products).length : 0
    const collectionCount = collections ? JSON.parse(collections).length : 0
    setWishlistCount(productCount + collectionCount)

    const liked = localStorage.getItem("liked_products")
    setLikedCount(liked ? JSON.parse(liked).length : 0)

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setEmail("")
      setPassword("")
    } catch (error: any) {
      setAuthError(error.message)
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
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) throw error

      setAuthSuccess("Check your email for the confirmation link!")
      setEmail("")
      setPassword("")
    } catch (error: any) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/profile`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setAuthError(error.message)
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfileDropdownOpen(false)
    setAvatarUrl(null)
    router.refresh()
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)

    try {
      // Create a data URL for the avatar
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string

        // Save to localStorage
        localStorage.setItem(`avatar_${user.id}`, dataUrl)
        setAvatarUrl(dataUrl)

        // Update user metadata
        const supabase = createClient()
        await supabase.auth.updateUser({
          data: { avatar_url: dataUrl },
        })

        setUploadingAvatar(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setUploadingAvatar(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not logged in - show auth form with Google Auth
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">My Account</h1>
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined text-white">more_vert</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <Link
                    href="/profile/settings"
                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-text-primary-light dark:text-text-primary-dark"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <span className="material-symbols-outlined text-base align-middle mr-2">settings</span>
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400"
                  >
                    <span className="material-symbols-outlined text-base align-middle mr-2">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                {avatarUrl ? (
                  <Image src={avatarUrl || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-white text-4xl">person</span>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                {uploadingAvatar ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                ) : (
                  <span className="material-symbols-outlined text-primary text-sm">edit</span>
                )}
              </button>
            </div>

            <div className="flex-1">
              <p className="text-white font-semibold text-lg">{user.email}</p>
              <p className="text-white/70 text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/profile/reviews"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <span className="material-symbols-outlined text-amber-500 text-3xl">star_rate</span>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
                {reviewCount}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">My Reviews</p>
            </Link>

            <Link
              href="/wishlist"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <span className="material-symbols-outlined text-red-500 text-3xl">favorite</span>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
                {wishlistCount}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Wishlist</p>
            </Link>

            <Link
              href="/profile/liked"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <span className="material-symbols-outlined text-blue-500 text-3xl">thumb_up</span>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
                {likedCount}
              </p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Liked</p>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3">
            Quick Actions
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
            <Link
              href="/profile/orders"
              className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">package_2</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">My Orders</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>

            <Link
              href="/profile/addresses"
              className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">location_on</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">Saved Addresses</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>

            <Link
              href="/profile/payments"
              className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">credit_card</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">Payment Methods</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>

            <Link href="/profile/requests" className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">help</span>
                <span className="text-text-primary-light dark:text-text-primary-dark">Help & Support</span>
              </div>
              <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </Link>
          </div>
        </div>

        {/* App Info */}
        <div className="px-4 mt-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">App Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
