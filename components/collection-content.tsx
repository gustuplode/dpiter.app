"use client"

import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { AddToCartButton } from "@/components/add-to-cart-button"
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
  return (
    <div className="flex flex-col pb-20">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:gap-4 xl:grid-cols-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-black/10 dark:border-white/10 lg:rounded-lg lg:border hover:shadow-lg transition-shadow"
            >
              <Link href={getCollectionProductUrl(collection.id, product.id, product.title)} className="block">
                <div className="relative w-full bg-center bg-no-repeat aspect-square bg-cover">
                  <img
                    src={product.image_url || "/placeholder.svg?height=1080&width=1080"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-green-600 text-white rounded px-1.5 py-0.5">
                    <span className="text-[9px] font-bold">4.1</span>
                    <span
                      className="material-symbols-outlined text-[10px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-2 flex flex-col gap-1 bg-[#F7F7F7] dark:bg-gray-800">
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                  {product.brand || "Brand"}
                </p>
                <p className="text-foreground text-[10px] font-semibold leading-tight line-clamp-2">{product.title}</p>
              </div>

              <div className="px-2 pb-2 flex flex-col gap-2 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-foreground text-sm font-bold">₹{product.price.toLocaleString()}</p>
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
                    <AddToCartButton
                      product={{
                        id: product.id,
                        title: product.title,
                        brand: product.brand,
                        price: product.price,
                        image_url: product.image_url,
                        affiliate_link: product.affiliate_link,
                      }}
                      className="flex items-center justify-center h-7 w-7 text-primary hover:text-primary/80 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">No products in this collection yet</p>
        </div>
      )}
    </div>
  )
}
