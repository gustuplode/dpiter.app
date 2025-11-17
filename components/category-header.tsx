'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  allProductsCount = 0 
}: CategoryHeaderProps) {
  const pathname = usePathname()

  const categories = [
    {
      name: 'Outfit',
      path: '/',
      icon: '👔',
      image: '/stylish-streetwear-outfit.png',
    },
    {
      name: 'Fashion',
      path: '/fashion',
      icon: '👕',
      image: '/shirt-fashion.jpg',
    },
    {
      name: 'Gadgets',
      path: '/gadgets',
      icon: '⌚',
      image: '/gadget-device.jpg',
    },
    {
      name: 'Gaming',
      path: '/gaming',
      icon: '🎮',
      image: '/gaming-controller.png',
    },
    {
      name: 'All Products',
      path: '/all-products',
      icon: '📦',
      image: '/all-products.jpg',
    },
  ]

  return (
    <div className="bg-white dark:bg-slate-800 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700 shadow-sm py-2">
      <div className="container mx-auto max-w-7xl px-2">
        <div className="grid grid-cols-5 gap-1 md:gap-2">
          {categories.map((category) => {
            const isActive = pathname === category.path
            return (
              <Link
                key={category.name}
                href={category.path}
                className={`flex flex-col items-center p-1 md:p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 shadow-sm scale-105'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105'
                }`}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-1 border border-slate-200 dark:border-slate-600">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-[9px] md:text-xs font-semibold text-center leading-tight ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
