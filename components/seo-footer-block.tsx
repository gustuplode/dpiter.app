"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Search,
  Store,
  Tag,
  BookOpen,
  Lightbulb,
  Star,
  Shield,
  Clock,
  Gift,
  Truck,
  CreditCard,
  Award,
  Plus,
  ExternalLink,
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
    "dpiter safe shopping",
    "dpiter genuine products",
    "dpiter quality products",
  ],
  trending2025: [
    "trending products 2025",
    "best deals 2025",
    "new arrivals 2025",
    "top products 2025",
    "bestsellers 2025",
    "popular products 2025",
    "most wanted 2025",
    "hot deals 2025",
    "flash sale 2025",
    "mega sale 2025",
    "season sale 2025",
    "festive offers 2025",
    "diwali sale 2025",
    "holi sale 2025",
    "independence day sale 2025",
    "republic day sale 2025",
    "summer collection 2025",
    "winter collection 2025",
    "spring collection 2025",
    "monsoon sale 2025",
    "back to school 2025",
    "wedding season 2025",
  ],
  trending2026: [
    "trending products 2026",
    "best deals 2026",
    "new arrivals 2026",
    "top products 2026",
    "bestsellers 2026",
    "upcoming products 2026",
    "future trends 2026",
    "shopping trends 2026",
    "2025-2026 collection",
    "2025-2026 deals",
    "2025-2026 offers",
    "2025-2026 sale",
  ],
  trending2027: [
    "trending products 2027",
    "best deals 2027",
    "new arrivals 2027",
    "top products 2027",
    "2026-2027 collection",
    "2026-2027 deals",
    "future shopping 2027",
    "next gen products 2027",
  ],
  trending2028: [
    "trending products 2028",
    "best deals 2028",
    "new arrivals 2028",
    "top products 2028",
    "2027-2028 collection",
    "2027-2028 deals",
    "future trends 2028",
    "shopping future 2028",
  ],
  fashion: [
    "fashion trends",
    "men fashion",
    "women fashion",
    "kids fashion",
    "latest fashion",
    "ethnic wear",
    "western wear",
    "casual wear",
    "formal wear",
    "party wear",
    "wedding wear",
    "t-shirts",
    "shirts",
    "jeans",
    "kurtas",
    "sarees",
    "lehengas",
    "suits",
    "dresses",
    "tops",
    "skirts",
    "pants",
    "shorts",
    "jackets",
    "sweaters",
    "hoodies",
    "fashion under 500",
    "fashion under 1000",
    "premium fashion",
    "designer wear",
    "branded fashion",
    "affordable fashion",
    "budget fashion",
    "luxury fashion",
  ],
  electronics: [
    "electronics deals",
    "mobile phones",
    "smartphones",
    "laptops",
    "tablets",
    "TWS earbuds",
    "headphones",
    "smartwatches",
    "fitness bands",
    "speakers",
    "cameras",
    "gaming accessories",
    "phone accessories",
    "laptop accessories",
    "chargers",
    "power banks",
    "cables",
    "cases",
    "screen guards",
    "electronics under 500",
    "electronics under 1000",
    "electronics under 5000",
    "best mobiles 2025",
    "best laptops 2025",
    "best earbuds 2025",
  ],
  beauty: [
    "beauty products",
    "skincare",
    "makeup",
    "haircare",
    "fragrances",
    "perfumes",
    "face serums",
    "sunscreens",
    "moisturizers",
    "face wash",
    "lipsticks",
    "foundations",
    "mascaras",
    "eyeliners",
    "nail polish",
    "hair oils",
    "shampoos",
    "conditioners",
    "face masks",
    "beauty combos",
    "beauty under 500",
    "beauty bestsellers",
    "organic beauty",
    "ayurvedic beauty",
  ],
  home: [
    "home essentials",
    "kitchen appliances",
    "home decor",
    "furniture",
    "bedsheets",
    "curtains",
    "cushions",
    "rugs",
    "lamps",
    "clocks",
    "storage solutions",
    "organizers",
    "cleaning supplies",
    "cookware",
    "dinnerware",
    "glassware",
    "home improvement",
    "garden essentials",
    "home under 500",
    "home under 1000",
    "premium home",
    "smart home",
  ],
  fitness: [
    "fitness equipment",
    "yoga mats",
    "dumbbells",
    "resistance bands",
    "sports shoes",
    "sportswear",
    "protein powders",
    "supplements",
    "fitness trackers",
    "gym accessories",
    "outdoor sports",
    "cycling",
    "running gear",
    "swimming gear",
    "fitness under 500",
    "gym essentials",
  ],
  cities: [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Jaipur",
    "Lucknow",
    "Ahmedabad",
    "Surat",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubli",
    "Mysore",
    "Tiruchirappalli",
    "Bareilly",
  ],
  shopping: [
    "online shopping",
    "best deals",
    "discount offers",
    "flash sale",
    "mega sale",
    "clearance sale",
    "buy online",
    "shop online",
    "order online",
    "home delivery",
    "free shipping",
    "cash on delivery",
    "COD available",
    "EMI options",
    "no cost EMI",
    "easy returns",
    "genuine products",
    "original products",
    "verified sellers",
    "trusted shopping",
    "safe shopping",
    "secure payment",
    "best prices",
    "price comparison",
    "compare prices",
    "lowest prices",
    "best offers",
  ],
  platforms: [
    "Amazon India",
    "Flipkart",
    "Meesho",
    "Myntra",
    "Ajio",
    "Nykaa",
    "Tata Cliq",
    "Snapdeal",
    "eBay India",
    "Shopclues",
    "Paytm Mall",
    "JioMart",
    "BigBasket",
    "Grofers",
    "FirstCry",
    "Pepperfry",
    "Urban Ladder",
    "Lenskart",
    "Bewakoof",
  ],
  howToUse: [
    "how to use dpiter",
    "dpiter kaise use kare",
    "dpiter tutorial",
    "dpiter guide",
    "dpiter shopping guide",
    "dpiter app download",
    "dpiter website login",
    "dpiter signup",
    "dpiter register",
    "dpiter account create",
    "dpiter wishlist",
    "dpiter search products",
    "dpiter compare prices",
    "dpiter find deals",
    "dpiter save money",
    "dpiter reviews",
    "dpiter ratings",
    "dpiter customer support",
  ],
  benefits: [
    "save money online shopping",
    "compare prices across platforms",
    "find best deals instantly",
    "verified products only",
    "safe secure shopping",
    "trusted marketplace india",
    "genuine original products",
    "no fake products guaranteed",
    "quality assured products",
    "best price guarantee",
    "easy returns policy",
    "secure payment gateway",
    "multiple payment options",
    "upi payment google pay phonepe paytm",
    "credit debit card payment",
    "emi installment options",
    "no cost emi available",
  ],
}

