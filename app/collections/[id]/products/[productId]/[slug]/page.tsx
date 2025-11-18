import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CategoryHeader } from "@/components/category-header"
import { WishlistButton } from "@/components/wishlist-button"
import { LikeButton } from "@/components/like-button"
import { ReviewSection } from "@/components/review-section"
import { RatingButton } from "@/components/rating-button"
import type { Metadata } from "next"
import { getCollectionProductUrl, getCollectionUrl } from "@/lib/utils"
import Link from "next/link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; productId: string; slug: string }>
}): Promise<Metadata> {
  const { id, productId } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("title, brand, image_url, price")
    .eq("id", productId)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"
  const productUrl = `${baseUrl}${getCollectionProductUrl(id, productId, product.title)}`

  return {
    title: `${product.title} - ${product.brand} | DPITER.shop`,
    description: `Shop ${product.title} from ${product.brand} at ₹${product.price}. Secure redirect to trusted marketplace.`,
    keywords: [product.title, product.brand],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} - ${product.brand}`,
      description: `Shop ${product.title} from ${product.brand}`,
      images: [{ url: product.image_url }],
      url: productUrl,
    },
  }
}

export default async function CollectionProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; productId: string; slug: string }>
}) {
  const { id, productId, slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, collections(title, brand)")
    .eq("id", productId)
    .eq("collection_id", id)
    .eq("is_visible", true)
    .single()

  if (!product) {
    notFound()
  }

  const correctUrl = getCollectionProductUrl(id, product.id, product.title)
  const currentUrl = `/collections/${id}/products/${productId}/${slug}`

  if (correctUrl !== currentUrl) {
    redirect(correctUrl)
  }

  const collection = product.collections as any

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

        <div className="container mx-auto max-w-7xl px-4 py-6 pb-32">
          <Link
            href={getCollectionUrl(id, collection?.title || "")}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary mb-4"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-lg">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-0.5">
                <RatingButton
                  itemId={product.id}
                  itemType="product"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm shadow-md"
                />
                <WishlistButton
                  productId={product.id}
                  type="product"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm shadow-md"
                />
                <LikeButton
                  itemId={product.id}
                  itemType="product"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm shadow-md"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {collection?.title || "Collection"}
                </p>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {product.brand}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">{product.title}</p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Price</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">
                  ₹{product.price}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Buy Now
                </a>
                <WishlistButton
                  productId={product.id}
                  type="product"
                  className="flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary/10 font-semibold py-4 px-6 rounded-lg transition-colors"
                  showText
                />
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-base align-middle mr-1">info</span>
                  You will be redirected to a trusted marketplace to complete your purchase securely.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <ReviewSection
              itemId={product.id}
              itemType="product"
            />
          </div>
        </div>

        <FooterLinks />
        <BottomNav />
      </div>
    </>
  )
}
