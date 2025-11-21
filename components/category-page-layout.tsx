import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { getProductUrl } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface CategoryPageLayoutProps {
  title: string
  products: any[]
  error?: any
}

export function CategoryPageLayout({ title, products, error }: CategoryPageLayoutProps) {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20">
        <div className="flex flex-col">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-black/10 dark:border-white/10 md:rounded-lg md:border hover:shadow-lg transition-shadow"
                >
                  <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
                    <div
                      className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
                      style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
                    >
                      <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                        <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-2 flex flex-col gap-1">
                    <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                      {product.brand || "Brand"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                      {product.title}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-gray-900 dark:text-white text-sm font-bold">₹{product.price}</p>
                        {product.original_price && (
                          <p className="text-gray-400 dark:text-gray-500 text-[10px] line-through">
                            ₹{product.original_price}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5">
                        <WishlistButton
                          productId={product.id}
                          className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        />
                        <RatingButton
                          itemId={product.id}
                          itemType="product"
                          className="flex items-center justify-center h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                        />
                        <AddToCartButton
                          productId={product.id}
                          className="flex items-center justify-center h-6 w-6 text-primary dark:text-primary-light hover:text-primary/80 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error
                  ? "Please run the database setup script in admin panel"
                  : `No ${title.toLowerCase()} products available yet`}
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
