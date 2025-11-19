"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { UserAvatar } from './user-avatar'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 flex justify-around items-center z-20 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="text-xs font-medium">Home</span>
      </Link>
      <Link 
        href="/cart" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/cart' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="text-xs font-medium">Cart</span>
      </Link>
      <Link 
        href="/offers" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/offers' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <span className="material-symbols-outlined">sell</span>
        <span className="text-xs font-medium">Offers</span>
      </Link>
      <Link 
        href="/profile" 
        className={`flex flex-col items-center justify-center gap-1 ${pathname === '/profile' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <UserAvatar size="xs" showFallback={false} />
        </div>
        <span className="text-xs font-medium">Account</span>
      </Link>
    </nav>
  )
}
