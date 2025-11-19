import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"
import { CollectionContent } from "@/components/collection-content"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase.from("collections").select("title, brand, image_url").eq("id", id).single()

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"
  const collectionUrl = `${baseUrl}/collections/${id}`
  const imageUrl = collection.image_url || `${baseUrl}/placeholder-logo.png`

  return {
    title: `${collection.title} - ${collection.brand} | Best ${collection.brand} Collection | DPITER.shop`,
    description: `Shop trending ${collection.title} from ${collection.brand} at DPITER.shop. Curated fashion collection with secure redirect to Amazon, Flipkart, Meesho & Myntra. Best prices guaranteed. Updated daily.`,
    keywords: [
      collection.title,
      collection.brand,
      `${collection.brand} collection`,
      `${collection.title} online`,
      `buy ${collection.title}`,
      `${collection.brand} fashion`,
      `${collection.title} india`,
      `best ${collection.brand} collection`,
      `trending ${collection.title}`,
      `${collection.title} low price`,
      `${collection.brand} boys fashion`,
      `${collection.title} men`,
      "dpiter collection",
      "curated fashion collection",
    ],
    openGraph: {
      title: `${collection.title} - ${collection.brand} | DPITER.shop`,
      description: `Shop ${collection.title} from ${collection.brand}. Secure redirect to trusted marketplaces. Best deals guaranteed.`,
      url: collectionUrl,
      siteName: "DPITER.shop",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${collection.title} - ${collection.brand}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} - ${collection.brand}`,
      description: `Shop ${collection.title} from ${collection.brand} at DPITER.shop`,
      images: [imageUrl],
    },
    alternates: {
      canonical: collectionUrl,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"
  
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/collections/${id}`,
    name: `${collection.title} - ${collection.brand}`,
    description: `Shop trending ${collection.title} from ${collection.brand}. Curated fashion with secure redirect to trusted marketplaces.`,
    url: `${baseUrl}/collections/${id}`,
    image: collection.image_url || `${baseUrl}/placeholder-logo.png`,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "DPITER.shop",
      url: baseUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: collection.brand,
          item: `${baseUrl}/collections/${id}`,
        },
      ],
    },
    numberOfItems: products?.length || 0,
    itemListElement: products?.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        brand: {
          "@type": "Brand",
          name: product.brand_name,
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: product.affiliate_link,
        },
        image: product.image_url,
        description: `${product.title} from ${product.brand_name} available at DPITER.shop`,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <CollectionContent collection={collection} products={products || []} />
      <FooterLinks />
      <BottomNav />
    </>
  )
}
