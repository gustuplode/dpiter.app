import { createClient } from "@/lib/supabase/server"
import { DynamicBannerCarousel } from "@/components/dynamic-banner-carousel"
import { AdDisplay } from "@/components/ad-display"
import { InfiniteProductList } from "@/components/infinite-product-list"

async function getInitialProducts() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(0, 5) // Load only 6 products initially

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return products || []
}

async function ActiveAds() {
  const supabase = await createClient()

  const { data: ads } = await supabase
    .from("ad_formats")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true })

  if (!ads || ads.length === 0) return null

  return (
    <>
      {ads.map((ad) => (
        <AdDisplay key={ad.id} adCode={ad.ad_code} formatType={ad.format_type} />
      ))}
    </>
  )
}

export default async function HomePage() {
  const initialProducts = await getInitialProducts()

  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark">
      <DynamicBannerCarousel />

      <ActiveAds />

      <div className="flex flex-col">
        <main className="pb-4">
          <InfiniteProductList initialProducts={initialProducts} />
        </main>
      </div>
    </div>
  )
}
