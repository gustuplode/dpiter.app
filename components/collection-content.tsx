"use client"

import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
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
  products,
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
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">{collection.brand}</p>
                <div className="flex items-center gap-2 mt-2">
                  <RatingDisplay itemId={collection.id} itemType="collection" />
                  <span className="text-xs text-slate-500">{productCount} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-black/10 dark:border-white/10 md:rounded-lg md:border hover:shadow-lg transition-shadow"
              >
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
                  </div>

                  <div className="p-2 flex flex-col gap-1 bg-[#F7F7F7] dark:bg-gray-800">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                      {product.brand || "Brand"}
                    </p>
                    <p className="text-foreground text-[10px] font-semibold leading-tight line-clamp-2">
                      {product.title}
                    </p>
                  </div>

                  <div className="px-2 pb-2 flex flex-col gap-2 bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground text-sm font-bold">
                          <CurrencyDisplay price={product.price} />
                        </p>
                        <p className="text-muted-foreground text-[10px] font-normal line-through">
                          <CurrencyDisplay price={product.price * 1.4} />
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 bg-green-600 text-white rounded px-1.5 py-0.5">
                        <span className="text-[9px] font-bold">4.1</span>
                        <span
                          className="material-symbols-outlined text-[10px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-end text-muted-foreground -mt-1"
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="flex items-center gap-1">
                        <WishlistButton
                          productId={product.id}
                          className="flex items-center justify-center h-7 w-7 text-foreground hover:text-primary transition-colors"
                        />
                        <RatingButton
                          itemId={product.id}
                          itemType="product"
                          className="flex items-center justify-center h-7 w-7 text-foreground hover:text-primary transition-colors"
                        />
                        <button className="flex items-center justify-center h-7 w-7 text-primary hover:text-primary/80 transition-colors">
                          <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                        </button>
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
