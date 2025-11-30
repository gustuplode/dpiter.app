"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoModal } from "./logo-modal"

export function CategoryHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const categories = [
    { name: "All", path: "/", icon: "apps" },
    { name: "Fashion", path: "/fashion", icon: "checkroom" },
    { name: "Gadgets", path: "/gadgets", icon: "devices" },
    { name: "Gaming", path: "/gaming", icon: "sports_esports" },
    { name: "Outfit", path: "/outfit", icon: "shopping_bag" },
  ]

  return (
    <>
      <div className="flex items-center justify-center gap-6 md:gap-8 py-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = pathname === category.path
          return (
            <Link
              key={category.name}
              href={category.path}
              className="flex flex-col items-center gap-1 min-w-[50px] group"
            >
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[#883223] text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-[#883223]/10"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{category.icon}</span>
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#883223] dark:text-[#d4a574]" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
