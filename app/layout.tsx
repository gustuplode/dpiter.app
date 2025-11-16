import type React from "react"
import type { Metadata } from "next"
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LoadingBar } from "@/components/loading-bar"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"),
  title: {
    default: "DPITER.shop – Trending Fashion from Amazon, Meesho, Flipkart, Myntra",
    template: "%s | DPITER.shop"
  },
  description:
    "DPITER.shop - Curated fashion platform listing trending outfits from Amazon, Flipkart, Meesho, Myntra & eBay. 100% secure redirect. No payment on our website. Boys clothing, menswear, premium collections updated daily. Safe shopping guaranteed.",
  keywords: [
    // Primary Brand Keywords
    "dpiter shop", "dpiter", "dpiter.shop", "dpiter fashion", "dpiter boys clothing", "dpiter collections",
    "dpiter amazon", "dpiter flipkart", "dpiter meesho", "dpiter myntra", "dpiter ebay",
    "dpiter curated picks", "dpiter trending outfits", "dpiter online store", "dpiter shopping",
    "dpiter premium selection", "dpiter online fashion store", "dpiter alternative shopping",
    
    // Competitor Comparison Keywords (High Priority)
    "amazon vs dpiter", "meesho vs dpiter", "flipkart vs dpiter", "myntra vs dpiter",
    "sites like amazon", "sites like flipkart", "sites like meesho", "sites like myntra",
    "amazon alternative india", "meesho alternative", "flipkart alternative shopping",
    "better than amazon", "better than meesho", "better than flipkart",
    
    // Marketplace Redirect Keywords
    "amazon fashion curated", "meesho fashion curated", "flipkart clothing 2025",
    "myntra curated collections", "ebay fashion india", "trusted redirect clothing website",
    "secure clothing website India", "safe shopping redirect", "trusted marketplace fashion",
    
    // Boys & Mens Fashion (Core Target)
    "boys fashion India", "latest mens fashion India", "boys clothing online",
    "boys fashion 2025", "trending boys outfits India", "boys premium fashion",
    "mens fashion curated", "boys outfit ideas", "stylish boys clothing",
    "boys fashion trends", "boys casual wear", "boys formal wear",
    
    // Best & Top Keywords (High Volume)
    "best shopping website for boys", "best clothing website for boy", "best clothing website India",
    "best fashion website India", "best online shopping India", "top fashion website",
    "best curated fashion India", "top affiliate clothing", "best fashion collections",
    "best boys clothing store", "best menswear website", "top shopping site India",
    
    // Price & Value Keywords
    "full outfit collection low price", "affordable fashion India", "cheap clothes online",
    "discount fashion India", "budget shopping India", "low price fashion",
    "premium brands low price", "affordable boys clothing", "cheap boys fashion",
    "discount boys outfits", "sale fashion India", "clearance boys clothing",
    
    // Shopping Experience Keywords
    "online shopping India", "online fashion store", "ecommerce fashion India",
    "fashion marketplace", "curated shopping India", "trending fashion online",
    "latest fashion India", "new fashion arrivals", "fashion deals India",
    
    // Product Categories (High Volume)
    "boys shirts", "boys jeans", "boys t-shirts", "boys jackets", "boys shoes",
    "boys accessories", "boys ethnic wear", "boys western wear", "boys sportswear",
    "mens shirts", "mens jeans", "mens jackets", "mens shoes", "mens fashion",
    "full outfit sets", "combo offers clothing", "outfit bundles",
    
    // Fashion Trends (Seasonal & Evergreen)
    "trending fashion 2025", "latest fashion trends", "fashion trends India",
    "summer fashion boys", "winter collection boys", "monsoon fashion",
    "festival fashion", "casual fashion boys", "party wear boys",
    
    // Quality & Trust Keywords
    "branded clothes", "original products", "authentic fashion", "quality clothing",
    "genuine products", "verified sellers", "trusted fashion website",
    "safe online shopping", "secure shopping India", "reliable fashion store",
    
    // Location Based Keywords
    "online shopping india", "fashion india", "shopping website india",
    "india fashion store", "mumbai fashion", "delhi fashion online",
    "bangalore shopping", "fashion usa", "fashion uk", "international shipping",
    
    // Kids Fashion
    "kids fashion curated", "boys kids clothing", "children fashion India",
    "kids outfit ideas", "kids fashion trends", "affordable kids fashion",
    
    // Style Keywords
    "streetwear india", "casual fashion", "formal fashion boys",
    "sporty fashion", "ethnic fashion boys", "western fashion India",
    "hipster fashion", "minimalist fashion", "trendy outfits",
    
    // Shopping Features
    "fashion collections", "curated collections", "handpicked fashion",
    "exclusive collections", "limited edition fashion", "new arrivals",
    "trending collections", "popular styles", "best sellers fashion",
    
    // Generic High-Volume Keywords
    "shopping", "online shopping", "fashion", "clothing", "clothes",
    "outfits", "style", "trends", "deals", "offers", "sale",
    "menswear", "boyswear", "apparel", "garments", "lifestyle",
    
    // Brand Quality Keywords
    "premium fashion", "luxury fashion affordable", "designer fashion",
    "brand name clothing", "top brands India", "fashion brands",
    
    // Shopping Intent Keywords
    "buy boys clothing", "shop boys fashion", "order boys outfits",
    "purchase boys clothes", "fashion shopping online", "clothing store online",
    
    // Comparison Shopping
    "compare fashion prices", "best deals fashion", "lowest price fashion",
    "fashion price comparison", "discount shopping", "fashion offers today",
    
    // User Intent Keywords
    "fashion for boys", "outfits for men", "clothing for boys",
    "fashion ideas boys", "outfit inspiration", "style guide boys",
    
    // Long-tail Keywords
    "best online shopping website for boys clothing in india",
    "affordable fashion website like meesho flipkart",
    "curated fashion collections from amazon myntra",
    "trending boys outfits low price india",
    "secure fashion redirect website",
    "trusted marketplace clothing curated",
    "premium boys fashion affordable prices",
    "latest fashion trends boys india 2025",
    
    // Additional Marketplace Keywords
    "amazon fashion redirect", "flipkart fashion curated", "meesho clothing collections",
    "myntra fashion picks", "ebay fashion india", "marketplace fashion aggregator",
    "multi-marketplace fashion", "fashion from trusted sellers",
    
    // Safety & Security Keywords
    "safe online fashion shopping", "secure payment fashion", "trusted fashion redirect",
    "verified marketplace fashion", "guaranteed safe shopping", "no payment collection",
    "redirect to trusted sites", "secure checkout fashion",
    
    // Discovery Keywords
    "discover new fashion", "explore fashion collections", "find trending outfits",
    "fashion discovery platform", "outfit finder", "style discovery",
    
    // Value Proposition Keywords
    "curated fashion deals", "handpicked collections", "expert curated fashion",
    "best fashion selections", "quality fashion picks", "trending fashion only",
    
    // Additional High-Volume Terms
    "fashion ecommerce", "online apparel", "clothing marketplace",
    "fashion aggregator", "style platform", "outfit collections",
    "fashion hub india", "clothing portal", "fashion destination",
    
    // Mobile & Convenience
    "mobile shopping fashion", "easy fashion shopping", "quick fashion buying",
    "convenient shopping india", "one-click fashion", "fast fashion shopping",
    
    // Social Proof Keywords
    "popular fashion website", "trending shopping site", "viral fashion india",
    "most visited fashion site", "top rated fashion website", "recommended fashion store",
    
    // Additional Competitor Keywords
    "ajio alternative", "nykaa fashion alternative", "tata cliq alternative",
    "snapdeal fashion alternative", "shopclues fashion", "paytm mall fashion",
    
    // Festival & Occasion Keywords
    "diwali fashion", "eid collection", "christmas fashion", "new year outfits",
    "wedding fashion boys", "party wear collection", "festive fashion india",
    
    // Final High-Intent Keywords
    "buy now fashion", "shop latest fashion", "order trending outfits",
    "get best deals fashion", "fashion online india", "clothing online store"
  ],
  authors: [{ name: "DPITER.shop", url: "https://dpiter.shop" }],
  creator: "DPITER.shop",
  publisher: "DPITER.shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DPITER.shop – Curated Fashion from Amazon, Meesho, Flipkart, Myntra",
    description: "100% secure fashion redirect platform. Discover trending outfits from trusted marketplaces. No payment on our site. Updated daily with premium selections.",
    type: "website",
    siteName: "DPITER.shop",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png",
        width: 1200,
        height: 630,
        alt: "DPITER.shop – Curated Fashion from Amazon, Meesho, Flipkart, Myntra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DPITER.shop – Trending Fashion Picks",
    description: "Curated fashion from Amazon, Flipkart, Meesho, Myntra. Secure redirect. No payment on our site.",
    creator: "@dpiter",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw",
    other: {
      "msvalidate.01": "FC0ED3E2CD6BC6E015201B4F0DABF03E",
      monetag: "8e701858f43c71973d12ef290cd91d1f",
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop",
  },
  other: {
    "google-adsense-account": "ca-pub-8731726233953156",
  },
  manifest: "/manifest.json", // Added manifest link for PWA support and logo display in search
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DPITER.shop",
    alternateName: ["Dpiter", "DPITER", "Dpiter Shop"],
    description: "Curated fashion platform listing trending products from Amazon, Flipkart, Meesho, Myntra and eBay. 100% secure redirect - no payment taken on our website.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    sameAs: [
      "https://www.facebook.com/share/1PwVj2Bg4Z/",
      "https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
    ],
    publisher: {
      "@type": "Organization",
      name: "DPITER.shop",
      logo: {
        "@type": "ImageObject",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png"
      }
    }
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DPITER.shop",
    alternateName: "Dpiter",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png",
    description: "Curated fashion discovery platform featuring trending collections from Amazon, Flipkart, Meesho, Myntra and eBay. Safe redirect service with no payment processing.",
    foundingDate: "2024",
    slogan: "Discover Trending Fashion from Trusted Marketplaces",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English", "Hindi"]
    },
    sameAs: [
      "https://www.facebook.com/share/1PwVj2Bg4Z/",
      "https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
    ],
    areaServed: {
      "@type": "Country",
      name: ["India", "United States", "United Kingdom"]
    }
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-light-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#F97316" />
        <meta name="google-site-verification" content="oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${poppins.className} font-display antialiased`}>
        <LoadingBar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
