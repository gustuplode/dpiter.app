"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { UserAvatar } from './user-avatar'
import { useState, useEffect } from 'react'

export function BottomNav() {
  const pathname = usePathname()
  const [cartPulse, setCartPulse] = useState(false)

  useEffect(() => {
    const handleCartAdded = () => {
      setCartPulse(true)
      setTimeout(() => setCartPulse(false), 600)
    }
    
    window.addEventListener('cartAdded', handleCartAdded)
    return () => window.removeEventListener('cartAdded', handleCartAdded)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-50 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center gap-0 ${pathname === '/' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <span className="material-symbols-outlined text-xl">home</span>
        <span className="text-[9px] font-medium">Home</span>
      </Link>
      <Link 
        href="/cart" 
        className={`flex flex-col items-center justify-center gap-0 relative ${pathname === '/cart' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'} ${cartPulse ? 'animate-pulse' : ''}`}
      >
        <span className="material-symbols-outlined text-xl">shopping_cart</span>
        <span className="text-[9px] font-medium">Cart</span>
        {cartPulse && (
          <span className="absolute top-0 right-1/4 h-2 w-2 bg-primary rounded-full animate-ping"></span>
        )}
      </Link>
      <Link 
        href="/offers" 
        className={`flex flex-col items-center justify-center gap-0 ${pathname === '/offers' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <span className="material-symbols-outlined text-xl">sell</span>
        <span className="text-[9px] font-medium">Offers</span>
      </Link>
      <Link 
        href="/profile" 
        className={`flex flex-col items-center justify-center gap-0 ${pathname === '/profile' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <UserAvatar size="xs" showFallback={false} />
        </div>
        <span className="text-[9px] font-medium">Account</span>
      </Link>
    </nav>
  )
}
