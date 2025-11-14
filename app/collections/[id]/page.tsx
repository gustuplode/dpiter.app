import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { WishlistButton } from "@/components/wishlist-button"
import { FooterLinks } from "@/components/footer-links"
import { CurrencyDisplay } from "@/components/currency-display"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase.from("collections").select("title, brand").eq("id", id).single()

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  return {
    title: `${collection.title} - ${collection.brand} | Dpiter`,
    description: `Shop the ${collection.title} collection from ${collection.brand}. Discover curated products and exclusive deals.`,
    openGraph: {
      title: `${collection.title} - ${collection.brand}`,
      description: `Shop the ${collection.title} collection from ${collection.brand}`,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (!collection) {
    notFound()
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", collection.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  const productCount = products?.length || 0

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-7xl px-2 py-6 pb-32">
        <main>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] gap-y-4">
              {products.map((product) => (
                <a
                  key={product.id}
                  href={product.affiliate_link || "https://amzn.to/49SNT2h"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                    <img
                      alt={product.title}
                      className="w-full h-auto aspect-[3/4] object-contain object-center"
                      src={product.image_url || "/placeholder.svg?height=400&width=300"}
                    />
                    <div className="absolute top-2 right-2">
                      <WishlistButton
                        productId={product.id}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-700 dark:text-slate-200"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{product.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.brand}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      <CurrencyDisplay price={product.price} />
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">No products in this collection yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Check back soon for new arrivals</p>
            </div>
          )}
        </main>
      </div>

      <FooterLinks />

      <BottomNav />
    </div>
  )
}
