import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"

  const { data: categoryProducts } = await supabase
    .from("category_products")
    .select("id, title, brand, category, slug, updated_at")
    .eq("is_visible", true)
    .order("updated_at", { ascending: false })

  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  const categoryProductUrls =
    categoryProducts?.map((product) => {
      const slug = product.slug || product.title.toLowerCase().replace(/\s+/g, "-")
      return {
        url: `${baseUrl}/products/${product.category}/${product.id}/${slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }
    }) || []

  const collectionUrls =
    collections?.map((collection) => {
      const slug = collection.slug || collection.title.toLowerCase().replace(/\s+/g, "-")
      return {
        url: `${baseUrl}/collections/${collection.id}/${slug}`,
        lastModified: new Date(collection.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }
    }) || []

  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/all-products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
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
  ]

  return [...staticPages, ...collectionUrls, ...categoryProductUrls]
}
