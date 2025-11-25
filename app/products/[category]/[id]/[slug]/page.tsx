import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { LikeButton } from "@/components/like-button"
import { RatingButton } from "@/components/rating-button"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string; slug: string }>
}): Promise<Metadata> {
  const { id, category } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("category_products").select("*").eq("id", id).single()

  if (!product) {
    return {
      title: "Product Not Found | DPITER.shop",
      description: "The product you're looking for is not available.",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"
  const productUrl = `${baseUrl}/products/${category}/${id}/${product.title.toLowerCase().replace(/\s+/g, "-")}`

  return {
    title: `${product.title} - ${product.brand || category} | Buy Online at Best Price | DPITER.shop`,
    description: `Shop ${product.title} by ${product.brand || category} at ₹${product.price}. ${product.original_price ? `Save ${Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off` : "Best price online"}. Buy from trusted sellers on Amazon, Flipkart, Meesho. Free delivery, easy returns. 4.1★ rated fashion discovery platform.`,
    keywords: `${product.title}, ${product.brand || ""}, ${category} online, buy ${category}, ${product.title} price, ${product.title} online shopping, fashion shopping, dpiter shop, amazon ${category}, flipkart ${category}, meesho ${category}`,
    openGraph: {
      title: `${product.title} - ₹${product.price}`,
      description: `Shop ${product.title} at best price. ${product.original_price ? `${Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off` : "Great deal"}!`,
      images: [product.image_url || "/placeholder.svg"],
      url: productUrl,
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} - ₹${product.price}`,
      description: `Shop ${product.title} online at DPITER.shop`,
      images: [product.image_url || "/placeholder.svg"],
    },
    alternates: {
      canonical: productUrl,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string; slug: string }>
}) {
  try {
    const { category, id, slug } = await params
    const supabase = await createClient()

    console.log("[v0] Loading product:", { category, id, slug })

    const { data: product, error: productError } = await supabase
      .from("category_products")
      .select("*")
      .eq("id", id)
      .single()

    if (productError) {
      console.error("[v0] Product fetch error:", productError)
      notFound()
    }

    if (!product) {
      console.log("[v0] Product not found")
      notFound()
    }

    const { data: relatedProducts } = await supabase
      .from("category_products")
      .select("*")
      .eq("category", category)
      .neq("id", id)
      .limit(6)

    const hasOriginalPrice = product.original_price && product.original_price > product.price
    const discountPercentage = hasOriginalPrice
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0

    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <main className="flex-1 pb-20 pt-4">
          <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8">
            {/* Left: Image Gallery */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <div className="relative w-full">
                <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex-shrink-0 w-full snap-center">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg lg:rounded-xl"
                      style={{
                        backgroundImage: `url("${product.image_url || "/placeholder.svg?height=500&width=500"}")`,
                      }}
                    ></div>
                  </div>
                  <div className="flex-shrink-0 w-full snap-center">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg lg:rounded-xl"
                      style={{
                        backgroundImage: `url("${product.image_url || "/placeholder.svg?height=500&width=500"}")`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                  <div className="h-2 w-4 rounded-full bg-primary"></div>
                  <div className="h-2 w-2 rounded-full bg-white/50 backdrop-blur-sm"></div>
                </div>
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="p-4 lg:p-0 flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-lg font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">
                      {product.brand || "BRAND"}
                    </p>
                    <h1 className="text-xl lg:text-2xl font-display font-semibold text-text-primary-light dark:text-text-primary-dark">
                      {product.title}
                    </h1>
                  </div>
                  <WishlistButton productId={product.id} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="material-symbols-outlined text-lg">star_half</span>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                    (4.1) 1,283 ratings
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-3xl lg:text-4xl font-bold font-sans text-text-primary-light dark:text-white">
                  ₹{product.price}
                </p>
                {hasOriginalPrice && (
                  <>
                    <p className="text-base lg:text-lg font-normal text-text-secondary-light dark:text-text-secondary-dark line-through">
                      ₹{product.original_price}
                    </p>
                    <p className="text-base lg:text-lg font-bold text-green-600 dark:text-green-400">
                      {discountPercentage}% off
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 lg:mt-6">
                <button className="w-full h-12 lg:h-14 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark font-bold text-base lg:text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Add to Cart
                </button>
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full h-12 lg:h-14 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-base lg:text-lg transition-colors"
                >
                  Buy Now
                </a>
              </div>

              <div className="flex gap-4 mt-4">
                <LikeButton itemId={product.id} itemType="product" />
                <RatingButton itemId={product.id} itemType="product" />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="font-display text-xl lg:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
                  Product Details
                </h2>
                <div className="space-y-2 text-sm lg:text-base text-text-secondary-light dark:text-text-secondary-dark">
                  <p>Brand: {product.brand || "Unknown"}</p>
                  <p>Category: {product.category}</p>
                  <p>Price: ₹{product.price}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="h-2 bg-gray-100 dark:bg-gray-800/50 mt-8"></div>

          <div className="py-6 max-w-7xl mx-auto">
            <div className="px-4 lg:px-8 mb-4">
              <h2 className="font-display text-xl lg:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                Related Products
              </h2>
            </div>
            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-px px-4 lg:px-8">
              <div className="flex items-stretch gap-4">
                {relatedProducts?.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.category}/${related.id}/${related.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border border-black/10 dark:border-white/10 rounded-lg w-44 hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
                      style={{
                        backgroundImage: `url("${related.image_url || "/placeholder.svg?height=500&width=500"}")`,
                      }}
                    ></div>
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <p className="text-sm font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">
                        {related.brand || "BRAND"}
                      </p>
                      <p className="text-text-primary-light dark:text-white text-xs font-semibold leading-snug truncate">
                        {related.title}
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-1">
                        <p className="text-text-primary-light dark:text-white text-base font-bold">₹{related.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("[v0] Error in ProductDetailPage:", error)
    notFound()
  }
}
