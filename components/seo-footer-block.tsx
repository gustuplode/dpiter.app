"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb,
  BookOpen,
  Store,
  ExternalLink,
  Plus,
  X,
  TrendingUp,
} from "lucide-react"

// Massive SEO Keywords Database - 1000+ keywords
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
    "dpiter shopping hindi",
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
    "dpiter best products india",
    "dpiter trusted shopping",
    "dpiter verified products",
  ],
  trending2025: [
    "trending 2025",
    "best deals 2025",
    "top products 2025",
    "shopping 2025",
    "fashion 2025",
    "electronics 2025",
    "gadgets 2025",
    "beauty 2025",
    "home decor 2025",
    "fitness 2025",
    "dpiter 2025",
    "online shopping 2025",
    "best offers 2025",
    "new arrivals 2025",
    "summer collection 2025",
    "winter collection 2025",
    "festive sale 2025",
    "diwali sale 2025",
  ],
  trending2026: [
    "trending 2026",
    "best deals 2026",
    "top products 2026",
    "shopping 2026",
    "fashion 2026",
    "electronics 2026",
    "gadgets 2026",
    "beauty 2026",
    "home decor 2026",
    "fitness 2026",
    "dpiter 2026",
    "online shopping 2026",
    "best offers 2026",
    "new arrivals 2026",
  ],
  trending2027: [
    "trending 2027",
    "best deals 2027",
    "top products 2027",
    "shopping 2027",
    "fashion 2027",
    "dpiter 2027",
    "online shopping 2027",
    "best offers 2027",
    "new arrivals 2027",
  ],
  trending2028: [
    "trending 2028",
    "best deals 2028",
    "top products 2028",
    "shopping 2028",
    "fashion 2028",
    "dpiter 2028",
    "online shopping 2028",
    "best offers 2028",
    "new arrivals 2028",
  ],
  fashion: [
    "mens fashion",
    "womens fashion",
    "kids fashion",
    "ethnic wear",
    "western wear",
    "casual wear",
    "formal wear",
    "party wear",
    "sarees",
    "kurtis",
    "lehengas",
    "t-shirts",
    "jeans",
    "shirts",
    "dresses",
    "tops",
    "footwear",
    "watches",
    "jewellery",
    "bags",
    "accessories",
    "sunglasses",
    "belts",
    "wallets",
  ],
  electronics: [
    "smartphones",
    "laptops",
    "tablets",
    "headphones",
    "earbuds",
    "smartwatches",
    "cameras",
    "speakers",
    "televisions",
    "gaming consoles",
    "power banks",
    "chargers",
    "cables",
    "covers",
    "screen guards",
    "mobile accessories",
  ],
  beauty: [
    "skincare",
    "makeup",
    "haircare",
    "perfumes",
    "lipsticks",
    "foundations",
    "moisturizers",
    "serums",
    "face wash",
    "sunscreen",
    "nail polish",
    "beauty tools",
  ],
  home: [
    "home decor",
    "furniture",
    "kitchen appliances",
    "bedding",
    "curtains",
    "storage",
    "lighting",
    "wall art",
    "rugs",
    "organizers",
    "cleaning supplies",
  ],
  fitness: [
    "gym equipment",
    "yoga mats",
    "dumbbells",
    "resistance bands",
    "protein supplements",
    "fitness tracker",
    "sports shoes",
    "activewear",
    "water bottles",
    "gym bags",
  ],
  cities: [
    "delhi",
    "mumbai",
    "bangalore",
    "chennai",
    "kolkata",
    "hyderabad",
    "pune",
    "ahmedabad",
    "jaipur",
    "lucknow",
    "kanpur",
    "nagpur",
    "indore",
    "thane",
    "bhopal",
    "visakhapatnam",
    "pimpri",
    "patna",
    "vadodara",
    "ghaziabad",
    "ludhiana",
    "agra",
    "nashik",
    "faridabad",
    "meerut",
    "rajkot",
    "varanasi",
    "srinagar",
    "aurangabad",
    "dhanbad",
    "amritsar",
    "allahabad",
    "ranchi",
    "howrah",
    "coimbatore",
    "jabalpur",
    "gwalior",
    "vijayawada",
    "jodhpur",
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
    "cod",
    "free delivery",
    "fast shipping",
    "easy returns",
    "original product",
    "genuine",
    "authentic",
    "verified seller",
    "trusted",
    "best quality",
    "premium",
    "affordable",
    "budget friendly",
    "value for money",
  ],
  howToUse: [
    "how to use dpiter",
    "dpiter kaise use kare",
    "dpiter tutorial",
    "dpiter guide",
    "dpiter app download",
    "dpiter registration",
    "dpiter login",
    "dpiter account",
    "dpiter order",
    "dpiter payment",
    "dpiter delivery",
    "dpiter return",
    "dpiter refund",
    "dpiter customer care",
    "dpiter helpline",
    "dpiter support",
    "dpiter contact",
  ],
  benefits: [
    "100% verified products",
    "safe shopping",
    "secure payment",
    "best deals guaranteed",
    "price comparison",
    "multiple platforms",
    "all brands",
    "latest products",
    "trending items",
    "curated collection",
    "handpicked products",
    "quality assured",
  ],
}

