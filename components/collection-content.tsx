"use client"

import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { LikeButton } from "@/components/like-button"
import { CurrencyDisplay } from "@/components/currency-display"
import { getCollectionProductUrl } from "@/lib/utils" // Add import for collection product URL helper
import Link from "next/link" // Add Link import

interface Collection {
  id: string
  title: string
  brand: string
  image_url: string
}

interface Product {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  affiliate_link: string
}

export function CollectionContent({ 
  collection, 
  products 
}: { 
  collection: Collection
  products: Product[]
}) {
  const productCount = products.length

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-6 pb-32">
      <main>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={collection.image_url || "/placeholder.svg?height=200&width=200"}
                alt={collection.title}
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {collection.title}
                </h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  {collection.brand}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingDisplay
                    itemId={collection.id}
                    itemType="collection"
                  />
                  <span className="text-xs text-slate-500">{productCount} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-6 gap-y-4">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link
                  href={getCollectionProductUrl(collection.id, product.id, product.title)}
                  className="block"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                    <img
                      src={product.image_url || "/placeholder.svg?height=400&width=300"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div 
                      className="absolute top-2 left-2 flex items-center gap-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      <RatingButton
                        itemId={product.id}
                        itemType="product"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                      />
                      <WishlistButton
                        productId={product.id}
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                      />
                      <LikeButton
                        itemId={product.id}
                        itemType="product"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                      />
                    </div>
                    <div 
                      className="absolute top-2 right-2"
                      onClick={(e) => e.preventDefault()}
                    >
                      <LikeButton
                        itemId={product.id}
                        itemType="product"
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <RatingDisplay
                        itemId={product.id}
                        itemType="product"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{product.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      <CurrencyDisplay price={product.price} />
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">No products in this collection yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Check back soon for new arrivals</p>
          </div>
        )}
      </main>
    </div>
  )
}
