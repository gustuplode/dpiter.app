"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserAvatar } from "./user-avatar"
import { useState, useEffect } from "react"

export function BottomNav() {
  const pathname = usePathname()
  const [wishlistPulse, setWishlistPulse] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const loadWishlistCount = () => {
      const savedWishlist = localStorage.getItem("wishlist")
      const savedCollections = localStorage.getItem("wishlist_collections")
      const productCount = savedWishlist ? JSON.parse(savedWishlist).length : 0
      const collectionCount = savedCollections ? JSON.parse(savedCollections).length : 0
      setWishlistCount(productCount + collectionCount)
    }

    loadWishlistCount()

    const handleWishlistAdded = () => {
      setWishlistPulse(true)
      setTimeout(() => setWishlistPulse(false), 600)
      loadWishlistCount()
    }

    const handleWishlistUpdated = () => {
      loadWishlistCount()
    }

    window.addEventListener("wishlistAdded", handleWishlistAdded)
    window.addEventListener("wishlistUpdated", handleWishlistUpdated)
    return () => {
      window.removeEventListener("wishlistAdded", handleWishlistAdded)
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated)
    }
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] ${pathname === "/" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: pathname === "/" ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link
        href="/wishlist"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] relative ${pathname === "/wishlist" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"} ${wishlistPulse ? "animate-pulse" : ""}`}
      >
        <div className="relative">
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: pathname === "/wishlist" ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Wishlist</span>
        {wishlistPulse && (
          <span className="absolute top-0 right-1/4 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
        )}
      </Link>
      <Link
        href="/offers"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] ${pathname === "/offers" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: pathname === "/offers" ? "'FILL' 1" : "'FILL' 0" }}
        >
          local_offer
        </span>
        <span className="text-[10px] font-medium">Offers</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[70px] ${pathname === "/profile" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <UserAvatar size="sm" showFallback={true} />
        </div>
        <span className="text-[10px] font-medium">Account</span>
      </Link>
    </nav>
  )
}