// Growth tips
const growthTips = [
  { icon: "trending_up", title: "Compare Prices", desc: "Check prices across Amazon, Flipkart & more" },
  { icon: "verified", title: "Verified Only", desc: "100% authentic products guaranteed" },
  { icon: "local_shipping", title: "Fast Delivery", desc: "Quick shipping to 500+ cities" },
  { icon: "security", title: "Safe Shopping", desc: "Secure payments & easy returns" },
  { icon: "savings", title: "Best Deals", desc: "Save up to 80% on top brands" },
  { icon: "support_agent", title: "24/7 Support", desc: "Customer care always available" },
  { icon: "star", title: "Top Rated", desc: "Products with 4+ star ratings" },
  { icon: "new_releases", title: "New Arrivals", desc: "Latest products added daily" },
]

// Backlinks for SEO
const backlinks = [
  { name: "Amazon India", url: "https://www.amazon.in", rel: "noopener" },
  { name: "Flipkart", url: "https://www.flipkart.com", rel: "noopener" },
  { name: "Myntra", url: "https://www.myntra.com", rel: "noopener" },
  { name: "Meesho", url: "https://www.meesho.com", rel: "noopener" },
  { name: "Ajio", url: "https://www.ajio.com", rel: "noopener" },
  { name: "Nykaa", url: "https://www.nykaa.com", rel: "noopener" },
  { name: "Tata Cliq", url: "https://www.tatacliq.com", rel: "noopener" },
  { name: "Snapdeal", url: "https://www.snapdeal.com", rel: "noopener" },
]

// FAQs
const faqs = [
  {
    q: "What is DPITER.shop?",
    a: "DPITER.shop is India's #1 curated e-commerce aggregator platform that handpicks the best products from Amazon, Flipkart, Meesho, Myntra and other top marketplaces. All products are 100% verified and safe.",
  },
  {
    q: "How do I shop on DPITER?",
    a: "Simply browse or search for products, compare prices across platforms, and click to buy. You'll be redirected to the original marketplace to complete your purchase with secure payment.",
  },
  {
    q: "Is shopping on DPITER safe?",
    a: "Yes! We only list verified products from trusted sellers. All transactions happen on official marketplaces like Amazon & Flipkart ensuring 100% safe and secure shopping.",
  },
  {
    q: "What are the delivery charges?",
    a: "Delivery charges depend on the original marketplace. Most products have free delivery on orders above a certain amount. Check product page for exact delivery details.",
  },
  {
    q: "How can I return a product?",
    a: "Returns are handled by the original marketplace where you purchased. Visit their website or app, go to Orders, select the item and request a return as per their return policy.",
  },
]

