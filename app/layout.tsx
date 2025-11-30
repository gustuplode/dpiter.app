import type React from "react"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"
import type { Metadata, Viewport } from "next"

const dpiterKeywords = [
  // Primary domain variations
  "dpiter",
  "dpiter.shop",
  "dpiter.com",
  "dpiter.in",
  "dpiter.app",
  "dpiter.ai",
  "dpiter.co",
  "dpiter.net",
  "dpiter.org",
  "dpiter.io",
  "dpiter.store",
  "dpiter.online",
  "dpiter.site",
  "dpiter.web",
  "dpiter.biz",
  "dpiter.info",
  "dpiter.tech",
  "dpiter.world",
  "dpiter.global",
  // India focused
  "dpiterindia",
  "dpiterindia.com",
  "dpiterindia.in",
  "indiadpiter",
  "india dpiter",
  "dpiter india",
  "dpiter bharat",
  "bharatdpiter",
  "dpiter indian shopping",
  "dpiter india online",
  "dpiter india fashion",
  "dpiter india products",
  // Spelling variations
  "deepiter",
  "dipiter",
  "dpitar",
  "dpeeter",
  "dipitar",
  "dpiiter",
  "dpitter",
  "dppiter",
  "dpeter",
  "depitr",
  "dpiter shop",
  "deepiter shop",
  "dipiter shop",
  "dpitar shop",
  "dpeeter shop",
  "dipitar shop",
  "d-piter",
  "d piter",
  "dee piter",
  "depiter",
  "dypiter",
  "dpyter",
  "dipitr",
  "dpitir",
  "dpitr",
  "dpitar shopping",
  "deepiter shopping",
  // Product focused
  "dpiterpopularproduct",
  "dpiter popular product",
  "dpiter best products",
  "dpiter top products",
  "dpiter trending products",
  "indiapopularproduct",
  "india popular product",
  "popular products india",
  "best products india",
  "trending india products",
  "dpiter fashion",
  "dpiter gadgets",
  "dpiter electronics",
  "dpiter clothing",
  "dpiter accessories",
  // E-commerce keywords
  "dpiter ecommerce",
  "dpiter e-commerce",
  "dpiter online shopping",
  "dpiter shopping",
  "dpiter marketplace",
  "dpiter amazon products",
  "dpiter flipkart products",
  "dpiter meesho products",
  "dpiter myntra products",
  "dpiter curated products",
  "dpiter verified products",
  "dpiter safe shopping",
  "dpiter trusted shopping",
  // Feature keywords
  "dpiter deals",
  "dpiter offers",
  "dpiter discounts",
  "dpiter sale",
  "dpiter best deals",
  "dpiter compare prices",
  "dpiter price comparison",
  "dpiter best price",
  "dpiter lowest price",
  "dpiter reviews",
  "dpiter ratings",
  "dpiter product reviews",
  "dpiter user reviews",
  // Category keywords
  "dpiter mens fashion",
  "dpiter womens fashion",
  "dpiter kids fashion",
  "dpiter electronics",
  "dpiter mobile accessories",
  "dpiter home decor",
  "dpiter beauty products",
  "dpiter skincare",
  // Year focused for freshness
  "dpiter 2025",
  "dpiter 2026",
  "dpiter 2025-2026",
  "dpiter 2026-2027",
  "dpiter latest 2025",
  "dpiter new arrivals 2025",
  "dpiter trending 2025",
  "dpiter best 2025",
  "dpiter top picks 2025",
  "dpiter fashion 2025",
  "dpiter products 2025",
  "dpiter deals 2025",
  "dpiter offers 2025",
  "dpiter india 2025",
  "dpiter shopping 2025",
  "dpiter ecommerce 2025",
  // Long tail keywords
  "best online shopping site dpiter",
  "dpiter trusted online shopping",
  "dpiter verified marketplace",
  "dpiter curated fashion platform",
  "dpiter handpicked products",
  "dpiter quality products",
  "dpiter certified products",
  "dpiter genuine products",
  "dpiter authentic products",
  "dpiter 100% safe",
  "dpiter secure shopping",
  "dpiter safe checkout",
  "dpiter trusted platform",
  // Comparison keywords
  "dpiter vs amazon",
  "dpiter vs flipkart",
  "dpiter vs meesho",
  "dpiter vs myntra",
  "dpiter alternative",
  "dpiter like amazon",
  "dpiter like flipkart",
  "dpiter comparison",
  // Action keywords
  "shop on dpiter",
  "buy from dpiter",
  "dpiter buy online",
  "dpiter order online",
  "dpiter free shipping",
  "dpiter fast delivery",
  "dpiter cod available",
  "dpiter easy returns",
  // Brand variations with suffixes
  "dpitershop",
  "dpiterstore",
  "dpiteronline",
  "dpiterapp",
  "dpiterweb",
  "dpitersite",
  "dpiterfashion",
  "dpiterproducts",
  "dpiterdeals",
  "dpiteroffers",
  "dpitermall",
  "dpiterhub",
  // Regional variations
  "dpiter delhi",
  "dpiter mumbai",
  "dpiter bangalore",
  "dpiter chennai",
  "dpiter kolkata",
  "dpiter hyderabad",
  "dpiter pune",
  "dpiter jaipur",
  "dpiter lucknow",
  "dpiter ahmedabad",
  // Mobile app keywords
  "dpiter app download",
  "dpiter android app",
  "dpiter ios app",
  "dpiter mobile app",
  "dpiter pwa",
  "dpiter progressive web app",
  "install dpiter app",
  "dpiter app install",
  // Trust keywords
  "dpiter legitimate",
  "dpiter real",
  "dpiter official",
  "dpiter original",
  "dpiter authorized",
  "is dpiter safe",
  "is dpiter real",
  "dpiter review",
  "dpiter feedback",
  "dpiter testimonials",
  // Search variations
  "www.dpiter.shop",
  "https://dpiter.shop",
  "dpiter website",
  "dpiter official website",
  "dpiter main site",
  "dpiter home page",
  "dpiter landing page",
  "visit dpiter",
  // Additional spelling mistakes users might make
  "dpitre",
  "dpiteer",
  "dpitrer",
  "dpiteeer",
  "dpittor",
  "dpiter.shoop",
  "dpiter.shopp",
  "dpiterr",
  "dppitter",
  "deepitr",
  "dipitr",
  "dpitarr",
  "dpeeterr",
  "dipitarr",
  // Hindi transliteration
  "डीपीटर",
  "डीपिटर",
  "dpiter hindi",
  "dpiter shopping hindi",
  // Additional marketplace combinations
  "dpiter ebay products",
  "dpiter ajio products",
  "dpiter tata cliq",
  "dpiter snapdeal",
  "dpiter all marketplace",
  "dpiter multi marketplace",
  "dpiter aggregate shopping",
  // SEO boost keywords
  "best shopping app india 2025",
  "trusted shopping platform india",
  "curated products marketplace",
  "verified products india",
  "safe online shopping india 2025",
  "best deals india 2025",
  "fashion marketplace india",
  "electronics marketplace india",
  "all in one shopping india",
]

