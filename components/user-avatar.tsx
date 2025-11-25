"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { createClient } from "@/lib/supabase/client"

interface UserAvatarProps {
  size?: "sm" | "md" | "lg" | "xs"
  showFallback?: boolean
}

export function UserAvatar({ size = "md", showFallback = true }: UserAvatarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Try to load from localStorage first to prevent flicker
    const cachedImage = localStorage.getItem('user_profile_image')
    if (cachedImage) {
      setProfileImage(cachedImage)
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Load profile image from Supabase
        const { data } = await supabase
          .from("user_profiles")
          .select("profile_image_url")
          .eq("user_id", currentUser.uid)
          .single()
        
        if (data?.profile_image_url) {
          setProfileImage(data.profile_image_url)
          localStorage.setItem('user_profile_image', data.profile_image_url)
        } else if (currentUser.photoURL) {
          setProfileImage(currentUser.photoURL)
          localStorage.setItem('user_profile_image', currentUser.photoURL)
        }
      } else {
        setProfileImage(null)
        localStorage.removeItem('user_profile_image')
      }
    })

    const channel = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
        },
        (payload: any) => {
          if (auth.currentUser && payload.new.user_id === auth.currentUser.uid) {
            setProfileImage(payload.new.profile_image_url)
            localStorage.setItem('user_profile_image', payload.new.profile_image_url)
          }
        }
      )
      .subscribe()

    return () => {
      unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [])

  const sizeClasses = {
    xs: "size-6",
    sm: "size-8",
    md: "size-9",
    lg: "size-12"
  }

  const content = profileImage ? (
    <img 
      src={profileImage || "/placeholder.svg"} 
      alt={user?.displayName || "User"} 
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white text-sm font-bold">
      {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
    </div>
  )

  if (!user && !showFallback) {
    return null
  }

  if (!user) {
    return (
      <div className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700`}>
        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-xl">person</span>
      </div>
    )
  }

  return (
    <div className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-[#F97316]`}>
      {content}
    </div>
  )
}
