import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductUrl } from "@/lib/utils"
import { Suspense } from "react"
import { CollectionGridSkeleton } from "@/components/collection-skeleton"
import { CurrencyDisplay } from "@/components/currency-display"

async function ProductList() {
  const supabase = await createClient()

  let products: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("category_products")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(20)

    if (fetchError) {
      error = fetchError
    } else {
      products = data || []
    }
  } catch (e) {
    error = e
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load products</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 p-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <Link href={getProductUrl(product.id, product.title, product.category)} className="block flex-1 flex flex-col">
            <div className="relative w-full bg-center bg-no-repeat aspect-square bg-cover" style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-semibold">4.1</span>
              </div>
            </div>
            
            <div className="p-3 flex flex-col gap-2 flex-1">
              <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">{product.brand || 'Brand'}</p>
              <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-semibold leading-snug truncate">{product.title}</p>
              
              <div className="flex items-center gap-2 mt-1">
                <p className="text-text-primary-light dark:text-white text-base font-bold">
                  <CurrencyDisplay price={product.price} />
                </p>
                {product.original_price && (
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal line-through">
                    <CurrencyDisplay price={product.original_price} />
                  </p>
                )}
              </div>

              <div className="mt-auto pt-2 flex flex-col gap-2">
                <div className="border-t border-black/10 dark:border-white/10 opacity-50"></div>
                <div className="flex items-center justify-end text-text-secondary-light dark:text-text-secondary-dark -mt-1">
                  <div className="flex items-center gap-1">
                    <WishlistButton
                      productId={product.id}
                      className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors"
                    />
                    <RatingButton
                      itemId={product.id}
                      itemType="product"
                      className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark hover:text-primary transition-colors"
                    />
                    <AddToCartButton
                      productId={product.id}
                      className="flex items-center justify-center h-8 w-8 text-primary dark:text-primary-light hover:text-primary/80 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark">
      
      <div className="px-4 mb-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3 pb-2">
          <div className="relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[32vw] snap-center">
            <div className="relative flex h-full flex-col rounded-xl overflow-hidden shadow-lg">
              <div className="w-full bg-center bg-no-repeat aspect-[16/9] md:aspect-[21/9] lg:aspect-[32/9] bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIdhfHPQERaI5PPdd04MvO3BdaarPHqT_-vnTwWFitc1ULELL0MqX_YanzRip66kUgdtY8eJss3VZUuDKjPLEsjETIjTaXR5fJVNiIKFCmlOtMvyNxWSf2l8spgc3kao2y2L4fA31ww9sfvXOsV5jGIOf8lbwy243Lst38C1OunLL9E-h33TrGeGoHsPYBlZyI2x0oazLmKCvK7mU8Lt0cizPm43i7G9HjD5KgoWBZS54C7-kAmxbRIRASAKFnIxR0m_aRGnzYyk7I")' }}></div>
            </div>
          </div>
          <div className="relative flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[32vw] snap-center">
            <div className="relative flex h-full flex-col rounded-xl overflow-hidden shadow-lg">
              <div className="w-full bg-center bg-no-repeat aspect-[16/9] md:aspect-[21/9] lg:aspect-[32/9] bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCzQ5vrlhemfKhhO6mDwODsCnXvTOg3F5EK6vahMsrMHj0_3hsGucRUiMOJUbp_AWaoAoGTi_2x_dEB7_3CUOy3uSGn9BFOyZWmxvFjfSpem30OUV9mDjjdqyozKLuZlI0aySANfs-0HGGAFKln5cI0HVoG_R7385SuCJuYvwONIgniXdgFOSQtBKNkrPUozAsoc_Aha9NhzpS5CG8Z9k-RjqQ6jpUw9eZCde83W4kVPDpV6MKzHar5Kvxhya8CdrsbJXh9VqKbkROI")' }}></div>
            </div>
          </div>
        </div>
        
        <div className="flex w-full flex-row items-center justify-center gap-2 py-3">
          <div className="h-2 w-4 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="px-4 mb-4">
          <h2 className="font-display text-xl font-bold text-text-primary-light dark:text-text-primary-dark">All Products</h2>
        </div>
        <main className="pb-20">
          <Suspense fallback={<CollectionGridSkeleton />}>
            <ProductList />
          </Suspense>
        </main>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
