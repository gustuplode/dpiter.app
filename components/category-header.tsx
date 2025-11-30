"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoModal } from "./logo-modal"

export function CategoryHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const categories = [
    { name: "All", path: "/", icon: "apps", color: "from-orange-500 to-red-500" },
    { name: "Fashion", path: "/fashion", icon: "checkroom", color: "from-pink-500 to-rose-500" },
    { name: "Gadgets", path: "/gadgets", icon: "devices", color: "from-blue-500 to-indigo-500" },
    { name: "Gaming", path: "/gaming", icon: "sports_esports", color: "from-purple-500 to-violet-500" },
    { name: "Outfit", path: "/outfit", icon: "shopping_bag", color: "from-teal-500 to-emerald-500" },
  ]

  return (
    <>
      <div className="bg-white dark:bg-gray-900 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide px-4">
          {categories.map((category) => {
            const isActive = pathname === category.path
            return (
              <Link
                key={category.name}
                href={category.path}
                className="flex flex-col items-center gap-2 min-w-[56px] group"
              >
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${category.color} text-white shadow-lg scale-105`
                      : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 group-hover:scale-105"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">{category.icon}</span>
                  {isActive && (
                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${category.color} rounded-2xl opacity-20 blur-md -z-10`}
                    />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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
