"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from "firebase/auth"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { createClient } from "@/lib/supabase/client"
import { ImageCropper } from "@/components/admin/image-cropper"
import { googleProvider } from "@/lib/firebase"
import { Camera, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userRatings, setUserRatings] = useState<any[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)
  const [requestsCount, setRequestsCount] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        localStorage.setItem("firebase_uid", currentUser.uid)
        setDisplayName(currentUser.displayName || "")
        await loadUserData(currentUser.uid)
        await loadProfileImage(currentUser.uid)
      } else {
        const timer = setTimeout(() => {
          setShowAuthModal(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadProfileImage = async (userId: string) => {
    const { data } = await supabase.from("user_profiles").select("profile_image_url").eq("user_id", userId).single()

    if (data?.profile_image_url) {
      setProfileImage(data.profile_image_url)
    } else if (auth.currentUser?.photoURL) {
      setProfileImage(auth.currentUser.photoURL)
    }
  }

  const loadUserData = async (userId: string) => {
    // Load ratings
    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (ratings) {
      setUserRatings(ratings)
    }

    // Load likes count
    const { count: likesCount } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    setLikedCount(likesCount || 0)

    // Load wishlist count
    const products = localStorage.getItem("wishlist")
    const collections = localStorage.getItem("wishlist_collections")
    const productCount = products ? JSON.parse(products).length : 0
    const collectionCount = collections ? JSON.parse(collections).length : 0
    setWishlistCount(productCount + collectionCount)

    // Load product requests count
    const { count: reqCount } = await supabase
      .from("product_requests")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    setRequestsCount(reqCount || 0)

    const loadCartCount = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const ids: string[] = JSON.parse(savedCart)
        return ids.length
      }
      return 0
    }

    setCartCount(loadCartCount())
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return

    const file = e.target.files[0]
    const imageUrl = URL.createObjectURL(file)
    setTempImageUrl(imageUrl)
    setShowCropper(true)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return

    console.log("[v0] Starting profile image upload process")
    setUploading(true)
    setShowCropper(false)

    try {
      console.log("[v0] User ID:", user.uid)

      const formData = new FormData()
      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" })
      formData.append("file", file)
      formData.append("userId", user.uid)

      console.log("[v0] Uploading to blob storage...")
      const response = await fetch("/api/upload-profile", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Upload failed:", errorText)
        throw new Error(`Upload failed: ${errorText}`)
      }

      const { url } = await response.json()
      console.log("[v0] Upload successful, URL:", url)

      console.log("[v0] Updating database with new profile image...")
      const { error: upsertError } = await supabase.from("user_profiles").upsert(
        {
          user_id: user.uid,
          profile_image_url: url,
          display_name: user.displayName || user.email?.split("@")[0] || "User",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        },
      )

      if (upsertError) {
        console.error("[v0] Error upserting profile image:", upsertError)
        throw new Error(`Database update failed: ${upsertError.message}`)
      }

      console.log("[v0] Profile image updated successfully!")
      setProfileImage(url)
      setShowEditProfile(false)

      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
        setTempImageUrl(null)
      }
    } catch (error: any) {
      console.error("[v0] Error in handleCropComplete:", error)
      setError(error.message || "Failed to upload profile picture")
    } finally {
      setUploading(false)
    }
  }

  const handleCropCancel = () => {
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl)
      setTempImageUrl(null)
    }
    setShowCropper(false)
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      await updateProfile(user, {
        displayName: displayName,
      })

      await supabase.from("user_profiles").upsert(
        {
          user_id: user.uid,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        },
      )

      setShowEditProfile(false)
      setUser({ ...user, displayName })
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile")
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      await signInWithPopup(auth, googleProvider)
      setShowAuthModal(false)
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
      setShowAuthModal(false)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setShowMenu(false)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const deleteRating = async (ratingId: string) => {
    try {
      await supabase.from("ratings").delete().eq("id", ratingId)
      if (user) {
        loadUserData(user.uid)
      }
    } catch (error) {
      console.error("Error deleting rating:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center pb-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Using main SearchHeader from layout */}
      {/* <SearchHeader /> */}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {user ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-6">
                <button onClick={() => setShowEditProfile(true)} className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl font-bold">
                        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">edit</span>
                  </div>
                </button>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {user.displayName || "User"}
                  </h2>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{user.email}</p>
                  {user.emailVerified && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verified
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                      more_vert
                    </span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-primary">email</span>
                          <div>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Email</p>
                            <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-primary">calendar_today</span>
                          <div>
                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                              Member Since
                            </p>
                            <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                              {user.metadata.creationTime
                                ? new Date(user.metadata.creationTime).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/admin/login"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                        <span className="text-sm font-medium">Admin Login</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/wishlist"
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {wishlistCount}
                  </p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Wishlist</p>
                </Link>

                <Link
                  href="/profile/liked"
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{likedCount}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Liked</p>
                </Link>

                <Link
                  href="/cart"
                  className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">{cartCount}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Cart</p>
                </Link>

                <div className="text-center p-3">
                  <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {userRatings.length}
                  </p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Reviews</p>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/profile/requests"
                  className="block text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors"
                >
                  <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {requestsCount}
                  </p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Product Requests
                  </p>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link href="/request-product">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Camera className="h-4 w-4 mr-2" />
                    Request Product
                  </Button>
                </Link>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // PWA install prompt
                    if ("serviceWorker" in navigator) {
                      alert('To install the app, tap the share button and select "Add to Home Screen"')
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              </div>
            </div>

            {userRatings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">rate_review</span>
                  My Reviews
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 relative group"
                    >
                      <button
                        onClick={() => deleteRating(rating.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base">
                          delete
                        </span>
                      </button>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-base"
                              style={{
                                color: i < rating.rating ? "#F97316" : "#CBD5E1",
                                fontVariationSettings: i < rating.rating ? "'FILL' 1" : "'FILL' 0",
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-text-primary-light dark:text-text-primary-dark pr-8">
                          {rating.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {showAuthModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                      Sign in to continue
                    </h2>
                    <button
                      onClick={() => setShowAuthModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
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
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-text-primary-light dark:text-text-primary-dark">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
                        Or use email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Email"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Password"
                    />

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all"
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                  </form>

                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError("")
                    }}
                    className="text-primary hover:underline text-sm font-medium w-full text-center"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark">
                        Admin?
                      </span>
                    </div>
                  </div>

                  <a
                    href="/admin/login"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    <span>Admin Login</span>
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center space-y-4 border border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined text-primary text-6xl">person</span>
              <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Profile</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Sign in to view your profile</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>

      {showCropper && tempImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Crop Profile Picture
            </h3>
            <ImageCropper
              imageUrl={tempImageUrl}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
              aspectRatio={1}
            />
          </div>
        </div>
      )}

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Profile Picture
                </label>
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="w-full mt-1" />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleUpdateProfile}
                  disabled={uploading}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {uploading ? "Uploading..." : "Save Changes"}
                </Button>
                <Button onClick={() => setShowEditProfile(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
      <FooterLinks />
    </div>
  )
}
