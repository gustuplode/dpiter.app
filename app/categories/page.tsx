"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  product_count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()

      // Fetch collections as categories
      const { data, error } = await supabase
        .from("collections")
        .select("id, name, slug, image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (!error && data) {
        setCategories(data)
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">All Categories</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-700">
                {category.image_url ? (
                  <Image
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-gray-400">category</span>
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <h3 className="font-medium text-text-primary-light dark:text-text-primary-dark line-clamp-1">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">category</span>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">No categories available</p>
          </div>
        )}
      </div>
    </div>
  )
}