// Article Content
const articleContent = {
  title: "Complete Shopping Guide 2025-2028 | DPITER.shop",
  sections: [
    {
      heading: "Why Choose DPITER.shop for Online Shopping?",
      content:
        "DPITER.shop is India's most trusted curated e-commerce aggregator platform established for 2025-2028. We handpick the best products from Amazon India, Flipkart, Meesho, Myntra, Ajio, Nykaa, Tata Cliq, and other top marketplaces. Every product listed on DPITER is 100% verified, ensuring safe and secure shopping experience. Our AI-powered system scans millions of products daily to bring you the best deals at lowest prices.",
    },
    {
      heading: "How to Use DPITER.shop - Step by Step Guide",
      content:
        "1) Browse or search for products you want 2) Compare prices across multiple platforms instantly 3) Read verified reviews and ratings 4) Click to buy - you'll be redirected to the original marketplace 5) Complete your purchase with your preferred payment method. DPITER saves you time and money by showing the best deals from Amazon, Flipkart, Meesho, Myntra all in one place!",
    },
    {
      heading: "Shopping Trends 2025-2028",
      content:
        "In 2025-2026, sustainable fashion, smart home devices, and personalized skincare are trending. Electronics like TWS earbuds, smartwatches, and gaming accessories continue to dominate. For 2027-2028, expect AI-powered shopping assistants, AR try-on features, and voice commerce to become mainstream. DPITER stays ahead by continuously updating our platform with latest technologies and trending products.",
    },
  ],
}

