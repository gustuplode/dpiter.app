"use client"

import { useState } from "react"
import {
  Plus,
  Shirt,
  Gamepad2,
  Smartphone,
  ImageIcon,
  MousePointer2,
  Bell,
  FileText,
  Layers,
  Zap,
  Layout,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AdminCategorySelector() {
  const [showCategories, setShowCategories] = useState(false)

  const categories = [
    { name: "Fashion", href: "/admin/fashion", icon: Shirt, color: "bg-pink-500" },
    { name: "Gadgets", href: "/admin/gadgets", icon: Smartphone, color: "bg-green-500" },
    { name: "Gaming", href: "/admin/gaming", icon: Gamepad2, color: "bg-red-500" },
    { name: "Banner", href: "/admin/banners", icon: ImageIcon, color: "bg-purple-500" },
    {
      name: "Display Banner",
      href: "/admin/ads/banner",
      icon: Layout,
      color: "bg-blue-500",
      description: "300×250 & 728×90",
    },
    {
      name: "Onclick (Popunder)",
      href: "/admin/ads/onclick",
      icon: MousePointer2,
      color: "bg-orange-500",
      description: "High CPM rates",
    },
    {
      name: "Push Notifications",
      href: "/admin/ads/push",
      icon: Bell,
      color: "bg-indigo-500",
      description: "Long-term income",
    },
    {
      name: "In-Page Push",
      href: "/admin/ads/inpage",
      icon: FileText,
      color: "bg-teal-500",
      description: "Native banner",
    },
    {
      name: "Interstitial",
      href: "/admin/ads/interstitial",
      icon: Layers,
      color: "bg-yellow-600",
      description: "Non-full-screen",
    },
    {
      name: "Vignette Banner",
      href: "/admin/ads/vignette",
      icon: Zap,
      color: "bg-cyan-500",
      description: "65% higher CPM",
    },
    {
      name: "Native Banner",
      href: "/admin/ads/native",
      icon: Layout,
      color: "bg-emerald-500",
      description: "Native-like ads",
    },
  ]

  return (
    <>
      {showCategories && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center pb-24"
          onClick={() => setShowCategories(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Add to Category
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowCategories(false)}
                >
                  <div className={`${category.color} p-2 rounded-lg text-white flex-shrink-0`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">
                      {category.name}
                    </p>
                    {category.description && (
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setShowCategories(!showCategories)}
        className="fixed bottom-6 right-6 z-30 h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl transition-transform hover:scale-110 p-0"
      >
        <Plus className={`h-8 w-8 transition-transform ${showCategories ? "rotate-45" : ""}`} />
      </Button>
    </>
  )
}
