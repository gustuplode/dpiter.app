import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { generateSlug } from "@/lib/utils"

export const metadata = {
  title: "Gaming - Dpiter",
  description: "Browse our curated collection of gaming products",
}

export default async function GamingPage() {
  const supabase = await createClient()

  let products: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("category_products")
      .select("*")
      .eq("category", "gaming")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      products = data || []
    }
  } catch (e) {
    error = e
  }

  return (
    <>
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <CategoryHeader />
        
        <div className="container mx-auto max-w-7xl px-2 py-6 pb-32">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gaming</h1>
          
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">Category products table not found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Please run the SQL script <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">009_create_category_products.sql</code> from the admin panel Scripts section.
              </p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-6 gap-y-4">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/products/${product.id}/${generateSlug(product.title)}`} className="block">
                    <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2" onClick={(e) => e.preventDefault()}>
                        <RatingButton itemId={product.id} itemType="category_product" />
                      </div>
                      <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
                        <WishlistButton
                          productId={product.id}
                          type="product"
                          className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                        />
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <RatingDisplay itemId={product.id} itemType="category_product" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{product.brand}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{product.title}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">₹{product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">No gaming products available yet</p>
            </div>
          )}
        </div>

        <FooterLinks />
        <BottomNav />
      </div>
    </>
  )
}
