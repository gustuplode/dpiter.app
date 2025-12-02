"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LogoModal } from "./logo-modal"

const categoryCache = new Map<string, { timestamp: number; visited: boolean }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function CategoryHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const categories = useMemo(
    () => [
      { name: "All", path: "/", image: "/all-products-colorful-grid.jpg" },
      { name: "Fashion", path: "/fashion", image: "/fashion-dress-clothing.jpg" },
      { name: "Gadgets", path: "/gadgets", image: "/smartphone-gadgets-electronics.jpg" },
      { name: "Gaming", path: "/gaming", image: "/gaming-controller-console.jpg" },
      { name: "Outfit", path: "/outfit", image: "/outfit-clothes-style.jpg" },
      { name: "Beauty", path: "/collections/beauty", image: "/beauty-cosmetics-makeup.jpg" },
      { name: "Home", path: "/collections/home", image: "/cozy-living-room.png" },
    ],
    [],
  )

  const handleCategoryClick = useCallback(
    (e: React.MouseEvent, path: string, name: string) => {
      e.preventDefault()

      // Don't do anything if already on this path
      if (pathname === path) return

      // Check if this path was recently visited (cached)
      const cached = categoryCache.get(path)
      const now = Date.now()

      if (cached && now - cached.timestamp < CACHE_DURATION) {
        // Use client-side navigation without showing loading state for cached pages
        router.push(path, { scroll: false })
        return
      }

      // Show loading for uncached navigation
      setLoadingCategory(name)

      // Mark as visited
      categoryCache.set(path, { timestamp: now, visited: true })

      // Navigate
      router.push(path, { scroll: false })

      // Clear loading state after navigation
      setTimeout(() => setLoadingCategory(null), 500)
    },
    [pathname, router],
  )

  return (
    <>
      <div className="bg-white dark:bg-gray-900 py-3 lg:py-4 border-b border-gray-100 dark:border-gray-800">
        <div
          className="w-full px-4 lg:px-8 flex items-center justify-start lg:justify-center gap-5 lg:gap-10 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {categories.map((category) => {
            const isActive = pathname === category.path
            const isLoading = loadingCategory === category.name
            return (
              <a
                key={category.name}
                href={category.path}
                onClick={(e) => handleCategoryClick(e, category.path, category.name)}
                className="flex flex-col items-center gap-1.5 lg:gap-2 min-w-[52px] lg:min-w-[64px] group"
              >
                <div
                  className={`relative w-11 h-11 lg:w-14 lg:h-14 rounded-full overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "ring-[1.5px] ring-[#883223] ring-offset-1"
                      : "group-hover:ring-1 group-hover:ring-gray-300 group-hover:ring-offset-1"
                  }`}
                >
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] lg:text-xs font-medium text-center transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#883223]"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {category.name}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
