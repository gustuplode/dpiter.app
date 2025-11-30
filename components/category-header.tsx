"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoModal } from "./logo-modal"

export function CategoryHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const categories = [
    {
      name: "All",
      path: "/",
      image: "/all-products-colorful-grid.jpg",
    },
    {
      name: "Fashion",
      path: "/fashion",
      image: "/fashion-dress-clothing.jpg",
    },
    {
      name: "Gadgets",
      path: "/gadgets",
      image: "/smartphone-gadgets-electronics.jpg",
    },
    {
      name: "Gaming",
      path: "/gaming",
      image: "/gaming-controller-console.jpg",
    },
    {
      name: "Outfit",
      path: "/outfit",
      image: "/outfit-clothes-style.jpg",
    },
    {
      name: "Beauty",
      path: "/collections/beauty",
      image: "/beauty-cosmetics-makeup.jpg",
    },
    {
      name: "Home",
      path: "/collections/home",
      image: "/cozy-living-room.png",
    },
  ]

  return (
    <>
      <div className="bg-white dark:bg-gray-900 py-3 border-t border-gray-100 dark:border-gray-800">
        <div
          className="flex items-center gap-4 px-4 overflow-x-auto"
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
            return (
              <Link
                key={category.name}
                href={category.path}
                className="flex flex-col items-center gap-1.5 min-w-[60px] group"
              >
                <div
                  className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "ring-2 ring-orange-500 ring-offset-2"
                      : "group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-1"
                  }`}
                >
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`text-[11px] font-medium text-center transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
