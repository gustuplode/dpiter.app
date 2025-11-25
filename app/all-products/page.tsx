import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { getProductUrl } from "@/lib/utils"
import { LikeButton } from "@/components/like-button"

export const metadata = {
  title: "All Products - Dpiter",
  description: "Browse all our products from fashion, gadgets, and gaming",
}

export default async function AllProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
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
        
        <div className="container mx-auto max-w-7xl px-1.5 py-2 pb-32">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">All Products</h1>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-2 md:gap-y-3">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <Link href={getProductUrl(product.id, product.title, product.category)} className="block">
                    <div className="relative overflow-hidden rounded-md bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5">
                        <RatingButton itemId={product.id} itemType="category_product" />
                        <WishlistButton
                          productId={product.id}
                          type="product"
                          className="h-6 w-6 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm hover:scale-110 transition-transform"
                        />
                        <LikeButton itemId={product.id} itemType="category_product" />
                      </div>
                      <div className="absolute bottom-1.5 right-1.5">
                        <RatingDisplay itemId={product.id} itemType="category_product" />
                      </div>
                      <div className="absolute top-1.5 left-1.5">
                        <span className="inline-flex items-center rounded-md bg-blue-500/90 px-1.5 py-0.5 text-[9px] font-medium text-white capitalize">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="pt-1.5 px-0.5">
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{product.brand}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{product.title}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">₹{product.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error ? "Please run the database setup script (009_create_category_products.sql) in admin panel" : "No products available yet"}
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