// FAQ Data like image reference
const faqData = [
  {
    question: "What is DPITER.shop and how does it work?",
    answer:
      "DPITER.shop is India's #1 curated e-commerce aggregator platform for 2025-2028. We handpick the best products from Amazon, Flipkart, Meesho, Myntra, Ajio, and other top marketplaces. Browse, compare prices, and click to buy - you'll be redirected to the original marketplace for secure purchase.",
  },
  {
    question: "Is DPITER.shop safe and trustworthy for online shopping?",
    answer:
      "Yes, 100% safe! We only list verified, certified products from trusted e-commerce platforms. All products undergo strict quality verification. Your purchase happens on the original marketplace (Amazon, Flipkart, etc.) with their secure payment gateways.",
  },
  {
    question: "How do I get the best deals on DPITER?",
    answer:
      "Our AI-powered system scans millions of products daily to show you the best prices. Use filters, compare across platforms, check our 'Today's Deals' section, and enable notifications for price drops. We help you save up to 70% on every purchase!",
  },
  {
    question: "What are the delivery and payment options?",
    answer:
      "Delivery typically takes 3-7 business days across 500+ Indian cities. Express delivery available in metros. Payment options include COD, UPI (GPay, PhonePe, Paytm), Cards, Net Banking, EMI, No-Cost EMI, and Buy Now Pay Later - as per original marketplace.",
  },
  {
    question: "How can I contact DPITER customer support?",
    answer:
      "Reach us 24/7 on WhatsApp: +919939091568 or Email: deepitermark@gmail.com. Our support team assists with product queries, order tracking (via original marketplace), and any shopping guidance. We're here to help!",
  },
  {
    question: "Does DPITER have a mobile app?",
    answer:
      "Yes! Install the DPITER PWA app directly from your browser - click 'Install App' in the menu. Get faster browsing, offline access, push notifications for deals, and a native app-like experience. Available for Android and iOS devices.",
  },
]

// Growth Tips
const growthTips = [
  { icon: Search, title: "Compare First", desc: "Always compare prices across platforms before buying" },
  { icon: Star, title: "Check Reviews", desc: "Read verified reviews and ratings for quality assurance" },
  { icon: Clock, title: "Time Your Purchase", desc: "Shop during sales for maximum savings" },
  { icon: Gift, title: "Use Coupons", desc: "Apply coupon codes for extra discounts" },
  { icon: Truck, title: "Free Delivery", desc: "Look for free delivery options to save more" },
  { icon: CreditCard, title: "No Cost EMI", desc: "Use EMI for big purchases without extra charges" },
  { icon: Shield, title: "Buy Verified", desc: "Choose only verified sellers for genuine products" },
  { icon: Award, title: "Brand Value", desc: "Invest in quality brands for long-term value" },
]

