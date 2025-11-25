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
  const [cartCount, setCartCount] = useState(0)
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

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cartIds: string[] = JSON.parse(savedCart)
      setCartCount(cartIds.length)
    }

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

  // Not logged in - show auth form
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

        {/* Stats Grid */}
        <div className="px-4 -mt-4">
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/cart"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <span className="material-symbols-outlined text-primary text-3xl">shopping_cart</span>
              <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{cartCount}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">In Cart</p>
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
