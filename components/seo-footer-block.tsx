"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useMemo } from "react"

interface CategorySEO {
  slug: string
  title: string
  titleHi: string
  paragraph: string
  paragraphHi: string
  relatedCategories: string[]
  popularSearches: string[]
}

const categorySEOData: Record<string, CategorySEO> = {
  fashion: {
    slug: "fashion",
    title: "Fashion",
    titleHi: "फैशन",
    paragraph:
      "Shop latest men & women fashion on dpiter.shop — best deals 2025, affordable premium looks, and fast delivery across India. Discover trending styles from Amazon, Flipkart, Myntra.",
    paragraphHi: "dpiter.shop पर लेटेस्ट फैशन 2025 — बजट फ्रेंडली लुक्स, स्लिम फिट और फास्ट डिलीवरी।",
    relatedCategories: ["beauty", "accessories"],
    popularSearches: ["mens tshirt", "womens kurti", "ethnic wear", "casual dress"],
  },
  beauty: {
    slug: "beauty",
    title: "Beauty & Skincare",
    titleHi: "ब्यूटी और स्किनकेयर",
    paragraph:
      "Discover 100% genuine beauty & skincare products on dpiter.shop. Verified cosmetics, serums, and makeup from top brands. Best prices guaranteed for 2025.",
    paragraphHi: "dpiter.shop पर 100% असली ब्यूटी प्रोडक्ट्स — वेरीफाइड कॉस्मेटिक्स और बेस्ट प्राइस।",
    relatedCategories: ["fashion", "health"],
    popularSearches: ["face serum", "sunscreen", "lipstick", "moisturizer"],
  },
  electronics: {
    slug: "electronics",
    title: "Electronics & Gadgets",
    titleHi: "इलेक्ट्रॉनिक्स और गैजेट्स",
    paragraph:
      "Best electronics deals 2025 on dpiter.shop. Shop verified mobiles, laptops, earbuds, smartwatches from Amazon, Flipkart at lowest prices. Fast delivery across India.",
    paragraphHi: "dpiter.shop पर बेस्ट इलेक्ट्रॉनिक्स डील्स 2025 — वेरीफाइड मोबाइल, लैपटॉप, ईयरबड्स।",
    relatedCategories: ["gadgets", "accessories"],
    popularSearches: ["wireless earbuds", "smartwatch", "power bank", "phone case"],
  },
  home: {
    slug: "home",
    title: "Home & Kitchen",
    titleHi: "होम और किचन",
    paragraph:
      "Transform your home with dpiter.shop. Verified home decor, kitchen appliances, furniture from top sellers. Best deals 2025 with easy returns.",
    paragraphHi: "dpiter.shop पर होम डेकोर और किचन — वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स 2025।",
    relatedCategories: ["decor", "appliances"],
    popularSearches: ["bedsheet", "curtains", "mixer grinder", "storage"],
  },
  fitness: {
    slug: "fitness",
    title: "Fitness & Sports",
    titleHi: "फिटनेस और स्पोर्ट्स",
    paragraph:
      "Achieve your fitness goals with dpiter.shop. Shop verified gym equipment, sportswear, yoga mats, supplements. Best prices 2025 from Amazon, Flipkart.",
    paragraphHi: "dpiter.shop पर फिटनेस प्रोडक्ट्स — जिम इक्विपमेंट, स्पोर्ट्सवियर, बेस्ट प्राइस।",
    relatedCategories: ["health", "fashion"],
    popularSearches: ["dumbbells", "yoga mat", "protein", "sports shoes"],
  },
  default: {
    slug: "all",
    title: "All Products",
    titleHi: "सभी प्रोडक्ट्स",
    paragraph:
      "DPITER.shop — India's #1 curated e-commerce platform 2025. 100% verified products from Amazon, Flipkart, Meesho, Myntra. Safe shopping, best deals, fast delivery across Delhi, Mumbai, Bangalore, Chennai.",
    paragraphHi: "DPITER.shop — भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म। 100% वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स।",
    relatedCategories: ["fashion", "electronics", "beauty", "home"],
    popularSearches: ["trending products", "best deals", "new arrivals", "top rated"],
  },
}

const trendingLinks = [
  { href: "/collections/fashion", text: "Fashion Trends 2025" },
  { href: "/collections/electronics", text: "Top Electronics" },
  { href: "/collections/beauty", text: "Beauty Bestsellers" },
  { href: "/collections/home", text: "Home Essentials" },
  { href: "/offers", text: "Today's Deals" },
  { href: "/about", text: "Why DPITER?" },
]

const cityList = "Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow, Ahmedabad"

export function SEOFooterBlock() {
  const pathname = usePathname()

  const { category, seoData, faqSchema } = useMemo(() => {
    // Determine category from pathname
    let cat = "default"
    if (pathname?.includes("fashion") || pathname?.includes("clothing")) cat = "fashion"
    else if (pathname?.includes("beauty") || pathname?.includes("skincare")) cat = "beauty"
    else if (pathname?.includes("electronics") || pathname?.includes("gadgets")) cat = "electronics"
    else if (pathname?.includes("home") || pathname?.includes("kitchen")) cat = "home"
    else if (pathname?.includes("fitness") || pathname?.includes("sports")) cat = "fitness"

    const data = categorySEOData[cat] || categorySEOData.default

    // Generate FAQ Schema
    const faqs = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is DPITER.shop a safe and trusted platform?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, DPITER.shop is India's most trusted curated e-commerce platform. We only list 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra & eBay. All products go through strict quality checks.",
          },
        },
        {
          "@type": "Question",
          name: "What is the delivery time for products on DPITER?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery typically takes 3-7 business days across major Indian cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad. Express delivery options are available for select products.",
          },
        },
        {
          "@type": "Question",
          name: "How can I return or exchange products purchased through DPITER?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DPITER redirects you to the original marketplace (Amazon, Flipkart, etc.) for purchase. Returns and exchanges follow the respective marketplace policies. Our team is available 24/7 via WhatsApp (+919939091568) to assist with any issues.",
          },
        },
      ],
    }

    return { category: cat, seoData: data, faqSchema: faqs }
  }, [pathname])

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) return null

  return (
    <section
      id="dpiter-seo-block"
      aria-label="SEO Information"
      className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-4 px-4 mt-4"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Bilingual Category Paragraph */}
        <div className="mb-3">
          <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 mb-1">{seoData.paragraph}</p>
          <p className="text-[11px] leading-relaxed text-gray-400 dark:text-gray-500 italic">{seoData.paragraphHi}</p>
        </div>

        {/* Trending Internal Links */}
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mr-2">Trending:</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {trendingLinks.map((link, i) => (
              <span key={link.href}>
                <Link href={link.href} className="hover:text-orange-500 hover:underline transition-colors">
                  {link.text}
                </Link>
                {i < trendingLinks.length - 1 && <span className="mx-1.5">·</span>}
              </span>
            ))}
          </span>
        </div>

        {/* Popular Searches */}
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mr-2">Popular Searches:</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {seoData.popularSearches.map((term, i) => (
              <span key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="hover:text-orange-500 hover:underline transition-colors"
                >
                  {term}
                </Link>
                {i < seoData.popularSearches.length - 1 && <span className="mx-1.5">·</span>}
              </span>
            ))}
          </span>
        </div>

        {/* Cities */}
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mr-2">Fast Delivery:</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{cityList}</span>
        </div>

        {/* CTA */}
        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">
          📌 Save / Bookmark this page for latest deals & trending products 2025-2026
        </p>

        {/* FAQ Schema JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </div>
    </section>
  )
}