// Backlinks for SEO
const backlinks = [
  { name: "Amazon India", url: "https://www.amazon.in", rel: "noopener" },
  { name: "Flipkart", url: "https://www.flipkart.com", rel: "noopener" },
  { name: "Myntra", url: "https://www.myntra.com", rel: "noopener" },
  { name: "Meesho", url: "https://www.meesho.com", rel: "noopener" },
  { name: "Ajio", url: "https://www.ajio.com", rel: "noopener" },
  { name: "Nykaa", url: "https://www.nykaa.com", rel: "noopener" },
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
      heading: "How to Use DPITER.shop - Step by Step",
      content:
        "1) Browse or search for products you want 2) Compare prices across multiple platforms instantly 3) Read verified reviews and ratings 4) Click to buy - you'll be redirected to the original marketplace 5) Complete your purchase with your preferred payment method. DPITER saves you time and money by showing the best deals from Amazon, Flipkart, Meesho, Myntra all in one place!",
    },
    {
      heading: "Shopping Trends 2025-2028",
      content:
        "In 2025-2026, sustainable fashion, smart home devices, and personalized skincare are trending. Electronics like TWS earbuds, smartwatches, and gaming accessories continue to dominate. For 2027-2028, expect AI-powered shopping assistants, AR try-on features, and voice commerce to become mainstream. DPITER stays ahead by continuously updating our platform with latest technologies.",
    },
  ],
}

