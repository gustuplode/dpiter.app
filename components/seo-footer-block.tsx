"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

// Comprehensive keyword database for SEO
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
  ],
  trending2025: [
    "trending products 2025",
    "best deals 2025",
    "top products 2025",
    "new arrivals 2025",
    "bestsellers 2025",
    "most popular 2025",
    "top rated 2025",
    "best selling 2025",
    "hot deals 2025",
    "flash sale 2025",
    "mega sale 2025",
    "discount offers 2025",
    "budget shopping 2025",
    "premium products 2025",
    "verified products 2025",
    "original products 2025",
    "authentic products 2025",
  ],
  trending2026: [
    "trending products 2026",
    "best deals 2026",
    "upcoming products 2026",
    "new launches 2026",
    "future trends 2026",
    "shopping trends 2026",
    "ecommerce 2026",
    "online shopping 2026",
    "best prices 2026",
    "discount sale 2026",
    "mega offers 2026",
    "festival sale 2026",
  ],
  trending2027_2028: [
    "shopping trends 2027",
    "ecommerce trends 2027-2028",
    "future shopping 2027",
    "best deals 2027",
    "online market 2028",
    "digital shopping 2028",
    "smart shopping 2027-2028",
    "ai shopping 2028",
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
    "office wear",
    "streetwear",
    "sportswear",
    "loungewear",
    "tshirts",
    "shirts",
    "jeans",
    "trousers",
    "kurta",
    "kurti",
    "saree",
    "lehenga",
    "salwar suit",
    "dress",
    "tops",
    "skirts",
    "shorts",
    "jackets",
    "blazers",
    "sweaters",
    "hoodies",
    "mens tshirt",
    "womens kurti",
    "designer saree",
    "wedding lehenga",
    "cotton shirts",
    "slim fit jeans",
    "palazzo pants",
    "anarkali suit",
    "indo western",
    "fusion wear",
  ],
  electronics: [
    "mobile phones",
    "smartphones",
    "laptops",
    "tablets",
    "smartwatches",
    "earbuds",
    "headphones",
    "speakers",
    "power banks",
    "chargers",
    "cables",
    "phone cases",
    "screen guards",
    "wireless earbuds",
    "bluetooth speakers",
    "gaming laptops",
    "budget phones",
    "flagship phones",
    "tws earbuds",
    "neckband",
    "smart tv",
    "led tv",
    "home theatre",
    "soundbar",
    "camera",
    "dslr",
    "action camera",
    "drone",
    "gimbal",
    "tripod",
    "ring light",
  ],
  beauty: [
    "skincare",
    "makeup",
    "haircare",
    "bodycare",
    "fragrance",
    "perfume",
    "deodorant",
    "face wash",
    "face serum",
    "moisturizer",
    "sunscreen",
    "cleanser",
    "toner",
    "face mask",
    "lipstick",
    "foundation",
    "concealer",
    "mascara",
    "eyeliner",
    "eyeshadow",
    "blush",
    "shampoo",
    "conditioner",
    "hair oil",
    "hair serum",
    "hair mask",
    "hair color",
    "body lotion",
    "body wash",
    "scrub",
    "soap",
    "hand cream",
    "foot cream",
    "nail polish",
    "makeup kit",
    "brush set",
    "beauty blender",
    "makeup remover",
  ],
  home: [
    "home decor",
    "furniture",
    "bedding",
    "curtains",
    "rugs",
    "carpets",
    "wall art",
    "kitchen appliances",
    "cookware",
    "storage",
    "organizers",
    "cleaning supplies",
    "bedsheets",
    "pillow covers",
    "cushion covers",
    "blankets",
    "comforters",
    "mattress",
    "dining table",
    "sofa",
    "chair",
    "wardrobe",
    "shoe rack",
    "tv unit",
    "bookshelf",
    "mixer grinder",
    "blender",
    "toaster",
    "microwave",
    "air fryer",
    "pressure cooker",
    "water bottle",
    "lunch box",
    "containers",
    "kitchen tools",
    "utensils",
  ],
  fitness: [
    "gym equipment",
    "fitness accessories",
    "yoga",
    "sports",
    "workout",
    "exercise",
    "dumbbells",
    "kettlebells",
    "resistance bands",
    "yoga mat",
    "exercise ball",
    "treadmill",
    "cycle",
    "elliptical",
    "rowing machine",
    "weight bench",
    "protein powder",
    "supplements",
    "vitamins",
    "pre workout",
    "post workout",
    "sports shoes",
    "running shoes",
    "gym wear",
    "track pants",
    "sports bra",
    "fitness tracker",
    "smart band",
    "gym bag",
    "water bottle",
    "shaker",
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
    "ludhiana",
    "agra",
    "nashik",
    "faridabad",
    "meerut",
    "rajkot",
    "kalyan",
    "vasai",
    "varanasi",
    "srinagar",
    "aurangabad",
    "dhanbad",
    "amritsar",
    "navi mumbai",
    "allahabad",
    "ranchi",
    "howrah",
    "coimbatore",
    "jabalpur",
    "gwalior",
    "vijayawada",
    "jodhpur",
    "madurai",
    "raipur",
  ],
  shopping: [
    "online shopping",
    "best price",
    "lowest price",
    "discount",
    "offer",
    "sale",
    "deal",
    "free delivery",
    "fast shipping",
    "cash on delivery",
    "cod",
    "emi",
    "no cost emi",
    "easy returns",
    "genuine products",
    "original products",
    "branded products",
    "quality products",
    "verified sellers",
    "trusted platform",
    "secure payment",
    "buy online",
    "shop online",
    "order online",
    "home delivery",
    "doorstep delivery",
  ],
  platforms: [
    "amazon",
    "flipkart",
    "meesho",
    "myntra",
    "ajio",
    "nykaa",
    "tata cliq",
    "snapdeal",
    "ebay",
    "aliexpress",
    "shopclues",
    "paytm mall",
    "jiomart",
    "bigbasket",
    "grofers",
    "amazon india",
    "flipkart india",
    "meesho products",
    "myntra fashion",
    "ajio fashion",
  ],
  actions: [
    "buy",
    "shop",
    "order",
    "get",
    "find",
    "discover",
    "explore",
    "browse",
    "search",
    "compare",
    "save",
    "bookmark",
    "wishlist",
    "cart",
    "checkout",
    "purchase",
    "download app",
    "install app",
    "visit website",
    "check deals",
    "view offers",
  ],
}

