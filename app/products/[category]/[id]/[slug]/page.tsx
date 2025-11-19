import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string; slug: string }>
}) {
  const { category, id, slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("category_products")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .single()

  if (!product) {
    notFound()
  }

  const { data: relatedProducts } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", category)
    .eq("is_visible", true)
    .neq("id", id)
    .limit(6)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined text-2xl">search</span>
            </Link>
            <Link href="/wishlist" className="flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined text-2xl">favorite_border</span>
            </Link>
            <Link href="/cart" className="flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        <div className="relative w-full">
          <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex-shrink-0 w-full snap-center">
              <div 
                className="w-full bg-center bg-no-repeat aspect-square bg-cover" 
                style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
              ></div>
            </div>
            <div className="flex-shrink-0 w-full snap-center">
              <div 
                className="w-full bg-center bg-no-repeat aspect-square bg-cover" 
                style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
              ></div>
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
            <div className="h-2 w-4 rounded-full bg-primary"></div>
            <div className="h-2 w-2 rounded-full bg-white/50 backdrop-blur-sm"></div>
          </div>
          <button className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center justify-center size-8 rounded-full bg-white/50 backdrop-blur-sm text-text-primary-light">
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center size-8 rounded-full bg-white/50 backdrop-blur-sm text-text-primary-light">
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">{product.brand || "BRAND"}</p>
                <h1 className="text-xl font-display font-semibold text-text-primary-light dark:text-text-primary-dark">{product.title}</h1>
              </div>
              <button className="flex items-center justify-center size-10 text-primary dark:text-primary-light">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-lg">star_half</span>
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">(4.1) 1,283 ratings</p>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold font-sans text-text-primary-light dark:text-white">₹{product.price}</p>
            {product.original_price && (
              <>
                <p className="text-base font-normal text-text-secondary-light dark:text-text-secondary-dark line-through">₹{product.original_price}</p>
                <p className="text-base font-bold text-green-600 dark:text-green-400">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="w-full h-12 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark font-bold text-base">Add to Cart</button>
            <a 
              href={product.affiliate_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-12 rounded-lg bg-primary text-white font-bold text-base"
            >
              Buy Now
            </a>
          </div>
        </div>

        <div className="h-2 bg-gray-100 dark:bg-gray-800/50"></div>

        <div className="py-6">
          <div className="px-4 mb-4">
            <h2 className="font-display text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Related Products</h2>
          </div>
          <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-px">
            <div className="flex items-stretch">
              {relatedProducts?.map((related, index) => (
                <Link 
                  key={related.id}
                  href={`/products/${related.category}/${related.id}/${related.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-y border-r border-black/10 dark:border-y dark:border-r dark:border-white/10 w-44 ${index === 0 ? 'border-l' : ''}`}
                >
                  <div 
                    className="relative w-full bg-center bg-no-repeat aspect-square bg-cover" 
                    style={{ backgroundImage: `url("${related.image_url || "/placeholder.svg"}")` }}
                  ></div>
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">{related.brand || "BRAND"}</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-semibold leading-snug truncate">{related.title}</p>
                    <div className="flex items-center gap-2 mt-auto pt-1">
                      <p className="text-text-primary-light dark:text-white text-base font-bold">₹{related.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
