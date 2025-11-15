"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { auth, googleProvider } from "@/lib/firebase"
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showGooglePrompt, setShowGooglePrompt] = useState(false)
  const [userRatings, setUserRatings] = useState<any[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      
      if (currentUser) {
        loadUserData(currentUser.uid)
      } else {
        const timer = setTimeout(() => {
          setShowGooglePrompt(true)
        }, 2000)
        return () => clearTimeout(timer)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    
    if (ratings) {
      setUserRatings(ratings)
    }

    const products = localStorage.getItem("wishlist")
    const collections = localStorage.getItem("wishlist_collections")
    const productCount = products ? JSON.parse(products).length : 0
    const collectionCount = collections ? JSON.parse(collections).length : 0
    setWishlistCount(productCount + collectionCount)
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      await signInWithPopup(auth, googleProvider)
      setShowGooglePrompt(false)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError("")
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      setEmail("")
      setPassword("")
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center pb-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-32">
        <div className="max-w-md mx-auto">
          {user ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {user.displayName || "User"}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{user.email}</p>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      <span className="material-symbols-outlined text-base">verified</span>
                      Verified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/wishlist" className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl hover:shadow-md transition-shadow">
                    <span className="material-symbols-outlined text-red-500 text-3xl">favorite</span>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{wishlistCount}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Wishlist Items</p>
                  </Link>
                  
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                    <span className="material-symbols-outlined text-[#F97316] text-3xl">star</span>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{userRatings.length}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Reviews Given</p>
                  </div>
                </div>

                <div className="space-y-3 border-t dark:border-slate-700 pt-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <span className="material-symbols-outlined text-[#F97316]">email</span>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <span className="material-symbols-outlined text-[#F97316]">calendar_today</span>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Sign Out
                </button>
              </div>

              {userRatings.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">rate_review</span>
                    My Reviews
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userRatings.map((rating) => (
                      <div key={rating.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className="material-symbols-outlined text-base"
                                style={{
                                  color: i < rating.rating ? "#F97316" : "#CBD5E1",
                                  fontVariationSettings: i < rating.rating ? "'FILL' 1" : "'FILL' 0"
                                }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-slate-700 dark:text-slate-300">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/admin/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin Login
                </span>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {isSignUp ? "Sign up to get started" : "Sign in to your account"}
                </p>
              </div>

              <Link
                href="/admin/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin Login
                </span>
              </Link>

              {showGooglePrompt && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-pulse">
                  <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <span className="material-symbols-outlined">info</span>
                    Quick sign in with Google available!
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-slate-700 dark:text-slate-200">Continue with Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F97316] text-white py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError("")
                  }}
                  className="text-[#F97316] hover:underline text-sm font-medium"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <FooterLinks />
      <BottomNav />
    </div>
  )
}
