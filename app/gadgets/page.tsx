import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"

export const metadata = {
  title: "Gadgets - Dpiter",
  description: "Browse our curated collection of gadgets",
}

export default async function GadgetsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "gadgets")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  // Get counts for header
  const { count: fashionCount } = await supabase
    .from("category_products")
    .select("*", { count: "exact", head: true })
    .eq("category", "fashion")
    .eq("is_visible", true)

  const { count: gadgetsCount } = await supabase
    .from("category_products")
    .select("*", { count: "exact", head: true })
    .eq("category", "gadgets")
    .eq("is_visible", true)

  const { count: gamingCount } = await supabase
    .from("category_products")
    .select("*", { count: "exact", head: true })
    .eq("category", "gaming")
    .eq("is_visible", true)

  const allCount = (fashionCount || 0) + (gadgetsCount || 0) + (gamingCount || 0)

  return (
    <>
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <CategoryHeader 
          fashionCount={fashionCount || 0}
          gadgetsCount={gadgetsCount || 0}
          gamingCount={gamingCount || 0}
          allProductsCount={allCount}
        />
        
        <div className="container mx-auto max-w-7xl px-2 py-6 pb-32">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gadgets</h1>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-6 gap-y-4">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2">
                        <RatingButton itemId={product.id} itemType="category_product" />
                      </div>
                      <div className="absolute top-2 right-2">
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
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error ? "Please run the database setup script (009_create_category_products.sql) in admin panel" : "No gadgets available yet"}
              </p>
            </div>
          )}
        </div>

        <FooterLinks />
        <BottomNav />
      </div>
    </>
  )
}
