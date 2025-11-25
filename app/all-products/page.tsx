import { createClient } from "@/lib/supabase/server"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { InfiniteProductsClient } from "@/components/infinite-products-client"

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
    .range(0, 9)

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
            <InfiniteProductsClient initialProducts={products} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {error
                  ? "Please run the database setup script (009_create_category_products.sql) in admin panel"
                  : "No products available yet"}
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
