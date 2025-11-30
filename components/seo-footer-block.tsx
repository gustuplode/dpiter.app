"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Store,
  Tag,
  MapPin,
  Bookmark,
  Star,
  Shield,
  Truck,
  Heart,
  Search,
  Gift,
  Zap,
} from "lucide-react"

const seoKeywords = {
  primary: [
    "dpiter",
    "dpiter.shop",
    "dpiter shop",
    "dpiter app",
    "dpiter india",
    "dpiter online",
    "dpiter.com",
    "dpiter.in",
    "dpiter.ai",
    "dpiter.co",
    "dpiter.net",
    "dpiter.org",
    "dpiter.io",
    "dpiter.store",
    "dpiter.site",
    "dpiter.web",
    "dpiter.biz",
    "dpiter.info",
    "dpiter.tech",
    "dpiterindia",
    "dpiterindia.com",
    "indiadpiter",
    "dpitersite",
    "deepiter",
    "dipiter",
    "dpitar",
    "dpeeter",
    "dipitar",
    "dpiter store",
    "dpiter mall",
    "dpiter market",
    "dpiter deals",
    "dpiter offers",
    "dpiter shopping",
    "dpiter products",
    "dpiter best deals",
    "dpiter trending",
    "dpiter popular",
    "dpitershop",
    "dpiterstore",
    "dpiteronline",
    "dpiterapp",
    "dpiterweb",
    "dpiterfashion",
    "dpiterproducts",
    "dpiterdeals",
    "dpiteroffers",
    "dpitermall",
    "dpiterhub",
    "dpiterworld",
    "dpiterglobal",
    "dpiter official",
    "dpiter original",
    "डीपीटर",
    "डीपिटर",
    "dpiter hindi",
    "d-piter",
    "d piter",
    "dee piter",
    "depiter",
    "dypiter",
    "dpeter",
    "depeiter",
    "dpitter",
    "dpitor",
    "dpater",
    "dputer",
    "dpyter",
    "dpiter trusted",
    "dpiter verified",
  ],
  trending2025: [
    "trending 2025",
    "best deals 2025",
    "top products 2025",
    "shopping 2025",
    "fashion 2025",
    "gadgets 2025",
    "electronics 2025",
    "home decor 2025",
    "beauty 2025",
    "fitness 2025",
    "dpiter 2025",
    "new arrivals 2025",
    "bestsellers 2025",
    "popular products 2025",
  ],
  trending2026: [
    "trending 2026",
    "best deals 2026",
    "top products 2026",
    "shopping 2026",
    "fashion 2026",
    "dpiter 2026",
    "new arrivals 2026",
    "bestsellers 2026",
    "upcoming trends 2026",
  ],
  trending2027: [
    "trending 2027",
    "best deals 2027",
    "shopping trends 2027",
    "dpiter 2027",
    "future shopping 2027",
    "upcoming products 2027",
  ],
  trending2028: ["trending 2028", "future deals 2028", "dpiter 2028", "shopping 2028"],
  fashion: [
    "fashion",
    "clothing",
    "mens fashion",
    "womens fashion",
    "kids fashion",
    "ethnic wear",
    "western wear",
    "traditional dress",
    "party wear",
    "casual wear",
    "formal wear",
    "designer clothes",
    "branded fashion",
    "affordable fashion",
    "trendy outfits",
  ],
  electronics: [
    "electronics",
    "gadgets",
    "smartphones",
    "laptops",
    "tablets",
    "smartwatch",
    "headphones",
    "earbuds",
    "speakers",
    "cameras",
    "gaming accessories",
  ],
  beauty: [
    "beauty",
    "skincare",
    "makeup",
    "cosmetics",
    "hair care",
    "personal care",
    "beauty products",
    "organic beauty",
    "natural skincare",
  ],
  home: [
    "home decor",
    "furniture",
    "kitchen",
    "bedding",
    "home essentials",
    "storage",
    "lighting",
    "wall decor",
    "garden",
    "outdoor",
  ],
  fitness: [
    "fitness",
    "gym equipment",
    "yoga",
    "sports",
    "activewear",
    "supplements",
    "workout gear",
    "fitness accessories",
  ],
  cities: [
    "delhi",
    "mumbai",
    "bangalore",
    "chennai",
    "kolkata",
    "hyderabad",
    "pune",
    "jaipur",
    "lucknow",
    "ahmedabad",
    "surat",
    "kanpur",
    "nagpur",
    "indore",
    "thane",
    "bhopal",
    "visakhapatnam",
    "patna",
    "vadodara",
    "ghaziabad",
  ],
  shopping: [
    "online shopping",
    "best price",
    "lowest price",
    "discount",
    "sale",
    "offer",
    "deal",
    "cashback",
    "free delivery",
    "fast shipping",
    "cod",
    "cash on delivery",
    "emi",
    "no cost emi",
    "easy returns",
    "original products",
    "genuine products",
  ],
  howToUse: [
    "how to shop on dpiter",
    "dpiter shopping guide",
    "dpiter app download",
    "dpiter customer care",
    "dpiter return policy",
    "dpiter refund",
    "dpiter track order",
    "dpiter payment options",
  ],
  benefits: [
    "100% verified",
    "safe shopping",
    "trusted platform",
    "best quality",
    "certified products",
    "secure payment",
    "easy checkout",
    "24/7 support",
  ],
}

