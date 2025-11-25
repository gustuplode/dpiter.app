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
  const productUrl = `${baseUrl}/products/${category}/${id}/${product.slug || product.title.toLowerCase().replace(/\s+/g, "-")}`

  return {
    title: `${product.title} - ${product.brand || category} | Buy Online at Best Price | DPITER.shop`,
    description: `Shop ${product.title} by ${product.brand || category} at ₹${product.price}. Best price online. Buy from trusted sellers on Amazon, Flipkart, Meesho. Free delivery, easy returns. 4.1★ rated fashion discovery platform.`,
    keywords: `${product.title}, ${product.brand || ""}, ${category} online, buy ${category}, ${product.title} price, ${product.title} online shopping, fashion shopping, dpiter shop, amazon ${category}, flipkart ${category}, meesho ${category}`,
    openGraph: {
      title: `${product.title} - ₹${product.price}`,
      description: `Shop ${product.title} at best price. Great deal!`,
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
  const { category, id } = await params
  const supabase = await createClient()

  // Fetch the product
  const { data: product, error } = await supabase.from("category_products").select("*").eq("id", id).single()

  if (error || !product) {
    console.error("[v0] Product fetch error:", error)
    notFound()
  }

  // Fetch related products from the same category
  const { data: relatedProducts } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", category)
    .neq("id", id)
    .limit(8)

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#f5f5f5] dark:bg-gray-900">
      <main className="flex-1 pb-20 pt-4">
        {/* Desktop Layout: Two Column */}
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-6">
          {/* Left Column: Image Gallery (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="relative w-full px-4 lg:px-0">
              <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-4">
                {/* Main Product Image */}
                <div className="flex-shrink-0 w-full snap-center">
                  <div
                    className="w-full bg-white dark:bg-gray-800 bg-center bg-no-repeat aspect-square bg-contain rounded-xl border border-black/5 dark:border-white/10 shadow-sm"
                    style={{
                      backgroundImage: `url("${product.image_url || "/placeholder.svg?height=600&width=600"}")`,
                    }}
                  ></div>
                </div>
                {/* Duplicate image for carousel effect */}
                <div className="flex-shrink-0 w-full snap-center">
                  <div
                    className="w-full bg-white dark:bg-gray-800 bg-center bg-no-repeat aspect-square bg-contain rounded-xl border border-black/5 dark:border-white/10 shadow-sm"
                    style={{
                      backgroundImage: `url("${product.image_url || "/placeholder.svg?height=600&width=600"}")`,
                    }}
                  ></div>
                </div>
              </div>
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
                <div className="h-2 w-4 rounded-full bg-[#8A3224]"></div>
                <div className="h-2 w-2 rounded-full bg-white/60 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="p-4 lg:p-0 flex flex-col gap-4 lg:gap-6">
            {/* Brand and Title */}
            <div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm lg:text-base font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                    {product.brand || "BRAND"}
                  </p>
                  <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">
                    {product.title}
                  </h1>
                </div>
                <WishlistButton productId={product.id} />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                  <span className="material-symbols-outlined text-lg">star_half</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">4.1 (1,283 ratings)</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-baseline gap-3">
                <p className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">₹{product.price}</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="w-full h-14 rounded-xl bg-white dark:bg-gray-800 border-2 border-[#8A3224] text-[#8A3224] font-bold text-lg hover:bg-[#8A3224]/5 dark:hover:bg-[#8A3224]/10 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
              <a
                href={product.affiliate_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-14 rounded-xl bg-[#8A3224] hover:bg-[#8A3224]/90 text-white font-bold text-lg transition-colors gap-2 shadow-md"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Buy Now
              </a>
            </div>

            {/* Like and Rating Buttons */}
            <div className="flex gap-4 pt-2">
              <LikeButton itemId={product.id} itemType="product" />
              <RatingButton itemId={product.id} itemType="product" />
            </div>

            {/* Product Information */}
            <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Details</h2>
              <div className="space-y-3 text-base text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500">business_center</span>
                  <span>
                    <strong>Brand:</strong> {product.brand || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500">category</span>
                  <span>
                    <strong>Category:</strong> {product.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-500">sell</span>
                  <span>
                    <strong>Price:</strong> ₹{product.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Features/Benefits */}
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">verified</span>
                Why Buy From Us?
              </h3>
              <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>100% Authentic Products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Fast & Free Delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Easy Returns & Exchanges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>Best Price Guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="h-2 bg-gray-200 dark:bg-gray-800 mt-12"></div>

        <div className="py-8 max-w-7xl mx-auto">
          <div className="px-4 lg:px-8 mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Similar Products</h2>
          </div>
          <div className="overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 lg:px-8">
            <div className="flex items-stretch gap-4">
              {relatedProducts && relatedProducts.length > 0 ? (
                relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.category}/${related.id}/${related.slug || related.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col bg-white dark:bg-gray-800 overflow-hidden border border-black/10 dark:border-white/10 rounded-xl w-48 hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <div
                      className="relative w-full bg-center bg-no-repeat aspect-square bg-cover"
                      style={{
                        backgroundImage: `url("${related.image_url || "/placeholder.svg?height=300&width=300"}")`,
                      }}
                    >
                      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold">
                        4.1★
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-1 flex-1">
                      <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                        {related.brand || "BRAND"}
                      </p>
                      <p className="text-gray-900 dark:text-white text-sm font-semibold leading-snug line-clamp-2">
                        {related.title}
                      </p>
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        <p className="text-gray-900 dark:text-white text-lg font-bold">₹{related.price}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 px-4">No related products found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
