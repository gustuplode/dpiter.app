"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogoModal } from "./logo-modal"

interface CategoryHeaderProps {
  fashionCount?: number
  gadgetsCount?: number
  gamingCount?: number
  allProductsCount?: number
}

export function CategoryHeader({
  fashionCount = 0,
  gadgetsCount = 0,
  gamingCount = 0,
  allProductsCount = 0,
}: CategoryHeaderProps) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    {
      name: "Gadget",
      path: "/gadgets",
      icon: "phone_iphone",
    },
    {
      name: "Fashion",
      path: "/fashion",
      icon: "styler",
    },
    {
      name: "Gaming",
      path: "/gaming",
      icon: "sports_esports",
    },
    {
      name: "Outfit",
      path: "/outfit",
      icon: "apparel",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-4 gap-3 mb-4 px-4">
        {categories.map((category) => {
          const isActive = pathname === category.path
          return (
            <Link
              key={category.name}
              href={category.path}
              className="flex flex-col items-center justify-start gap-1 text-center group"
            >
              <div
                className={`flex items-center justify-center aspect-square rounded-full size-11 transition-all duration-200 group-active:scale-95 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary dark:bg-primary/10 text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
              </div>
              <p
                className={`text-[9px] font-medium leading-tight ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {category.name}
              </p>
            </Link>
          )
        })}
      </div>

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
