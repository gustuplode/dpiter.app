import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { WishlistButton } from "@/components/wishlist-button"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase.from("collections").select("title, brand").eq("slug", id).single()

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
    .eq("slug", id)
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f6f5] dark:bg-[#23150f]">
      <main className="flex-grow pb-20">
        <div className="relative w-full h-56 md:h-80 lg:h-96">
          <img
            src={collection.image_url || "/placeholder.svg"}
            alt={collection.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f6f5] dark:from-[#23150f] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
            <h1 className="text-[#23150f] dark:text-[#f8f6f5] text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              {collection.title}
            </h1>
            <p className="text-[#9e6147] dark:text-gray-400 text-xs md:text-sm font-normal leading-normal pt-2">
              As an affiliate, we may earn from qualifying purchases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <div key={product.id} className="flex flex-col group relative">
              <div className="relative w-full overflow-hidden bg-gray-200">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover"
                  style={{ backgroundImage: `url('${product.image_url}')` }}
                />
                <WishlistButton productId={product.id} />
              </div>
              <a
                href={product.affiliate_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-3"
              >
                <p className="text-[#23150f] dark:text-[#f8f6f5] text-xs md:text-sm font-bold uppercase leading-normal tracking-wide">
                  {product.brand}
                </p>
                <p className="text-[#9e6147] dark:text-gray-400 text-sm md:text-base font-normal leading-normal line-clamp-2">
                  {product.title}
                </p>
                <p className="text-[#23150f] dark:text-gray-200 text-sm md:text-base font-medium leading-normal pt-1">
                  ${product.price.toFixed(2)}
                </p>
              </a>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
