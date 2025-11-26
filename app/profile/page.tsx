"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/client"
import {
  Heart,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Camera,
  MapPin,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [error, setError] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        setAvatarUrl(user.photoURL)
        fetchUserStats(user.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchUserStats = async (userId: string) => {
    const supabase = createClient()

    const { count: wishlist } = await supabase
      .from("wishlists")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    const { count: reviews } = await supabase
      .from("product_ratings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    setWishlistCount(wishlist || 0)
    setReviewCount(reviews || 0)
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (authMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const { url } = await put(`avatars/${user.uid}/${file.name}`, file, { access: "public" })
      setAvatarUrl(url)
      // Update Firebase profile
      await updateProfile(user, { photoURL: url })
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="w-full px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white text-4xl">person</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {authMode === "signin" ? "Sign in to access your account" : "Sign up to get started"}
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors mb-4"
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
              <span className="font-medium text-foreground">Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {authMode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-muted-foreground mt-5">
              {authMode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
                className="text-orange-500 font-medium"
              >
                {authMode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>

            <div className="mt-6 text-center">
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 pt-8 pb-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full border-3 border-white/30 overflow-hidden cursor-pointer shadow-lg bg-white/10"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarUrl ? (
                  <img src={avatarUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">person</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{user.displayName || "User"}</h1>
              <p className="text-white/80 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="max-w-lg mx-auto px-4 -mt-12">
        <div className="bg-card rounded-xl shadow-lg p-5 border border-border">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/wishlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wishlistCount}</p>
                <p className="text-sm text-muted-foreground">Wishlist</p>
              </div>
            </Link>
            <Link
              href="/profile/reviews"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{reviewCount}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Link
            href="/profile/liked"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-foreground">Liked Products</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/orders"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-foreground">My Orders</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/addresses"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-foreground">Saved Addresses</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-foreground">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            href="/privacy-policy"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-foreground">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link
            href="/profile/settings"
            className="flex items-center justify-between p-4 border-b border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-foreground">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-red-500">Sign Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
