"use client"

import { useState } from "react"
import { Plus, Shirt, Gamepad2, Smartphone, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AdminCategorySelector() {
  const [showCategories, setShowCategories] = useState(false)

  const categories = [
    { name: "Fashion", href: "/admin/fashion", icon: Shirt, color: "bg-pink-500" },
    { name: "Gadgets", href: "/admin/gadgets", icon: Smartphone, color: "bg-green-500" },
    { name: "Gaming", href: "/admin/gaming", icon: Gamepad2, color: "bg-red-500" },
    { name: "Banner", href: "/admin/banners", icon: ImageIcon, color: "bg-purple-500" },
  ]

  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Select Category</h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark mb-8">
          Choose a category to manage products
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg group"
            >
              <div
                className={`${category.color} p-4 rounded-full text-white group-hover:scale-110 transition-transform`}
              >
                <category.icon className="h-8 w-8" />
              </div>
              <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {showCategories && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-end justify-center pb-24"
          onClick={() => setShowCategories(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Add to Category
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`${category.href}/add`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowCategories(false)}
                >
                  <div className={`${category.color} p-2 rounded-lg text-white`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {category.name}
                  </span>
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
    </div>
  )
}