// Growth tips and article content
const growthTips = [
  "Compare prices across Amazon, Flipkart & Meesho before buying",
  "Check product reviews and ratings for quality assurance",
  "Use DPITER wishlist to track price drops",
  "Shop during festive sales for maximum discounts",
  "Enable notifications for flash deals and limited offers",
  "Bookmark your favorite categories for quick access",
  "Check seller ratings on original marketplace",
  "Use EMI options for expensive purchases",
]

const articleContent = {
  title: "Smart Shopping Guide 2025-2028",
  sections: [
    {
      heading: "Why Choose DPITER.shop?",
      content:
        "DPITER.shop is India's most trusted curated e-commerce aggregator. We handpick the best products from Amazon, Flipkart, Meesho, Myntra, and other top marketplaces. Every product listed is 100% verified, ensuring safe and secure shopping experience.",
    },
    {
      heading: "How DPITER Works",
      content:
        "We scan millions of products daily across major e-commerce platforms, filter out low-quality items, and present only the best deals. Our AI-powered recommendation system learns your preferences to show personalized product suggestions.",
    },
    {
      heading: "Shopping Trends 2025-2028",
      content:
        "The e-commerce landscape is evolving rapidly. Voice shopping, AR try-ons, and AI-powered recommendations are becoming mainstream. DPITER stays ahead by continuously updating our platform with latest technologies and trends.",
    },
  ],
}

interface CategorySEO {
  slug: string
  title: string
  titleHi: string
  paragraph: string
  paragraphHi: string
  keywords: string[]
  popularSearches: string[]
}

