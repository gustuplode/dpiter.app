import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.vercel.app"

  // Fetch all published collections
  const { data: collections } = await supabase
    .from("collections")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false })

  // Fetch all visible products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_visible", true)
    .order("updated_at", { ascending: false })

  const collectionUrls =
    collections?.map((collection) => ({
      url: `${baseUrl}/collections/${collection.slug}`,
      lastModified: new Date(collection.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...collectionUrls,
  ]
}
