import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { CurrencyDisplay } from "@/components/currency-display"
import { WishlistButton } from "@/components/wishlist-button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductUrl } from "@/lib/utils"

export const metadata = {
  title: "Offers - Dpiter",
  description: "Best deals and offers on products",
}

export default async function OffersPage() {
  const supabase = await createClient()

  // Get products with discounts (where original_price exists and is higher than price)
  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("is_visible", true)
    .not("original_price", "is", null)
    .order("created_at", { ascending: false })

  // Filter products that have a discount
  const discountedProducts = products?.filter((p) => p.original_price && p.original_price > p.price) || []

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-6 text-white">
          <h1 className="text-2xl font-bold">Special Offers</h1>
          <p className="text-sm opacity-90 mt-1">Best deals just for you</p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load offers</p>
          </div>
        ) : discountedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-600">sell</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              No Offers Available
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Check back later for exciting deals!
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-4 xl:grid-cols-5">
            {discountedProducts.map((product) => {
              const discountPercent = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0

              return (
                <div
                  key={product.id}
                  className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-t border-r border-[#8A3224] dark:border-[#8A3224] md:rounded-lg md:border hover:shadow-lg transition-shadow relative"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </div>

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

                  <div className="p-2 flex flex-col gap-1 bg-[#F7F7F7] dark:bg-gray-800">
                    <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                      {product.brand || "Brand"}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                      {product.title}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-gray-900 dark:text-white text-sm font-bold">
                          <CurrencyDisplay price={product.price} />
                        </p>
                        {product.original_price && (
                          <p className="text-gray-400 dark:text-gray-500 text-[10px] line-through">
                            <CurrencyDisplay price={product.original_price} />
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5">
                        <WishlistButton
                          productId={product.id}
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
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