// Backlinks
const backlinks = [
  { name: "Amazon India", url: "https://www.amazon.in" },
  { name: "Flipkart", url: "https://www.flipkart.com" },
  { name: "Myntra", url: "https://www.myntra.com" },
  { name: "Meesho", url: "https://www.meesho.com" },
  { name: "Ajio", url: "https://www.ajio.com" },
  { name: "Nykaa", url: "https://www.nykaa.com" },
  { name: "Tata Cliq", url: "https://www.tatacliq.com" },
  { name: "Snapdeal", url: "https://www.snapdeal.com" },
]

// Growth Tips
const growthTips = [
  { icon: Search, title: "Search Smart", desc: "Use filters for best results" },
  { icon: Heart, title: "Save Favorites", desc: "Wishlist items for later" },
  { icon: Star, title: "Check Reviews", desc: "Read ratings before buying" },
  { icon: Tag, title: "Compare Prices", desc: "Get the best deals" },
  { icon: Shield, title: "Verified Only", desc: "100% authentic products" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick shipping nationwide" },
  { icon: Gift, title: "Daily Deals", desc: "New offers every day" },
  { icon: Zap, title: "Flash Sales", desc: "Limited time discounts" },
]

// FAQ Items
const faqItems = [
  {
    q: "Is DPITER safe for shopping?",
    a: "Yes, DPITER only lists 100% verified and certified products from trusted e-commerce platforms like Amazon, Flipkart, Myntra, and Meesho.",
  },
  {
    q: "How does DPITER work?",
    a: "DPITER curates the best products from major marketplaces, comparing prices and verifying authenticity so you can shop confidently.",
  },
  {
    q: "What is the delivery time?",
    a: "Delivery typically takes 3-7 business days depending on your location. Express delivery is available for select cities.",
  },
  {
    q: "Can I return products?",
    a: "Yes, all products come with easy return policies. Check individual product pages for specific return windows.",
  },
  {
    q: "Is COD available?",
    a: "Cash on Delivery is available for most products across India. Check availability at checkout.",
  },
]

export function SeoFooterBlock() {
  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [showArticle, setShowArticle] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [productKeywords, setProductKeywords] = useState<string[]>([])

  useEffect(() => {
    const handleProductKeywords = (e: CustomEvent) => {
      setProductKeywords(e.detail)
    }

    window.addEventListener("productKeywordsUpdated" as any, handleProductKeywords)
    return () => window.removeEventListener("productKeywordsUpdated" as any, handleProductKeywords)
  }, [])

  // Combine all keywords
  const allKeywords = [
    ...seoKeywords.primary,
    ...seoKeywords.trending2025,
    ...seoKeywords.trending2026,
    ...seoKeywords.trending2027,
    ...seoKeywords.trending2028,
    ...seoKeywords.fashion,
    ...seoKeywords.electronics,
    ...seoKeywords.beauty,
    ...seoKeywords.home,
    ...seoKeywords.fitness,
    ...seoKeywords.cities,
    ...seoKeywords.shopping,
    ...seoKeywords.howToUse,
    ...seoKeywords.benefits,
    ...productKeywords,
  ]

  const displayKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 50)

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }

  return (
    <section
      id="dpiter-seo-block"
      className="bg-[#FAF8F5] dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
    >
      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#1a4a4a]">
            DPITER.shop — India's #1 Curated E-Commerce Platform
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            100% verified products from Amazon, Flipkart, Meesho, Myntra. Safe shopping, best deals, fast delivery
            across India.
          </p>
          <p className="text-xs text-gray-500">
            डीपीटर — भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म। 100% वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स।
          </p>
        </div>

        {/* Trending Links */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/fashion"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Fashion Trends 2025
          </Link>
          <Link
            href="/gadgets"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Top Electronics
          </Link>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Beauty Bestsellers
          </Link>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Home Essentials
          </Link>
          <Link
            href="/offers"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Today's Deals
          </Link>
          <Link
            href="/about"
            className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors"
          >
            Why DPITER?
          </Link>
        </div>

        {/* Growth Tips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {growthTips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-100">
              <tip.icon className="w-4 h-4 text-[#883223]" />
              <div>
                <p className="text-xs font-medium text-gray-800">{tip.title}</p>
                <p className="text-[10px] text-gray-500">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-center text-[#1a4a4a]">FAQ</h3>
          <div className="space-y-2 max-w-2xl mx-auto">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm text-gray-700">{item.q}</span>
                  <span className="text-gray-400">{expandedFaq === i ? "−" : "+"}</span>
                </button>
                {expandedFaq === i && <div className="px-4 pb-4 text-xs text-gray-600">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Backlinks */}
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
            <Store className="w-3.5 h-3.5" /> Shop From Trusted Platforms:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {backlinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors flex items-center gap-1"
              >
                {link.name} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Popular Searches:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {displayKeywords.slice(0, showAllKeywords ? 200 : 50).map((kw, i) => (
              <span key={i} className="text-[9px] px-2 py-1 bg-gray-100 rounded text-gray-500">
                {kw}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowAllKeywords(!showAllKeywords)}
            className="mx-auto flex items-center gap-1 text-[10px] text-[#883223]"
          >
            {showAllKeywords ? "Show Less" : `Show All (${allKeywords.length})`}
            {showAllKeywords ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Cities */}
        <div className="text-center space-y-1">
          <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" /> Fast Delivery:
          </p>
          <p className="text-[9px] text-gray-400">
            Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow, Ahmedabad
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 flex items-center justify-center gap-2">
            <Bookmark className="w-4 h-4 text-[#883223]" />
            Save / Bookmark this page for latest deals & trending products 2025-2026
          </p>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only">{allKeywords.join(", ")}</div>
      </div>
    </section>
  )
}

export { SeoFooterBlock as SEOFooterBlock }
