"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"

interface Review {
  id: string
  item_id: string
  item_type: string
  rating: number
  created_at: string
  product?: {
    id: string
    title: string
    image_url: string
    category: string
  }
}

export default function MyReviewsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Get user's ratings
        const { data: ratings } = await supabase
          .from("ratings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ratings) {
          // Get product details for each rating
          const reviewsWithProducts = await Promise.all(
            ratings.map(async (rating) => {
              if (rating.item_type === "product") {
                const { data: product } = await supabase
                  .from("category_products")
                  .select("id, title, image_url, category")
                  .eq("id", rating.item_id)
                  .single()

                return { ...rating, product }
              }
              return rating
            }),
          )
          setReviews(reviewsWithProducts)
        }
      }

      setLoading(false)
    }

    loadReviews()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">login</span>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            Please login to see your reviews
          </p>
          <Link href="/profile" className="text-primary hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/profile" className="p-1">
            <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
              arrow_back
            </span>
          </Link>
          <h1 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">My Reviews</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">star_rate</span>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              You haven't reviewed any products yet
            </p>
            <Link href="/" className="mt-4 inline-block text-primary hover:underline">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                {review.product && (
                  <Link
                    href={`/products/${review.product.category}/${review.product.id}/${review.product.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <Image
                        src={review.product.image_url || "/placeholder.svg"}
                        alt={review.product.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark line-clamp-2">
                        {review.product.title}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`material-symbols-outlined text-lg ${
                              star <= review.rating ? "text-amber-500" : "text-gray-300 dark:text-gray-600"
                            }`}
                            style={{ fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
