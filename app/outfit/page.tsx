import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export const metadata = {
  title: "Outfit - Dpiter",
  description: "Browse our curated outfit collections",
}

export default async function OutfitPage() {
  const supabase = await createClient()

  const { data: collections, error } = await supabase
    .from("collections")
    .select(`
      *,
      products (count)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  const collectionsWithCount = collections?.map((col) => ({
    ...col,
    product_count: col.products?.[0]?.count ?? col.product_count ?? 0,
  }))

  return (
    <div className="flex flex-col">
      {collectionsWithCount && collectionsWithCount.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {collectionsWithCount.map((collection, index) => (
            <div
              key={collection.id}
              className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden border border-black/10 dark:border-white/10 ${
                index % 2 !== 0 ? "border-l-0" : ""
              } ${index >= 2 ? "border-t-0" : ""}`}
            >
              <Link href={`/collections/${collection.id}`} className="block">
                <div
                  className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
                  style={{ backgroundImage: `url("${collection.image_url || "/placeholder.svg"}")` }}
                >
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs backdrop-blur-sm">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      inventory_2
                    </span>
                    <span className="font-semibold">{collection.product_count}</span>
                  </div>
                </div>
              </Link>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">
                  {collection.brand || "COLLECTION"}
                </p>
                <p className="text-text-primary-light dark:text-text-primary-dark text-xs font-semibold leading-snug truncate">
                  {collection.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-text-primary-light dark:text-white text-xs font-medium">
                    {collection.product_count} products
                  </p>
                </div>
                <div className="mt-auto pt-2 flex flex-col gap-2">
                  <div className="border-t border-black/10 dark:border-white/10 opacity-50"></div>
                  <div className="flex items-center justify-end text-text-secondary-light dark:text-text-secondary-dark">
                    <Link
                      href={`/collections/${collection.id}`}
                      className="flex items-center justify-center h-8 w-8 text-primary dark:text-primary-light"
                    >
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
            {error ? "Unable to load collections" : "No outfit collections available yet"}
          </p>
        </div>
      )}
    </div>
  )
}