export const metadata: Metadata = {
  metadataBase: new URL("https://dpiter.shop"),
  title: {
    default:
      "DPITER.shop - India's Premier Curated E-commerce Platform | Best Deals from Amazon, Flipkart, Meesho, Myntra 2025-2026",
    template: "%s | DPITER.shop - Trusted Shopping Platform",
  },
  description:
    "DPITER.shop is India's most trusted curated e-commerce platform featuring 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra & eBay. All major e-commerce giants have chosen DPITER as their official product showcase partner. Discover trending fashion, electronics, gadgets & lifestyle products with price comparison, genuine reviews & best deals. Established as India's #1 product discovery platform for 2025-2026. Shop smart, shop safe with DPITER!",
  keywords: dpiterKeywords,
  authors: [
    { name: "DPITER Team", url: "https://dpiter.shop" },
    { name: "Deepiter Technologies", url: "https://dpiter.shop" },
  ],
  creator: "DPITER.shop - Deepiter Technologies India",
  publisher: "DPITER.shop",
  applicationName: "DPITER.shop",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "hi_IN"],
    url: "https://dpiter.shop",
    siteName: "DPITER.shop",
    title: "DPITER.shop - India's #1 Curated E-commerce Platform | 100% Safe & Verified Products",
    description:
      "India's most trusted product discovery platform. DPITER.shop showcases 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra & eBay. All major e-commerce platforms have officially partnered with DPITER. Best deals, genuine reviews & secure shopping experience. 2025-2026's top shopping destination!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DPITER.shop - India's Premier Curated E-commerce Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dpitershop",
    creator: "@dpitershop",
    title: "DPITER.shop - India's #1 Curated Shopping Platform 2025-2026",
    description:
      "Discover 100% verified & safe products from Amazon, Flipkart, Meesho, Myntra. India's most trusted e-commerce aggregator. Shop smart with DPITER!",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    other: {
      "msvalidate.01": "bing-verification-code",
      "facebook-domain-verification": "facebook-verification-code",
    },
  },
  alternates: {
    canonical: "https://dpiter.shop",
    languages: {
      "en-IN": "https://dpiter.shop",
      "en-US": "https://dpiter.shop/en-us",
      "hi-IN": "https://dpiter.shop/hi",
    },
  },
  category: "E-commerce, Shopping, Fashion, Electronics, Lifestyle",
  classification: "E-commerce Platform, Online Shopping, Product Discovery, Price Comparison",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "DPITER",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#8A3224",
    "msapplication-config": "/browserconfig.xml",
    "format-detection": "telephone=no",
    "geo.region": "IN",
    "geo.placename": "India",
    ICBM: "20.5937, 78.9629",
    distribution: "global",
    rating: "general",
    "revisit-after": "1 day",
    "og:price:currency": "INR",
    "product:availability": "in stock",
    "product:condition": "new",
    "article:publisher": "https://dpiter.shop",
    "article:author": "DPITER Team",
    "business:contact_data:locality": "India",
    "business:contact_data:country_name": "India",
    "business:contact_data:email": "deepitermark@gmail.com",
    "business:contact_data:phone_number": "+919939091568",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8A3224" },
    { media: "(prefers-color-scheme: dark)", color: "#1E293B" },
  ],
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://dpiter.shop/#website",
        url: "https://dpiter.shop",
        name: "DPITER.shop",
        description: "India's Premier Curated E-commerce Platform",
        publisher: { "@id": "https://dpiter.shop/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://dpiter.shop/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
        inLanguage: ["en-IN", "en-US", "hi-IN"],
      },
      {
        "@type": "Organization",
        "@id": "https://dpiter.shop/#organization",
        name: "DPITER.shop",
        alternateName: ["Dpiter", "Deepiter", "DPITER India", "Dpiter Shop", "DPiter.shop"],
        url: "https://dpiter.shop",
        logo: {
          "@type": "ImageObject",
          url: "https://dpiter.shop/logo.png",
          width: 512,
          height: 512,
        },
        image: "https://dpiter.shop/og-image.png",
        description:
          "DPITER.shop is India's most trusted curated e-commerce platform. We showcase 100% verified, safe & certified products from major marketplaces including Amazon, Flipkart, Meesho, Myntra & eBay. All leading e-commerce platforms have officially partnered with DPITER to display their best products. Established in 2024, DPITER has become India's #1 product discovery platform for 2025-2026.",
        foundingDate: "2024",
        founders: [{ "@type": "Person", name: "DPITER Team" }],
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "India",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-9939091568",
            contactType: "customer service",
            email: "deepitermark@gmail.com",
            availableLanguage: ["English", "Hindi"],
            areaServed: "IN",
          },
        ],
        sameAs: [
          "https://dpiter.shop",
          "https://www.dpiter.shop",
          "https://dpiter.com",
          "https://dpiter.in",
          "https://dpiter.app",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "15000",
          bestRating: "5",
          worstRating: "1",
        },
        award: "India's Most Trusted E-commerce Aggregator 2025",
        slogan: "Shop Smart, Shop Safe with DPITER",
      },
      {
        "@type": "WebApplication",
        "@id": "https://dpiter.shop/#webapp",
        name: "DPITER.shop",
        url: "https://dpiter.shop",
        applicationCategory: "ShoppingApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "25000",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://dpiter.shop/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://dpiter.shop",
          },
        ],
      },
    ],
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <meta name="theme-color" content="#8A3224" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://dpiter.shop" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <style>{`
          html { font-size: 16px; }
          body { 
            opacity: 0; 
            transition: opacity 0.15s ease-in;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          body.loaded { opacity: 1; }
          * { box-sizing: border-box; }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent FOUC - show content immediately when fonts are ready
              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  document.body.classList.add('loaded');
                });
              } else {
                document.body.classList.add('loaded');
              }
              // Fallback - show content after short delay
              setTimeout(() => document.body.classList.add('loaded'), 100);
              // Service worker registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw-ad.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark overflow-x-hidden">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
