"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: "home", fill: true },
    { href: "/search", label: "Search", icon: "search", fill: false },
    { href: "/wishlist", label: "Wishlist", icon: "favorite_border", fill: false },
    { href: "/admin/login", label: "Profile", icon: "person_outline", fill: false },
  ]

  return (
    <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-900 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-around items-center h-20 relative">
          <Link
            href="/"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl md:text-4xl"
              style={{ fontVariationSettings: pathname === "/" ? "'FILL' 1" : "'FILL' 0" }}
            >
              home
            </span>
            <span className="text-xs md:text-sm font-semibold mt-0.5">Home</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/search"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-4xl">search</span>
            <span className="text-xs md:text-sm font-semibold mt-0.5">Search</span>
          </Link>

          <div className="absolute -top-10 md:-top-12">
            <Link href="/">
              <button className="bg-[#F97316] text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                <span className="material-symbols-outlined text-3xl md:text-4xl">shopping_bag</span>
              </button>
            </Link>
            <span className="text-center block text-[10px] md:text-xs font-semibold mt-1 md:mt-2 text-slate-600 dark:text-slate-400">
              Dpiter
            </span>
          </div>

          <div className="w-16 md:w-20"></div>

          <Link
            href="/wishlist"
            className={`flex flex-col items-center transition-colors ${
              pathname === "/wishlist"
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-4xl">favorite_border</span>
            <span className="text-xs md:text-sm font-semibold mt-0.5">Wishlist</span>
          </Link>

          <Link
            href="/admin/login"
            className={`flex flex-col items-center transition-colors ${
              pathname.startsWith("/admin")
                ? "text-[#F97316]"
                : "text-slate-600 dark:text-slate-400 hover:text-[#F97316] dark:hover:text-[#F97316]"
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-4xl">person_outline</span>
            <span className="text-xs md:text-sm font-semibold mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
