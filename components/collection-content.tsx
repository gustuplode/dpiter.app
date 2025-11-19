"use client"

import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { LikeButton } from "@/components/like-button"
import { CurrencyDisplay } from "@/components/currency-display"
import { getCollectionProductUrl } from "@/lib/utils"
import Link from "next/link"

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
    <div className="container mx-auto max-w-7xl px-4 pt-2 pb-32">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <Link
                  href={getCollectionProductUrl(collection.id, product.id, product.title)}
                  className="block flex-1 flex flex-col"
                >
                  <div className="relative w-full bg-center bg-no-repeat aspect-square bg-cover">
                    <img
                      src={product.image_url || "/placeholder.svg?height=400&width=400"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs backdrop-blur-sm">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-semibold">4.1</span>
                    </div>
                  </div>
                  
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm font-bold uppercase text-muted-foreground tracking-wide">{product.brand || 'Brand'}</p>
                    <p className="text-foreground text-xs font-semibold leading-snug truncate">{product.title}</p>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-foreground text-base font-bold">
                        <CurrencyDisplay price={product.price} />
                      </p>
                      <p className="text-muted-foreground text-xs font-normal line-through">
                        <CurrencyDisplay price={product.price * 1.4} />
                      </p>
                    </div>

                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="border-t border-black/10 dark:border-white/10"></div>
                      <div className="flex items-center justify-end text-muted-foreground -mt-1" onClick={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-1">
                          <WishlistButton
                            productId={product.id}
                            className="flex items-center justify-center h-8 w-8 text-foreground hover:text-primary transition-colors"
                          />
                          <RatingButton
                            itemId={product.id}
                            itemType="product"
                            className="flex items-center justify-center h-8 w-8 text-foreground hover:text-primary transition-colors"
                          />
                          <button className="flex items-center justify-center h-8 w-8 text-primary hover:text-primary/80 transition-colors">
                            <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
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