const categorySEOData: Record<string, CategorySEO> = {
  fashion: {
    slug: "fashion",
    title: "Fashion & Clothing",
    titleHi: "फैशन और कपड़े",
    paragraph:
      "Discover trending fashion 2025-2026 on DPITER.shop. Shop verified men's & women's clothing, ethnic wear, western wear from Amazon, Flipkart, Myntra. Best deals on t-shirts, kurtas, sarees, jeans, dresses. Free delivery across India.",
    paragraphHi:
      "DPITER.shop पर ट्रेंडिंग फैशन 2025-2026। वेरीफाइड मेंस और वूमेंस क्लोथिंग, एथनिक वियर, वेस्टर्न वियर। टी-शर्ट, कुर्ता, साड़ी, जींस पर बेस्ट डील्स।",
    keywords: [...seoKeywords.fashion, ...seoKeywords.trending2025.slice(0, 5)],
    popularSearches: ["mens tshirt 2025", "womens kurti", "designer saree", "slim fit jeans", "party dress"],
  },
  beauty: {
    slug: "beauty",
    title: "Beauty & Skincare",
    titleHi: "ब्यूटी और स्किनकेयर",
    paragraph:
      "Shop 100% genuine beauty products on DPITER.shop. Verified skincare, makeup, haircare from Nykaa, Amazon, Flipkart. Best serums, moisturizers, lipsticks, foundations 2025-2026. Trusted by millions across India.",
    paragraphHi:
      "DPITER.shop पर 100% असली ब्यूटी प्रोडक्ट्स। वेरीफाइड स्किनकेयर, मेकअप, हेयरकेयर। बेस्ट सीरम, मॉइस्चराइज़र, लिपस्टिक 2025-2026।",
    keywords: [...seoKeywords.beauty, ...seoKeywords.trending2025.slice(0, 5)],
    popularSearches: ["face serum 2025", "vitamin c serum", "sunscreen spf 50", "matte lipstick", "hair serum"],
  },
  electronics: {
    slug: "electronics",
    title: "Electronics & Gadgets",
    titleHi: "इलेक्ट्रॉनिक्स और गैजेट्स",
    paragraph:
      "Best electronics deals 2025-2026 on DPITER.shop. Shop verified mobiles, laptops, earbuds, smartwatches from Amazon, Flipkart. Lowest prices on TWS, power banks, chargers. Fast delivery across Delhi, Mumbai, Bangalore.",
    paragraphHi:
      "DPITER.shop पर बेस्ट इलेक्ट्रॉनिक्स डील्स 2025-2026। वेरीफाइड मोबाइल, लैपटॉप, ईयरबड्स, स्मार्टवॉच। TWS, पावर बैंक पर लोएस्ट प्राइस।",
    keywords: [...seoKeywords.electronics, ...seoKeywords.trending2025.slice(0, 5)],
    popularSearches: [
      "wireless earbuds 2025",
      "smartwatch under 5000",
      "gaming laptop",
      "iphone deals",
      "samsung galaxy",
    ],
  },
  home: {
    slug: "home",
    title: "Home & Kitchen",
    titleHi: "होम और किचन",
    paragraph:
      "Transform your home with DPITER.shop 2025-2026. Verified home decor, furniture, kitchen appliances from Amazon, Flipkart. Best bedsheets, curtains, mixer grinders, cookware. Easy returns & doorstep delivery.",
    paragraphHi:
      "DPITER.shop 2025-2026 के साथ अपने घर को ट्रांसफॉर्म करें। वेरीफाइड होम डेकोर, फर्नीचर, किचन अप्लायंसेज। बेस्ट बेडशीट, पर्दे, मिक्सर ग्राइंडर।",
    keywords: [...seoKeywords.home, ...seoKeywords.trending2025.slice(0, 5)],
    popularSearches: ["bedsheet set 2025", "mixer grinder", "air fryer", "curtains", "storage organizer"],
  },
  fitness: {
    slug: "fitness",
    title: "Fitness & Sports",
    titleHi: "फिटनेस और स्पोर्ट्स",
    paragraph:
      "Achieve fitness goals with DPITER.shop 2025-2026. Verified gym equipment, sportswear, supplements from Amazon, Flipkart. Best dumbbells, yoga mats, protein powders, running shoes. Pan India delivery.",
    paragraphHi:
      "DPITER.shop 2025-2026 के साथ फिटनेस गोल्स अचीव करें। वेरीफाइड जिम इक्विपमेंट, स्पोर्ट्सवियर, सप्लीमेंट्स। बेस्ट डम्बल्स, योगा मैट, प्रोटीन।",
    keywords: [...seoKeywords.fitness, ...seoKeywords.trending2025.slice(0, 5)],
    popularSearches: ["dumbbells set 2025", "yoga mat", "protein powder", "running shoes", "gym gloves"],
  },
  default: {
    slug: "all",
    title: "All Categories",
    titleHi: "सभी कैटेगरी",
    paragraph:
      "DPITER.shop — India's #1 curated e-commerce platform 2025-2026. 100% verified products from Amazon, Flipkart, Meesho, Myntra. Safe shopping, best deals, fast delivery across Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad.",
    paragraphHi:
      "DPITER.shop — भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म 2025-2026। 100% वेरीफाइड प्रोडक्ट्स, बेस्ट डील्स, फास्ट डिलीवरी दिल्ली, मुंबई, बैंगलोर, चेन्नई, कोलकाता।",
    keywords: [...seoKeywords.primary, ...seoKeywords.trending2025],
    popularSearches: [
      "trending products 2025",
      "best deals today",
      "new arrivals",
      "top rated products",
      "bestsellers",
    ],
  },
}

