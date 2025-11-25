import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"

  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, brand, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  const { data: products } = await supabase
    .from("products")
    .select("id, title, brand_name, collection_id, updated_at")
    .eq("is_visible", true)
    .order("updated_at", { ascending: false })

  const collectionUrls =
    collections?.map((collection) => ({
      url: `${baseUrl}/collections/${collection.id}`,
      lastModified: new Date(collection.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.9,
      // Add title metadata for better search appearance
      alternates: {
        languages: {
          'en': `${baseUrl}/collections/${collection.id}`,
        },
      },
    })) || []

  const productUrls =
    products?.map((product) => ({
      url: `${baseUrl}/collections/${product.collection_id}#product-${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8, // Increased priority for products
    })) || []

  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]

  return [...staticPages, ...collectionUrls, ...productUrls]
}
