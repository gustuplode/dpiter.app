"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogoModal } from './logo-modal'
import { UserAvatar } from './user-avatar'

export function BottomNav() {
  const pathname = usePathname()
  const [wishlistFlash, setWishlistFlash] = useState(false)
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false)

  useEffect(() => {
    const handleWishlistAdded = () => {
      setWishlistFlash(true)
      setTimeout(() => setWishlistFlash(false), 1000)
    }
    
    window.addEventListener('wishlistAdded', handleWishlistAdded)
    return () => window.removeEventListener('wishlistAdded', handleWishlistAdded)
  }, [])

  return (
    <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-20">
          <Link
            href="/"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span
              className="material-symbols-outlined text-lg md:text-4xl"
              style={{ fontVariationSettings: pathname === "/" ? "'FILL' 1" : "'FILL' 0" }}
            >
              home
            </span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Home</span>
          </Link>

          <button 
            onClick={() => setIsLogoModalOpen(true)}
            className="relative bg-white rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center shadow-lg transform transition-all hover:scale-105 overflow-hidden p-0"
          >
            <img 
              src="/images/design-mode/1000007078-01_imgupscaler_imgupscaler.ai_V1%28Fast%29_2K%20%282%29%20%281%29%20%281%29.jpg"
              alt="Dpiter"
              className="w-full h-full object-cover rounded-full"
            />
          </button>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center transition-all ${
              wishlistFlash
                ? "text-red-500 scale-110"
                : pathname === "/wishlist"
                ? "text-[#3B82F6]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#3B82F6] dark:hover:text-[#3B82F6]"
            }`}
          >
            <span className={`material-symbols-outlined text-lg md:text-4xl transition-all ${wishlistFlash ? 'animate-pulse' : ''}`}>
              {wishlistFlash ? 'favorite' : 'favorite_border'}
            </span>
            <span className="text-[9px] md:text-sm font-medium mt-0.5">Wishlist</span>
          </Link>
        </div>
      </div>

      <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    </footer>
  )
}
