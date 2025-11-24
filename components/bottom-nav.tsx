"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserAvatar } from "./user-avatar"
import { useState, useEffect } from "react"

export function BottomNav() {
  const pathname = usePathname()
  const [cartPulse, setCartPulse] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const loadCartCount = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const ids: string[] = JSON.parse(savedCart)
        setCartCount(ids.length)
      }
    }

    loadCartCount()

    const handleCartAdded = () => {
      setCartPulse(true)
      setTimeout(() => setCartPulse(false), 600)
      loadCartCount()
    }

    const handleCartUpdated = () => {
      loadCartCount()
    }

    window.addEventListener("cartAdded", handleCartAdded)
    window.addEventListener("cartUpdated", handleCartUpdated)

    return () => {
      window.removeEventListener("cartAdded", handleCartAdded)
      window.removeEventListener("cartUpdated", handleCartUpdated)
    }
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-50 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center gap-0 ${pathname === "/" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <span className="material-symbols-outlined text-xl">home</span>
        <span className="text-[9px] font-medium">Home</span>
      </Link>
      <Link
        href="/cart"
        className={`flex flex-col items-center justify-center gap-0 relative ${pathname === "/cart" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"} ${cartPulse ? "animate-pulse" : ""}`}
      >
        <span className="material-symbols-outlined text-xl">shopping_cart</span>
        <span className="text-[9px] font-medium">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
        {cartPulse && <span className="absolute top-0 right-1/4 h-2 w-2 bg-primary rounded-full animate-ping"></span>}
      </Link>
      <Link
        href="/offers"
        className={`flex flex-col items-center justify-center gap-0 ${pathname === "/offers" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <span className="material-symbols-outlined text-xl">sell</span>
        <span className="text-[9px] font-medium">Offers</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center gap-0 ${pathname === "/profile" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <UserAvatar size="sm" showFallback={true} />
        </div>
        <span className="text-[9px] font-medium">Account</span>
      </Link>
    </nav>
  )
}
