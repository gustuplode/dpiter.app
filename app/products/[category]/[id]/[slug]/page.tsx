import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { CurrencyDisplay } from "@/components/currency-display"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { ShareButton } from "@/components/share-button"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string; slug: string }>
}) {
  const { category, id, slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("category_products")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .single()

  if (!product) {
    notFound()
  }

  const { data: relatedProducts } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", category)
    .eq("is_visible", true)
    .neq("id", id)
    .limit(12)

  const { data: allCategoryProducts } = await supabase
    .from("category_products")
    .select("*")
    .eq("is_visible", true)
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(24)

  const { data: ratings } = await supabase
    .from("ratings")
    .select("*")
    .eq("item_id", id)
    .eq("item_type", "product")
    .order("created_at", { ascending: false })

  const avgRating = ratings && ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 4.1
  const ratingCount = ratings?.length || 0

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const keywordsList = product.keywords
    ? product.keywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean)
    : []

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <main className="flex-1 pb-20">
        {/* Desktop Layout - Flipkart Style */}
        <div className="hidden lg:block max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-8">
            {/* Left - Image Gallery (Sticky) */}
            <div className="w-[400px] flex-shrink-0">
              <div className="sticky top-4">
                <ProductImageGallery images={[product.image_url, product.image_url]} title={product.title} />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a
                    href={product.affiliate_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-14 rounded-sm bg-[#ff9f00] hover:bg-[#e89200] text-white font-bold text-lg gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    ADD TO CART
                  </a>
                  <a
                    href={product.affiliate_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-14 rounded-sm bg-[#fb641b] hover:bg-[#e85d19] text-white font-bold text-lg gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined">bolt</span>
                    BUY NOW
                  </a>
                </div>
              </div>
            </div>

            {/* Right - Product Details */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span>/</span>
                <Link href={`/${category}`} className="hover:text-primary capitalize">
                  {category}
                </Link>
                <span>/</span>
                <span className="text-gray-700 dark:text-gray-300 truncate">{product.title}</span>
              </nav>

              {/* Brand */}
              <p className="text-lg text-primary font-medium mb-1">{product.brand || "Brand"}</p>

              {/* Title */}
              <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded">
                  {avgRating.toFixed(1)}
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {ratingCount.toLocaleString()} Ratings & Reviews
                </span>
                <span className="text-green-600 text-sm font-medium">Assured</span>
              </div>

              {/* Price Section */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    <CurrencyDisplay price={product.price} />
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        <CurrencyDisplay price={product.original_price} />
                      </span>
                      <span className="text-lg font-bold text-green-600">{discountPercent}% off</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">inclusive of all taxes</p>
              </div>

              <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-6">
                <WishlistButton productId={product.id} showLabel />
                <RatingButton
                  itemId={product.id}
                  itemType="product"
                  variant="like"
                  showLabel
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500"
                />
                <RatingButton itemId={product.id} itemType="product" showLabel />
                <ShareButton
                  title={product.title}
                  description={product.description || `Check out ${product.title} on Dpiter`}
                  showLabel
                />
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Product Description</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Highlights</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                    Premium Quality Material
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                    Easy Returns & Exchange
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                    Brand: {product.brand}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                    Fast Delivery Available
                  </li>
                </ul>
              </div>

              {/* Offers */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Available Offers</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-green-600 text-base">local_offer</span>
                    <span>
                      <strong>Bank Offer</strong> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-green-600 text-base">local_offer</span>
                    <span>
                      <strong>Bank Offer</strong> 10% off on ICICI Bank Credit Cards, up to ₹1500
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="material-symbols-outlined text-green-600 text-base">local_offer</span>
                    <span>
                      <strong>Special Price</strong> Get extra {discountPercent}% off (price inclusive of
                      cashback/coupon)
                    </span>
                  </li>
                </ul>
              </div>

              {/* Delivery */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Delivery</h3>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Free Delivery</p>
                    <p className="text-xs text-gray-500">Delivery by 3-5 business days</p>
                  </div>
                </div>
              </div>

              {keywordsList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tags & Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {keywordsList.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Reviews */}
              <ProductReviews ratings={ratings || []} avgRating={avgRating} ratingCount={ratingCount} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Image Carousel */}
          <div className="relative w-full pt-4">
            <div className="flex overflow-x-auto snap-x snap-mandatory [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex-shrink-0 w-full snap-center">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                  style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
                ></div>
              </div>
              <div className="flex-shrink-0 w-full snap-center">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover"
                  style={{ backgroundImage: `url("${product.image_url || "/placeholder.svg"}")` }}
                ></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2">
              <div className="h-2 w-4 rounded-full bg-primary"></div>
              <div className="h-2 w-2 rounded-full bg-white/50 backdrop-blur-sm"></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 flex flex-col gap-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold uppercase text-text-secondary-light dark:text-text-secondary-dark tracking-wide">
                    {product.brand || "BRAND"}
                  </p>
                  <h1 className="text-xl font-display font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {product.title}
                  </h1>
                </div>
                <WishlistButton productId={product.id} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {avgRating.toFixed(1)}
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </span>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  {ratingCount.toLocaleString()} ratings
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold font-sans text-text-primary-light dark:text-white">
                <CurrencyDisplay price={product.price} />
              </p>
              {product.original_price && (
                <>
                  <p className="text-base font-normal text-text-secondary-light dark:text-text-secondary-dark line-through">
                    <CurrencyDisplay price={product.original_price} />
                  </p>
                  <p className="text-base font-bold text-green-600 dark:text-green-400">{discountPercent}% off</p>
                </>
              )}
            </div>

            {product.description && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {keywordsList.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {keywordsList.slice(0, 8).map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {keywordsList.length > 8 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium text-primary">
                      +{keywordsList.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4">
              <RatingButton
                itemId={product.id}
                itemType="product"
                variant="like"
                showLabel
                className="w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2"
              />
              <a
                href={product.affiliate_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-12 rounded-lg bg-orange-600 text-white font-bold text-base gap-2"
              >
                <span className="material-symbols-outlined text-lg">bolt</span>
                Buy Now
              </a>
            </div>

            <div className="flex items-center justify-around py-3 border-t border-gray-200 dark:border-gray-700">
              <WishlistButton productId={product.id} showLabel className="flex items-center gap-1 text-sm" />
              <RatingButton
                itemId={product.id}
                itemType="product"
                showLabel
                className="flex items-center gap-1 text-sm"
              />
              <ShareButton
                title={product.title}
                description={product.description || `Check out ${product.title} on Dpiter`}
                showLabel
              />
            </div>
          </div>

          <div className="h-2 bg-gray-100 dark:bg-gray-800/50"></div>

          {/* Similar Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white px-3 mb-2">Similar Products</h2>
              <div className="columns-2 md:columns-4 gap-0">
                {relatedProducts.slice(0, 6).map((item) => {
                  const itemDiscount = item.original_price
                    ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                    : 0
                  const itemWidth = item.image_width || 1080
                  const itemHeight = item.image_height || 1080
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.category || category}/${item.id}/${item.slug || item.id}`}
                      className="break-inside-avoid flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="relative w-full bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url("${item.image_url || "/placeholder.svg"}")`,
                          aspectRatio: `${itemWidth} / ${itemHeight}`,
                        }}
                      >
                        {itemDiscount > 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {itemDiscount}% OFF
                          </span>
                        )}
                        <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                          <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                        </div>
                      </div>
                      <div className="p-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-800">
                        <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                          {item.brand || "Brand"}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-gray-900 dark:text-white text-sm font-bold">
                            <CurrencyDisplay price={item.price} />
                          </p>
                          {item.original_price && (
                            <p className="text-gray-400 text-[10px] line-through">
                              <CurrencyDisplay price={item.original_price} />
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="h-2 bg-gray-100 dark:bg-gray-800/50"></div>

          {/* More Products */}
          {allCategoryProducts && allCategoryProducts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white px-3 mb-2">
                More Products You May Like
              </h2>
              <div className="columns-2 md:columns-4 gap-0">
                {allCategoryProducts.map((item) => {
                  const itemDiscount = item.original_price
                    ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                    : 0
                  const itemWidth = item.image_width || 1080
                  const itemHeight = item.image_height || 1080
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.category || "fashion"}/${item.id}/${item.slug || item.id}`}
                      className="break-inside-avoid flex flex-col bg-white dark:bg-gray-800 overflow-hidden border-b border-r border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="relative w-full bg-center bg-no-repeat bg-cover"
                        style={{
                          backgroundImage: `url("${item.image_url || "/placeholder.svg"}")`,
                          aspectRatio: `${itemWidth} / ${itemHeight}`,
                        }}
                      >
                        {itemDiscount > 0 && (
                          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {itemDiscount}% OFF
                          </span>
                        )}
                        <div className="absolute bottom-1.5 left-1.5 flex items-center bg-white/95 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm">
                          <span className="text-[10px] font-semibold text-gray-800">4.1</span>
                        </div>
                      </div>
                      <div className="p-2 flex flex-col gap-1 bg-gray-50 dark:bg-gray-800">
                        <p className="text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider">
                          {item.brand || "Brand"}
                        </p>
                        <p className="text-gray-800 dark:text-gray-200 text-[11px] font-normal leading-snug line-clamp-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-gray-900 dark:text-white text-sm font-bold">
                            <CurrencyDisplay price={item.price} />
                          </p>
                          {item.original_price && (
                            <p className="text-gray-400 text-[10px] line-through">
                              <CurrencyDisplay price={item.original_price} />
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