export function SEOFooterBlock() {
  const pathname = usePathname()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showArticle, setShowArticle] = useState(false)
  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const [productKeywords, setProductKeywords] = useState<string[]>([])

  // Auto-generate keywords from products on the page
  useEffect(() => {
    const generateProductKeywords = () => {
      const productElements = document.querySelectorAll("[data-product-title]")
      const keywords: string[] = []

      productElements.forEach((el) => {
        const title = el.getAttribute("data-product-title")
        if (title) {
          // Extract keywords from product title
          const words = title
            .toLowerCase()
            .split(" ")
            .filter((word) => word.length > 3)
          keywords.push(...words)
          keywords.push(`buy ${title.toLowerCase()}`)
          keywords.push(`${title.toLowerCase()} price`)
          keywords.push(`${title.toLowerCase()} online`)
          keywords.push(`best ${title.toLowerCase()}`)
        }
      })

      setProductKeywords([...new Set(keywords)].slice(0, 50))
    }

    generateProductKeywords()
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
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  // Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DPITER.shop",
    alternateName: ["Dpiter", "DPITER", "dpiter.shop", "Dpiter Shop", "Dpiter India", "deepiter", "dipiter", "डीपीटर"],
    url: "https://dpiter.shop",
    logo: "https://dpiter.shop/logo.png",
    description:
      "India's #1 curated e-commerce platform. 100% verified products from Amazon, Flipkart, Meesho, Myntra. Best deals 2025-2028.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+919939091568",
      contactType: "customer service",
      email: "deepitermark@gmail.com",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: ["https://wa.me/919939091568", "mailto:deepitermark@gmail.com"],
  }

  return (
    <section id="dpiter-seo-block" aria-label="DPITER SEO Content" className="bg-[#FAF8F5] dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Main Heading */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1a4a4a] dark:text-teal-300">DPITER.shop</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            India's #1 curated e-commerce platform 2025-2028. 100% verified products from Amazon, Flipkart, Meesho,
            Myntra. Safe shopping, best deals, fast delivery across Delhi, Mumbai, Bangalore, Chennai & 500+ cities.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म। 100% वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स, फास्ट डिलीवरी।
          </p>
        </div>

        {/* Trending Links */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#1a4a4a]" />
            Trending:
          </span>
          {[
            { name: "Fashion Trends 2025", href: "/fashion" },
            { name: "Top Electronics", href: "/collections/electronics" },
            { name: "Beauty Bestsellers", href: "/collections/beauty" },
            { name: "Home Essentials", href: "/collections/home" },
            { name: "Today's Deals", href: "/offers" },
            { name: "Why DPITER?", href: "/about" },
          ].map((link, i) => (
            <span key={link.name} className="flex items-center">
              <Link href={link.href} className="text-[#1a4a4a] dark:text-teal-400 hover:underline font-medium">
                {link.name}
              </Link>
              {i < 5 && <span className="mx-1.5 text-gray-400">·</span>}
            </span>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-[#1a4a4a]" />
            Popular Searches:
          </span>
          {["trending products", "best deals", "new arrivals", "top rated", "under 500", "premium brands"].map(
            (term, i) => (
              <span key={term} className="flex items-center">
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-[#1a4a4a] dark:hover:text-teal-400"
                >
                  {term}
                </Link>
                {i < 5 && <span className="mx-1.5 text-gray-400">·</span>}
              </span>
            ),
          )}
        </div>

        {/* Fast Delivery */}
        <div className="flex flex-wrap justify-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#1a4a4a]" />
            Fast Delivery:
          </span>
          {seoKeywords.cities.slice(0, 12).join(", ")} + 500+ cities
        </div>

        {/* FAQ Section - Clean Accordion like image */}
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-serif font-medium text-[#1a4a4a] dark:text-teal-300 text-center">
            FAQ
          </h3>

          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 pr-4">{faq.question}</span>
                  <Plus
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      expandedFaq === index ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Growth Tips */}
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-medium text-[#1a4a4a] dark:text-teal-300 text-center flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Smart Shopping Tips 2025-2028
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {growthTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center"
              >
                <tip.icon className="w-5 h-5 text-[#1a4a4a] dark:text-teal-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{tip.title}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Article Section */}
        <div className="space-y-3">
          <button
            onClick={() => setShowArticle(!showArticle)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[#1a4a4a] dark:text-teal-300">
              <BookOpen className="w-4 h-4" />
              {articleContent.title}
            </span>
            {showArticle ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showArticle && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
              {articleContent.sections.map((section, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{section.heading}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backlinks - Partner Platforms */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center flex items-center justify-center gap-1">
            <Store className="w-3.5 h-3.5 text-[#1a4a4a]" />
            Shop From Trusted Platforms:
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {backlinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel={`${link.rel} noreferrer`}
                className="text-[10px] px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:border-[#1a4a4a] dark:hover:border-teal-500 hover:text-[#1a4a4a] dark:hover:text-teal-400 transition-colors flex items-center gap-1"
              >
                {link.name}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Keywords Tags */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center flex items-center justify-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#1a4a4a]" />
            Keywords & Tags:
          </h4>
          <div className="flex flex-wrap justify-center gap-1.5">
            {displayKeywords.slice(0, showAllKeywords ? 200 : 40).map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="text-[9px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 rounded hover:bg-[#1a4a4a]/10 dark:hover:bg-teal-500/10 hover:text-[#1a4a4a] dark:hover:text-teal-400 transition-colors"
              >
                {keyword}
              </Link>
            ))}
            {!showAllKeywords && (
              <button
                onClick={() => setShowAllKeywords(true)}
                className="text-[9px] px-2 py-0.5 bg-[#1a4a4a] text-white rounded hover:bg-[#1a4a4a]/80 font-medium"
              >
                +{allKeywords.length - 40} more
              </button>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-[#1a4a4a] dark:text-teal-400 font-medium">
            📌 Save / Bookmark this page for latest deals & trending products 2025-2028
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
            dpiter website login, dpiter signup, dpiter register, dpiter account create, dpiter wishlist save, dpiter
            search products, dpiter compare prices, dpiter find best deals, dpiter save money shopping, dpiter product
            reviews check, dpiter ratings, dpiter safe shopping verified, dpiter cod available, dpiter delivery time,
            dpiter returns policy, dpiter refund process, dpiter customer support whatsapp.
          </p>
          <h5>DPITER Benefits 2025-2028</h5>
          <p>
            Save money online shopping, compare prices across platforms, find best deals instantly, verified products
            only, safe secure online shopping, trusted marketplace india, genuine original products, no fake products
            guaranteed, quality assured products, best price guarantee, easy returns policy, secure payment gateway,
            multiple payment options, upi payment google pay phonepe paytm, credit debit card payment, net banking
            available, wallet payment, emi installment options, no cost emi available, buy now pay later bnpl.
          </p>
          <h5>Years Coverage</h5>
          <p>
            2025, 2025-2026, 2026, 2026-2027, 2027, 2027-2028, 2028, trending 2025, trending 2026, trending 2027,
            trending 2028, best deals 2025, best deals 2026, best deals 2027, best deals 2028, new arrivals 2025, new
            arrivals 2026, new arrivals 2027, new arrivals 2028, shopping trends 2025-2028, future shopping india.
          </p>
        </div>

        {/* JSON-LD Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </div>
    </section>
  )
}