const trendingLinks = [
  { href: "/fashion", text: "Fashion 2025" },
  { href: "/collections/electronics", text: "Electronics" },
  { href: "/collections/beauty", text: "Beauty" },
  { href: "/collections/home", text: "Home & Kitchen" },
  { href: "/offers", text: "Today's Deals" },
  { href: "/about", text: "Why DPITER?" },
]

export function SEOFooterBlock() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  const { category, seoData, faqSchema, orgSchema } = useMemo(() => {
    let cat = "default"
    if (pathname?.includes("fashion") || pathname?.includes("clothing")) cat = "fashion"
    else if (pathname?.includes("beauty") || pathname?.includes("skincare")) cat = "beauty"
    else if (pathname?.includes("electronics") || pathname?.includes("gadgets")) cat = "electronics"
    else if (pathname?.includes("home") || pathname?.includes("kitchen")) cat = "home"
    else if (pathname?.includes("fitness") || pathname?.includes("sports")) cat = "fitness"

    const data = categorySEOData[cat] || categorySEOData.default

    // FAQ Schema
    const faqs = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is DPITER.shop safe and trustworthy for online shopping in 2025?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, DPITER.shop is India's most trusted curated e-commerce platform for 2025-2026. We only list 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra & eBay. All products undergo strict quality verification before listing.",
          },
        },
        {
          "@type": "Question",
          name: "How does DPITER.shop compare prices across platforms?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DPITER.shop aggregates products from multiple e-commerce platforms including Amazon, Flipkart, Meesho, Myntra, and more. Our AI-powered system continuously monitors prices and shows you the best deals, helping you save money on every purchase.",
          },
        },
        {
          "@type": "Question",
          name: "What is the delivery time for products ordered through DPITER?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery typically takes 3-7 business days across major Indian cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, and 500+ cities. Express delivery options available for select products in metros.",
          },
        },
        {
          "@type": "Question",
          name: "Can I return products purchased through DPITER.shop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DPITER redirects you to the original marketplace for purchase. Returns and exchanges follow the respective marketplace policies (Amazon, Flipkart, etc.). Our 24/7 support team on WhatsApp (+919939091568) assists with any issues.",
          },
        },
        {
          "@type": "Question",
          name: "Does DPITER.shop offer COD and EMI options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all payment options including Cash on Delivery (COD), UPI, Credit/Debit Cards, Net Banking, and No-Cost EMI are available as per the original marketplace policies. Shop confidently with secure payment gateways.",
          },
        },
      ],
    }

    // Organization Schema
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DPITER.shop",
      alternateName: ["Dpiter", "DPITER", "dpiter.shop", "Dpiter Shop", "Dpiter India", "deepiter", "dipiter"],
      url: "https://dpiter.shop",
      logo: "https://dpiter.shop/logo.png",
      description:
        "India's #1 curated e-commerce platform featuring 100% verified products from Amazon, Flipkart, Meesho, Myntra. Best deals 2025-2028.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+919939091568",
        contactType: "customer service",
        email: "deepitermark@gmail.com",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: ["https://dpiter.shop", "https://dpiter.com", "https://dpiter.in", "https://dpiter.app"],
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    }

    return { category: cat, seoData: data, faqSchema: faqs, orgSchema: org }
  }, [pathname])

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) return null

  // Generate keyword tags for display
  const allKeywords = [
    ...seoKeywords.primary.slice(0, 20),
    ...seoKeywords.trending2025.slice(0, 10),
    ...seoKeywords.trending2026.slice(0, 8),
    ...seoKeywords.trending2027_2028.slice(0, 5),
    ...seoData.keywords.slice(0, 15),
    ...seoKeywords.cities.slice(0, 15),
    ...seoKeywords.shopping.slice(0, 10),
    ...seoKeywords.platforms.slice(0, 8),
  ]

  return (
    <section
      id="dpiter-seo-block"
      aria-label="SEO Information"
      className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 py-6 px-4 mt-4"
    >
      <div className="container mx-auto max-w-7xl space-y-5">
        {/* Main SEO Paragraph - Bilingual */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {seoData.title} | {seoData.titleHi}
          </h2>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{seoData.paragraph}</p>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-500 italic">{seoData.paragraphHi}</p>
        </div>

        {/* Trending Links */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Trending:</span>
          {trendingLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline transition-colors"
            >
              {link.text}
              {i < trendingLinks.length - 1 && <span className="text-gray-400 ml-2">•</span>}
            </Link>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Popular Searches:</span>
          {seoData.popularSearches.map((term, i) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>

        {/* Years and Future Trends */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Shop by Year:</span>
          {["2025", "2025-2026", "2026", "2026-2027", "2027", "2027-2028", "2028"].map((year) => (
            <span
              key={year}
              className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded text-xs"
            >
              {year}
            </span>
          ))}
        </div>

        {/* Growth Tips */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <span className="text-orange-500">💡</span> Smart Shopping Tips 2025-2028
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {growthTips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Article Content */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">📖 {articleContent.title}</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expanded && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
              {articleContent.sections.map((section, i) => (
                <div key={i}>
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">{section.heading}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Keywords Tags */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tags:</span>
          <div className="flex flex-wrap gap-1.5">
            {allKeywords.slice(0, expanded ? 100 : 30).map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {keyword}
              </Link>
            ))}
            {!expanded && allKeywords.length > 30 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-[10px] px-1.5 py-0.5 text-orange-600 dark:text-orange-400 hover:underline"
              >
                +{allKeywords.length - 30} more
              </button>
            )}
          </div>
        </div>

        {/* Cities - Fast Delivery */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Fast Delivery Across India: </span>
          {seoKeywords.cities.slice(0, 25).join(" • ")} + 500 more cities
        </div>

        {/* Platforms */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Shop From: </span>
          Amazon India • Flipkart • Meesho • Myntra • Ajio • Nykaa • Tata Cliq • Snapdeal • eBay
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            📌 Save / Bookmark this page for latest deals & trending products 2025-2028
          </p>
        </div>

        {/* Hidden SEO Keywords (for crawlers) */}
        <div className="sr-only" aria-hidden="true">
          <h4>DPITER Keywords 2025-2028</h4>
          <p>
            dpiter, dpiter.shop, dpiter shop, dpiter app, dpiter india, dpiter online shopping, dpiter.com, dpiter.in,
            dpiter.ai, dpiterindia, dpiterindia.com, indiadpiter, dpitersite, deepiter, dipiter, dpitar, dpeeter,
            dipitar, dpiter store, dpiter mall, dpiter market, dpiter deals, dpiter offers, dpiter shopping, dpiter
            products, dpiter best deals, dpiter trending, dpiter popular, dpiter verified products, dpiter amazon,
            dpiter flipkart, dpiter meesho, dpiter myntra, dpiter ebay, trending products 2025, best deals 2025, new
            arrivals 2025, top rated 2025, trending products 2026, best deals 2026, upcoming products 2026, new launches
            2026, shopping trends 2027, ecommerce trends 2027-2028, future shopping 2027, best deals 2027, online
            shopping india, buy online india, shop online india, ecommerce india 2025, verified products india, original
            products india, authentic products india, fashion 2025, electronics 2025, beauty 2025, home decor 2025,
            fitness 2025, mens fashion, womens fashion, kids fashion, ethnic wear, western wear, mobile phones,
            smartphones, laptops, earbuds, smartwatches, gadgets, skincare, makeup, haircare, beauty products,
            cosmetics, home decor, furniture, kitchen appliances, bedding, cookware, gym equipment, fitness accessories,
            sports, yoga, supplements, delhi online shopping, mumbai online shopping, bangalore online shopping, chennai
            online shopping, kolkata online shopping, hyderabad online shopping, pune online shopping, jaipur online
            shopping, lucknow online shopping, best price, lowest price, discount, offer, sale, deal, free delivery,
            fast shipping, cash on delivery, cod, emi, no cost emi, easy returns, amazon india, flipkart india, meesho
            products, myntra fashion, ajio fashion
          </p>
        </div>

        {/* JSON-LD Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </div>
    </section>
  )
}
