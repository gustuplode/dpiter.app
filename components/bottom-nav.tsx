"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/admin/login", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-[#f8f6f5]/95 dark:bg-[#23150f]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left buttons */}
        <div className="flex gap-6">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="h-6 w-6" fill={isActive ? "currentColor" : "none"} strokeWidth={2} />
                <p className="text-xs font-medium">{item.label}</p>
              </Link>
            )
          })}
        </div>

        {/* Center logo */}
        <Link href="/" className="flex flex-col items-center gap-1 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white">
                <path
                  d="M12 2L2 7v10c0 5.5 3.84 10 10 10s10-4.5 10-10V7l-10-5z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold tracking-wider text-primary">DPITER</p>
        </Link>

        {/* Right buttons */}
        <div className="flex gap-6">
          {navItems.slice(2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith("/admin")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="h-6 w-6" fill={isActive ? "currentColor" : "none"} strokeWidth={2} />
                <p className="text-xs font-medium">{item.label}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