export function SEOFooterBlock() {
  const pathname = usePathname()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showArticle, setShowArticle] = useState(false)
  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [productKeywords, setProductKeywords] = useState<string[]>([])

  useEffect(() => {
    const handleProductKeywords = (event: CustomEvent) => {
      setProductKeywords(event.detail || [])
    }

    window.addEventListener("productKeywordsUpdated" as any, handleProductKeywords)
    return () => window.removeEventListener("productKeywordsUpdated" as any, handleProductKeywords)
  }, [])

  // Auto-generate keywords from products on the page
  useEffect(() => {
    const generateProductKeywords = () => {
      const productElements = document.querySelectorAll("[data-product-title]")
      const keywords: string[] = []

      productElements.forEach((el) => {
        const title = el.getAttribute("data-product-title")
        const brand = el.getAttribute("data-product-brand")
        const category = el.getAttribute("data-product-category")

        if (title) {
          const titleLower = title.toLowerCase()
          keywords.push(titleLower)
          keywords.push(`buy ${titleLower}`)
          keywords.push(`${titleLower} price`)
          keywords.push(`${titleLower} online`)
          keywords.push(`best ${titleLower}`)
          keywords.push(`${titleLower} india`)
          keywords.push(`${titleLower} 2025`)
          keywords.push(`${titleLower} deals`)
          keywords.push(`cheap ${titleLower}`)
          keywords.push(`${titleLower} offer`)
        }
        if (brand) {
          keywords.push(brand.toLowerCase())
          keywords.push(`${brand.toLowerCase()} products`)
        }
        if (category) {
          keywords.push(category.toLowerCase())
        }
      })

      if (keywords.length > 0) {
        setProductKeywords((prev) => [...new Set([...prev, ...keywords])].slice(0, 100))
      }
    }

    generateProductKeywords()

    // Re-run when products change
    const observer = new MutationObserver(generateProductKeywords)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pathname])

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

  const displayKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 60)

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DPITER.shop",
    url: "https://dpiter.shop",
    logo: "https://dpiter.shop/logo.png",
    description:
      "India's #1 curated e-commerce platform. 100% verified products from Amazon, Flipkart, Meesho, Myntra.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9939091568",
      contactType: "customer service",
      email: "deepitermark@gmail.com",
    },
    sameAs: ["https://wa.me/919939091568"],
  }

  return (
    <section
      id="dpiter-seo-block"
      className="mt-8 border-t border-gray-200 dark:border-gray-800"
      style={{ backgroundColor: "#FAF8F5" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-[#1a4a4a]">DPITER.shop</h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            India's #1 curated e-commerce platform 2025-2028. 100% verified products from Amazon, Flipkart, Meesho,
            Myntra. Safe shopping, best deals, fast delivery across Delhi, Mumbai, Bangalore, Chennai & 500+ cities.
          </p>
          <p className="text-xs text-gray-500">
            डीपीटर.शॉप — भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म। 100% वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स।
          </p>
        </div>

        {/* Trending Links */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Trending:
          </span>
          {[
            "Fashion Trends 2025",
            "Top Electronics",
            "Beauty Bestsellers",
            "Home Essentials",
            "Today's Deals",
            "Why DPITER?",
          ].map((item) => (
            <Link
              key={item}
              href={`/search?q=${encodeURIComponent(item)}`}
              className="text-xs text-[#1a4a4a] hover:underline"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Growth Tips Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#1a4a4a] text-center flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Smart Shopping Tips
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {growthTips.map((tip) => (
              <div
                key={tip.title}
                className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="material-symbols-outlined text-[#883223] text-lg">{tip.icon}</span>
                <p className="text-xs font-semibold text-gray-800 mt-1">{tip.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section - Perplexity Style */}
        <div className="space-y-3">
          <h3 className="text-xl font-serif text-[#1a4a4a] text-center">FAQ</h3>
          <div className="space-y-2 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                  {expandedFaq === idx ? (
                    <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Article Section */}
        <div className="space-y-3">
          <button
            onClick={() => setShowArticle(!showArticle)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-[#1a4a4a] hover:text-[#883223] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {articleContent.title}
            {showArticle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showArticle && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 max-w-3xl mx-auto">
              {articleContent.sections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="text-sm font-semibold text-[#1a4a4a] mb-2">{section.heading}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backlinks - Partner Platforms */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-600 text-center flex items-center justify-center gap-1">
            <Store className="w-3.5 h-3.5" />
            Shop From Trusted Platforms:
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {backlinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel={`${link.rel} noreferrer`}
                className="text-[10px] px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#883223] hover:text-[#883223] transition-colors flex items-center gap-1"
              >
                {link.name}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Keywords Tags */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-600 text-center flex items-center justify-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Popular Searches & Keywords ({allKeywords.length}+)
          </h4>
          <div className="flex flex-wrap justify-center gap-1.5">
            {displayKeywords.slice(0, showAllKeywords ? 300 : 60).map((keyword, i) => (
              <Link
                key={`${keyword}-${i}`}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="text-[9px] px-2 py-0.5 bg-white border border-gray-100 text-gray-500 rounded hover:bg-[#883223]/10 hover:text-[#883223] hover:border-[#883223]/30 transition-colors"
              >
                {keyword}
              </Link>
            ))}
            {!showAllKeywords && allKeywords.length > 60 && (
              <button
                onClick={() => setShowAllKeywords(true)}
                className="text-[9px] px-3 py-0.5 bg-[#883223] text-white rounded font-medium hover:bg-[#6d2719]"
              >
                +{allKeywords.length - 60} more keywords
              </button>
            )}
          </div>
        </div>

        {/* Cities */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500">
            <span className="font-medium">Fast Delivery:</span> {seoKeywords.cities.slice(0, 15).join(", ")} & 500+
            cities
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-xs text-[#883223] font-medium">
            Save / Bookmark this page for latest deals & trending products 2025-2028
          </p>
        </div>

        {/* Hidden SEO Content */}
        <div className="sr-only" aria-hidden="true">
          <h4>DPITER Keywords Database 2025-2028</h4>
          <p>{Object.values(seoKeywords).flat().join(", ")}</p>
          <p>{productKeywords.join(", ")}</p>
          <h5>How to Use DPITER.shop</h5>
          <p>
            How to use dpiter, dpiter kaise use kare, dpiter tutorial, dpiter shopping guide, dpiter app download,
            dpiter registration, dpiter login, dpiter account create, dpiter order kaise kare, dpiter se shopping kaise
            kare, dpiter payment methods, dpiter delivery time, dpiter return policy, dpiter refund process
          </p>
          <h5>DPITER Cities 2025-2028</h5>
          <p>
            {seoKeywords.cities.map((city) => `dpiter ${city}, online shopping ${city}, best deals ${city}`).join(", ")}
          </p>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
    </section>
  )
}
