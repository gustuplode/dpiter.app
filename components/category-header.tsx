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
      <div className="flex items-center justify-center gap-5 md:gap-8 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = pathname === category.path
          return (
            <Link key={category.name} href={category.path} className="flex flex-col items-center gap-1.5 min-w-[48px]">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-[#883223] text-white shadow-lg shadow-[#883223]/30"
                    : "bg-gray-50 text-gray-600 hover:bg-[#883223]/10 hover:text-[#883223]"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{category.icon}</span>
              </div>
              <span
                className={`text-[11px] font-medium transition-colors ${isActive ? "text-[#883223]" : "text-gray-500"}`}
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
