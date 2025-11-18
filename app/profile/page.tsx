"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile
} from "firebase/auth"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { createClient } from "@/lib/supabase/client"
import { put } from "@vercel/blob"
import { ImageCropper } from "@/components/admin/image-cropper"
import { googleProvider } from "@/lib/firebase"

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
    const { data } = await supabase
      .from("user_profiles")
      .select("profile_image_url")
      .eq("user_id", userId)
      .single()
    
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

    setUploading(true)
    setShowCropper(false)
    
    try {
      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" })
      const blob = await put(`profile/${user.uid}/${Date.now()}.jpg`, file, {
        access: "public",
      })

      // Update Supabase user_profiles table
      const { error: upsertError } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.uid,
          profile_image_url: blob.url,
          updated_at: new Date().toISOString(),
        })

      if (upsertError) throw upsertError

      setProfileImage(blob.url)
      
      // Revoke the temporary URL
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl)
        setTempImageUrl(null)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image")
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

      // Update Supabase user_profiles table
      await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.uid,
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center pb-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97316]"></div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {user ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="relative group"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F97316]">
                      {profileImage ? (
                        <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-3xl font-bold">
                          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-2xl">edit</span>
                    </div>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {user.displayName || "User"}
                    </h2>
                    {user.emailVerified && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">more_vert</span>
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-[#F97316]">email</span>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-[#F97316]">calendar_today</span>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/wishlist" className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-red-500 text-3xl">favorite</span>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{wishlistCount}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Saved</p>
                </Link>
                
                <Link href="/profile/liked" className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">thumb_up</span>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{likedCount}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Likes</p>
                </Link>

                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                  <span className="material-symbols-outlined text-yellow-600 text-3xl">star</span>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{userRatings.length}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Reviews</p>
                </div>

                <Link href="/profile/requests" className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-purple-500 text-3xl">inventory_2</span>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{requestsCount}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Product Requests</p>
                </Link>
              </div>
            </div>

            {userRatings.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">rate_review</span>
                  My Reviews
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userRatings.map((rating) => (
                    <div key={rating.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 relative group">
                      <button
                        onClick={() => deleteRating(rating.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base">delete</span>
                      </button>
                      <div className="flex items-center gap-2 mb-2">
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
                        <p className="text-sm text-slate-700 dark:text-slate-300 pr-8">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/admin/login"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-medium transition-all text-center"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">admin_panel_settings</span>
                Admin Login
              </span>
            </Link>
          </div>
        ) : (
          <>
            {showAuthModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sign in to continue</h2>
                    <button
                      onClick={() => setShowAuthModal(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
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
                    className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-slate-700 dark:text-slate-200">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or use email</span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      placeholder="Email"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      placeholder="Password"
                    />

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F97316] text-white py-3 rounded-lg font-medium transition-all"
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                  </form>

                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setError("")
                    }}
                    className="text-[#F97316] hover:underline text-sm font-medium w-full text-center"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                  </button>

                  <Link
                    href="/admin/login"
                    className="block w-full text-center text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm font-medium"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center space-y-4">
              <span className="material-symbols-outlined text-[#F97316] text-6xl">person</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profile</h2>
              <p className="text-slate-600 dark:text-slate-400">Sign in to view your profile</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-3 rounded-lg font-medium"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>

      {showEditProfile && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit Profile</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#F97316]">
                  {profileImage ? (
                    <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-3xl font-bold">
                      {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  {uploading ? "Uploading..." : "Change Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  placeholder="Enter your name"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F97316] text-white py-3 rounded-lg font-medium transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showCropper && tempImageUrl && (
        <ImageCropper
          imageUrl={tempImageUrl}
          aspectRatio={1}
          cropWidth={400}
          cropHeight={400}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      <FooterLinks />
      <BottomNav />
    </div>
  )
}
