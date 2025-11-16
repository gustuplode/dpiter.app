import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { getCollectionUrl } from "@/lib/utils"
import { SplashScreen } from "@/components/splash-screen"

export default async function HomePage() {
  const supabase = await createClient()

  let collections: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      collections = data || []
    }
  } catch (e) {
    error = e
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": collections.map((collection, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": collection.title,
        "brand": collection.brand,
        "image": collection.image_url,
        "url": `${baseUrl}${getCollectionUrl(collection.id, collection.title)}`,
        "offers": {
          "@type": "AggregateOffer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "INR"
        }
      }
    }))
  }

  return (
    <>
      <SplashScreen />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <div className="container mx-auto max-w-7xl px-2 py-6 pb-32">
          <main>
            {error ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load collections</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Please make sure the database tables are created.
                </p>
              </div>
            ) : collections.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-6 gap-y-4">
                {collections.map((collection) => (
                  <div key={collection.id} className="group">
                    <Link href={getCollectionUrl(collection.id, collection.title)} className="block">
                      <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                        <img
                          src={collection.image_url || "/placeholder.svg?height=400&width=300"}
                          alt={collection.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2">
                          <RatingButton
                            itemId={collection.id}
                            itemType="collection"
                          />
                        </div>
                        <div className="absolute top-2 right-2">
                          <WishlistButton
                            productId={collection.id}
                            type="collection"
                            className="h-7 w-7 flex items-center justify-center rounded-full bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm"
                          />
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <RatingDisplay
                            itemId={collection.id}
                            itemType="collection"
                          />
                        </div>
                        {collection.is_limited_time && (
                          <div className="absolute bottom-2 left-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#3B82F6]/90 px-2 py-0.5 text-xs font-medium text-white">
                              <span className="material-symbols-outlined text-sm">schedule</span>
                              LIMITED TIME
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{collection.brand}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{collection.title}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">No collections available yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Collections will appear here once they are published
                </p>
              </div>
            )}
          </main>
        </div>

        <FooterLinks />

        <BottomNav />
      </div>
    </>
  )
}
