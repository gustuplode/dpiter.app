import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { LikeButton } from "@/components/like-button"
import { RatingButton } from "@/components/rating-button"

export const metadata = {
  title: "Outfit - Dpiter",
  description: "Browse our curated outfit collections",
}

export default async function OutfitPage() {
  const supabase = await createClient()

  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Link className="flex items-center justify-center h-10 w-10" href="/">
              <span className="material-symbols-outlined text-3xl">arrow_back</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Outfit</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center rounded-full h-10 w-10">
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <button className="flex items-center justify-center rounded-full h-10 w-10">
              <span className="material-symbols-outlined text-2xl">favorite_border</span>
            </button>
            <button className="flex items-center justify-center rounded-full h-10 w-10">
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 pb-20">
        <div className="flex flex-col">
          {collections && collections.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {collections.map((collection, index) => (
                <div 
                  key={collection.id} 
                  className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden border border-black/10 dark:border-white/10 ${
                    index % 2 !== 0 ? 'border-l-0' : ''
                  } ${index >= 2 ? 'border-t-0' : ''}`}
                >
                  <Link href={`/collections/${collection.id}`} className="block">
                    <div 
                      className="relative w-full bg-center bg-no-repeat aspect-square bg-cover" 
                      style={{ backgroundImage: `url("${collection.image_url || "/placeholder.svg"}")` }}
                    >
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-semibold">4.1</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">{collection.brand || "BRAND"}</p>
                    <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-semibold leading-snug truncate">{collection.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-text-primary-light dark:text-white text-xs font-medium">{collection.product_count || 0} products</p>
                    </div>
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="border-t border-black/10 dark:border-white/10 opacity-50"></div>
                      <div className="flex items-center justify-between text-text-secondary-light dark:text-text-secondary-dark">
                        <LikeButton itemId={collection.id} itemType="collection" className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark" />
                        <div className="flex items-center gap-1">
                          <RatingButton itemId={collection.id} itemType="collection" className="flex items-center justify-center h-8 w-8 text-text-primary-light dark:text-text-primary-dark" />
                          <Link href={`/collections/${collection.id}`} className="flex items-center justify-center h-8 w-8 text-primary dark:text-primary-light">
                            <span className="material-symbols-outlined text-xl">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                {error ? "Please run the database setup script in admin panel" : "No outfit collections available yet"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
