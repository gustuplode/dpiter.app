import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { WishlistButton } from "@/components/wishlist-button"
import { RatingButton } from "@/components/rating-button"
import { RatingDisplay } from "@/components/rating-display"
import { generateSlug } from "@/lib/utils"
import { ShoppingBag } from 'lucide-react'
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string; slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: product } = await supabase
      .from("products")
      .select("*, collections(*)")
      .eq("id", params.id)
      .single()

    if (!product) return { title: "Product - Dpiter" }

    return {
      title: `${product.title} - ${product.brand} | Dpiter`,
      description: `Buy ${product.title} from ${product.brand} at ₹${product.price}. Shop the best deals.`,
    }
  } catch (error) {
    return { 
      title: "Product - Dpiter",
      description: "Shop the best deals at Dpiter."
    }
  }
}

export default async function CollectionProductDetailPage({ params }: { params: { id: string; slug: string } }) {
  const supabase = await createClient()

  let product = null
  let suggestedProducts: any[] = []

  try {
    // Fetch the product with collection info
    const { data, error } = await supabase
      .from("products")
      .select("*, collections(*)")
      .eq("id", params.id)
      .single()

    if (error) throw error
    
    product = data

    if (product) {
      // Check if slug matches
      const correctSlug = generateSlug(product.title)
      if (params.slug !== correctSlug) {
        redirect(`/products/collection/${params.id}/${correctSlug}`)
      }

      // Fetch suggested products from the same collection
      try {
        const { data: suggested } = await supabase
          .from("products")
          .select("*")
          .eq("collection_id", product.collection_id)
          .eq("is_visible", true)
          .neq("id", params.id)
          .limit(10)
        
        suggestedProducts = suggested || []
      } catch (e) {
        // Ignore errors for suggested products
      }
    }
  } catch (e) {
    // Product not found or error fetching
  }

  if (!product) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">Product not found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              This product may have been removed or doesn't exist.
            </p>
            <Link href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go back to home
            </Link>
          </div>
        </div>
        <FooterLinks />
        <BottomNav />
      </div>
    )
  }

  return (
    <>
      <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
        <div className="container mx-auto max-w-7xl px-4 py-4 pb-32">
          {/* Product Image and Info Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-4">
            <div className="relative">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-[400px] md:h-[500px] object-cover bg-white"
              />
              <div className="absolute top-4 left-4">
                <RatingButton itemId={product.id} itemType="product" />
              </div>
              <div className="absolute top-4 right-4">
                <RatingDisplay itemId={product.id} itemType="product" />
              </div>
            </div>

            <div className="p-4">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {product.title}
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400 mb-3">{product.brand}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{product.price}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a
                  href={product.affiliate_link || "https://amzn.to/49SNT2h"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Buy Now
                </a>
                <WishlistButton
                  productId={product.id}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors w-full"
                  showText
                />
              </div>

              {/* Product Details */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Product Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Brand</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Collection</span>
                    <span className="font-medium text-slate-900 dark:text-white">{product.collections?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Price</span>
                    <span className="font-medium text-slate-900 dark:text-white">₹{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Products */}
          {suggestedProducts && suggestedProducts.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[5px] md:gap-x-4 gap-y-4">
                {suggestedProducts.map((suggestedProduct) => (
                  <Link
                    key={suggestedProduct.id}
                    href={`/products/collection/${suggestedProduct.id}/${generateSlug(suggestedProduct.title)}`}
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm aspect-[3/4]">
                      <img
                        src={suggestedProduct.image_url || "/placeholder.svg"}
                        alt={suggestedProduct.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2">
                        <RatingDisplay itemId={suggestedProduct.id} itemType="product" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {suggestedProduct.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{suggestedProduct.brand}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">₹{suggestedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <FooterLinks />
        <BottomNav />
      </div>
    </>
  )
}
