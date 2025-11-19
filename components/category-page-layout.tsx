import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { LikeButton } from "@/components/like-button"
import { getProductUrl } from "@/lib/utils"

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden border border-black/10 dark:border-white/10 ${
                    index % 2 !== 0 ? 'border-l-0' : ''
                  } ${index >= 2 ? 'border-t-0' : ''}`}
                >
                  <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
                    <div 
                      className="relative w-full bg-center bg-no-repeat aspect-square bg-cover" 
                      style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
                    >
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-semibold">4.1</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">{product.brand || "Brand"}</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-semibold leading-snug truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-text-primary-light dark:text-white text-base font-bold">₹{product.price}</p>
                      {product.original_price && (
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal line-through">₹{product.original_price}</p>
                      )}
                    </div>
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="border-t border-black/10 dark:border-white/10 opacity-50"></div>
                      <div className="flex items-center justify-between text-text-secondary-light dark:text-text-secondary-dark">
                        <LikeButton itemId={product.id} itemType="category_product" className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark" />
                        <div className="flex items-center gap-1">
                          <RatingButton itemId={product.id} itemType="category_product" className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark" />
                          <button className="flex items-center justify-center h-8 w-8 text-primary dark:text-primary-light">
                            <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error ? "Please run the database setup script in admin panel" : `No ${title.toLowerCase()} products available yet`}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
