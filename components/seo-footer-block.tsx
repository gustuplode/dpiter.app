"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, TrendingUp, MapPin, Store, Sparkles, BookOpen, Tag, Calendar, Zap } from "lucide-react"

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
    "dpyter",
    "dipitr",
    "dpitir",
    "dpitr",
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
    "quality products 2025",
    "branded products 2025",
    "genuine products 2025",
    "certified products 2025",
    "safe products 2025",
    "trusted products 2025",
    "recommended products 2025",
    "editor picks 2025",
    "staff favorites 2025",
    "customer favorites 2025",
    "dpiter 2025",
    "dpiter trending 2025",
    "dpiter best 2025",
    "dpiter deals 2025",
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
    "dpiter 2026",
    "dpiter deals 2026",
    "dpiter offers 2026",
    "dpiter trending 2026",
    "spring collection 2026",
    "summer collection 2026",
    "winter collection 2026",
    "festive collection 2026",
    "wedding collection 2026",
    "party collection 2026",
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
    "dpiter 2027",
    "dpiter 2028",
    "dpiter 2027-2028",
    "future ecommerce 2027",
    "next gen shopping 2028",
    "smart marketplace 2027",
    "tech shopping 2028",
    "innovative shopping 2027",
    "modern ecommerce 2028",
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
    "bridal wear",
    "groom wear",
    "festive wear",
    "traditional wear",
    "contemporary fashion",
    "minimalist fashion",
    "sustainable fashion",
    "plus size fashion",
    "petite fashion",
    "maternity wear",
    "teen fashion",
    "college fashion",
    "workwear",
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
    "gaming accessories",
    "keyboard",
    "mouse",
    "monitor",
    "graphics card",
    "processor",
    "ram",
    "ssd",
    "hard drive",
    "router",
    "modem",
    "smart home",
    "smart bulb",
    "smart plug",
    "smart lock",
    "security camera",
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
    "anti aging cream",
    "vitamin c serum",
    "retinol",
    "hyaluronic acid",
    "niacinamide",
    "salicylic acid",
    "organic skincare",
    "natural beauty",
    "korean skincare",
    "ayurvedic products",
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
    "dinnerware",
    "bathroom accessories",
    "garden decor",
    "outdoor furniture",
    "lighting",
    "lamps",
    "wall clocks",
    "photo frames",
    "vases",
    "artificial plants",
    "candles",
    "diffusers",
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
    "whey protein",
    "mass gainer",
    "bcaa",
    "creatine",
    "multivitamin",
    "omega 3",
    "fat burner",
    "energy drinks",
    "protein bars",
    "healthy snacks",
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
    "kota",
    "chandigarh",
    "guwahati",
    "solapur",
    "hubli",
    "mysore",
    "tiruchirappalli",
    "bareilly",
    "aligarh",
    "tiruppur",
    "moradabad",
    "jalandhar",
    "bhubaneswar",
    "salem",
    "warangal",
    "guntur",
    "bhiwandi",
    "saharanpur",
    "gorakhpur",
    "bikaner",
    "amravati",
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
    "same day delivery",
    "next day delivery",
    "express delivery",
    "free shipping",
    "price drop",
    "clearance sale",
    "end of season sale",
    "festive sale",
    "diwali sale",
    "holi sale",
    "independence day sale",
    "republic day sale",
    "new year sale",
    "black friday",
    "cyber monday",
    "big billion days",
    "great indian festival",
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
    "nykaa beauty",
    "tata cliq fashion",
    "snapdeal deals",
    "ebay india",
    "shopclues offers",
  ],
  howToUse: [
    "how to use dpiter",
    "dpiter kaise use kare",
    "dpiter tutorial",
    "dpiter guide",
    "dpiter shopping guide",
    "dpiter app download",
    "dpiter website",
    "dpiter login",
    "dpiter signup",
    "dpiter register",
    "dpiter account",
    "dpiter wishlist",
    "dpiter search",
    "dpiter compare prices",
    "dpiter find deals",
    "dpiter save money",
    "dpiter best price",
    "dpiter product review",
    "dpiter ratings",
    "dpiter safe shopping",
    "dpiter cod",
    "dpiter delivery",
    "dpiter returns",
    "dpiter refund",
    "dpiter customer support",
  ],
  benefits: [
    "save money shopping",
    "compare prices online",
    "find best deals",
    "verified products",
    "safe online shopping",
    "trusted marketplace",
    "genuine products only",
    "no fake products",
    "quality assured",
    "best price guarantee",
    "easy returns policy",
    "secure payments",
    "multiple payment options",
    "upi payment",
    "card payment",
    "net banking",
    "wallet payment",
    "installment options",
    "buy now pay later",
    "student discounts",
    "first time user offer",
  ],
}

const growthTips = [
  { icon: "💰", tip: "Compare prices across Amazon, Flipkart & Meesho before buying" },
  { icon: "⭐", tip: "Check product reviews and ratings for quality assurance" },
  { icon: "❤️", tip: "Use DPITER wishlist to track price drops" },
  { icon: "🎉", tip: "Shop during festive sales for maximum discounts (Diwali, Holi, New Year)" },
  { icon: "🔔", tip: "Enable notifications for flash deals and limited offers" },
  { icon: "📌", tip: "Bookmark your favorite categories for quick access" },
  { icon: "✅", tip: "Check seller ratings on original marketplace before purchase" },
  { icon: "💳", tip: "Use EMI options for expensive purchases - No Cost EMI available" },
  { icon: "🚚", tip: "Check delivery time and shipping charges before ordering" },
  { icon: "↩️", tip: "Read return policy carefully - Easy returns on most products" },
  { icon: "🔒", tip: "Always use secure payment methods - UPI, Cards, Net Banking" },
  { icon: "📱", tip: "Install DPITER app for exclusive mobile-only deals" },
]

const articleContent = {
  title: "Complete Shopping Guide 2025-2028 | DPITER.shop",
  sections: [
    {
      heading: "Why Choose DPITER.shop for Online Shopping?",
      content:
        "DPITER.shop is India's most trusted curated e-commerce aggregator platform established for 2025-2028. We handpick the best products from Amazon India, Flipkart, Meesho, Myntra, Ajio, Nykaa, Tata Cliq, and other top marketplaces. Every product listed on DPITER is 100% verified, ensuring safe and secure shopping experience. Our AI-powered system scans millions of products daily to bring you the best deals at lowest prices. Major e-commerce platforms have officially partnered with DPITER to showcase their premium products.",
    },
    {
      heading: "How to Use DPITER.shop - Step by Step Guide",
      content:
        "Using DPITER is simple: 1) Browse or search for products you want 2) Compare prices across multiple platforms instantly 3) Read verified reviews and ratings 4) Click to buy - you'll be redirected to the original marketplace 5) Complete your purchase with your preferred payment method. DPITER saves you time and money by showing the best deals from Amazon, Flipkart, Meesho, Myntra all in one place. No more switching between apps!",
    },
    {
      heading: "Shopping Trends 2025-2028 - What's Hot?",
      content:
        "In 2025-2026, sustainable fashion, smart home devices, and personalized skincare are trending. Electronics like TWS earbuds, smartwatches, and gaming accessories continue to dominate. For 2027-2028, expect AI-powered shopping assistants, AR try-on features, and voice commerce to become mainstream. DPITER stays ahead by continuously updating our platform with latest technologies. Keywords: trending products 2025, best deals 2026, new arrivals 2027, top products 2028.",
    },
    {
      heading: "Best Categories to Shop on DPITER",
      content:
        "Fashion: Men's t-shirts, women's kurtas, designer sarees, wedding lehengas, kids clothing. Electronics: Mobile phones, laptops, TWS earbuds, smartwatches, gaming accessories. Beauty: Face serums, sunscreens, lipsticks, hair oils, perfumes. Home: Bedsheets, kitchen appliances, furniture, decor items. Fitness: Dumbbells, yoga mats, protein powders, sports shoes. All categories feature verified products from top brands with best prices.",
    },
    {
      heading: "DPITER Delivery & Payment Options",
      content:
        "DPITER products are delivered across 500+ cities in India including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow, Ahmedabad. Delivery time: 3-7 business days for standard, 1-2 days for express. Payment options: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, EMI, No Cost EMI, Buy Now Pay Later (BNPL).",
    },
    {
      heading: "DPITER Safety & Trust",
      content:
        "DPITER.shop is 100% safe and trusted. We only list verified products from authorized sellers. All products come with original warranty. Easy returns and refunds as per marketplace policy. 24/7 customer support via WhatsApp (+919939091568) and Email (deepitermark@gmail.com). Millions of happy customers across India trust DPITER for their online shopping needs.",
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
      "Discover trending fashion 2025-2028 on DPITER.shop. Shop verified men's & women's clothing, ethnic wear, western wear from Amazon, Flipkart, Myntra, Ajio. Best deals on t-shirts, kurtas, sarees, jeans, dresses, lehengas. Wedding collection, party wear, office wear, casual wear. 100% original brands at lowest prices. Free delivery across Delhi, Mumbai, Bangalore, Chennai, Kolkata & 500+ Indian cities.",
    paragraphHi:
      "DPITER.shop पर ट्रेंडिंग फैशन 2025-2028। वेरीफाइड मेंस और वूमेंस क्लोथिंग, एथनिक वियर, वेस्टर्न वियर। टी-शर्ट, कुर्ता, साड़ी, जींस, ड्रेस, लहंगा पर बेस्ट डील्स। 100% ओरिजिनल ब्रांड्स। फ्री डिलीवरी दिल्ली, मुंबई, बैंगलोर।",
    keywords: [...seoKeywords.fashion, ...seoKeywords.trending2025.slice(0, 10)],
    popularSearches: [
      "mens tshirt 2025",
      "womens kurti",
      "designer saree",
      "slim fit jeans",
      "party dress",
      "wedding lehenga",
      "cotton shirts",
      "kurta pajama",
    ],
  },
  beauty: {
    slug: "beauty",
    title: "Beauty & Skincare",
    titleHi: "ब्यूटी और स्किनकेयर",
    paragraph:
      "Shop 100% genuine beauty products on DPITER.shop 2025-2028. Verified skincare, makeup, haircare from Nykaa, Amazon, Flipkart. Best serums, moisturizers, sunscreens, lipsticks, foundations. Korean skincare, Ayurvedic products, organic beauty. Top brands like Lakme, Maybelline, L'Oreal, The Ordinary, Minimalist. Trusted by millions across India.",
    paragraphHi:
      "DPITER.shop पर 100% असली ब्यूटी प्रोडक्ट्स 2025-2028। वेरीफाइड स्किनकेयर, मेकअप, हेयरकेयर। बेस्ट सीरम, मॉइस्चराइज़र, सनस्क्रीन, लिपस्टिक। टॉप ब्रांड्स लैक्मे, मेबेलिन, लोरियल।",
    keywords: [...seoKeywords.beauty, ...seoKeywords.trending2025.slice(0, 10)],
    popularSearches: [
      "face serum 2025",
      "vitamin c serum",
      "sunscreen spf 50",
      "matte lipstick",
      "hair serum",
      "niacinamide serum",
      "retinol cream",
      "korean skincare",
    ],
  },
  electronics: {
    slug: "electronics",
    title: "Electronics & Gadgets",
    titleHi: "इलेक्ट्रॉनिक्स और गैजेट्स",
    paragraph:
      "Best electronics deals 2025-2028 on DPITER.shop. Shop verified mobiles, laptops, earbuds, smartwatches from Amazon, Flipkart. Lowest prices on TWS earbuds, power banks, chargers, gaming accessories. Top brands Samsung, Apple, OnePlus, Realme, boAt, Noise. Fast delivery across Delhi, Mumbai, Bangalore, Chennai & all India.",
    paragraphHi:
      "DPITER.shop पर बेस्ट इलेक्ट्रॉनिक्स डील्स 2025-2028। वेरीफाइड मोबाइल, लैपटॉप, ईयरबड्स, स्मार्टवॉच। TWS ईयरबड्स, पावर बैंक पर लोएस्ट प्राइस। टॉप ब्रांड्स।",
    keywords: [...seoKeywords.electronics, ...seoKeywords.trending2025.slice(0, 10)],
    popularSearches: [
      "wireless earbuds 2025",
      "smartwatch under 5000",
      "gaming laptop",
      "iphone deals",
      "samsung galaxy",
      "oneplus mobile",
      "boat earbuds",
      "noise smartwatch",
    ],
  },
  home: {
    slug: "home",
    title: "Home & Kitchen",
    titleHi: "होम और किचन",
    paragraph:
      "Transform your home with DPITER.shop 2025-2028. Verified home decor, furniture, kitchen appliances from Amazon, Flipkart, Pepperfry. Best bedsheets, curtains, mixer grinders, cookware, storage solutions. Premium quality at affordable prices. Easy returns & doorstep delivery across India.",
    paragraphHi:
      "DPITER.shop 2025-2028 के साथ अपने घर को ट्रांसफॉर्म करें। वेरीफाइड होम डेकोर, फर्नीचर, किचन अप्लायंसेज। बेस्ट बेडशीट, पर्दे, मिक्सर ग्राइंडर, कुकवेयर।",
    keywords: [...seoKeywords.home, ...seoKeywords.trending2025.slice(0, 10)],
    popularSearches: [
      "bedsheet set 2025",
      "mixer grinder",
      "air fryer",
      "curtains",
      "storage organizer",
      "mattress",
      "sofa set",
      "dining table",
    ],
  },
  fitness: {
    slug: "fitness",
    title: "Fitness & Sports",
    titleHi: "फिटनेस और स्पोर्ट्स",
    paragraph:
      "Achieve fitness goals with DPITER.shop 2025-2028. Verified gym equipment, sportswear, supplements from Amazon, Flipkart, Healthkart. Best dumbbells, yoga mats, protein powders, running shoes. Top brands Nike, Adidas, Puma, MuscleBlaze, Optimum Nutrition. Pan India delivery.",
    paragraphHi:
      "DPITER.shop 2025-2028 के साथ फिटनेस गोल्स अचीव करें। वेरीफाइड जिम इक्विपमेंट, स्पोर्ट्सवियर, सप्लीमेंट्स। बेस्ट डम्बल्स, योगा मैट, प्रोटीन पाउडर।",
    keywords: [...seoKeywords.fitness, ...seoKeywords.trending2025.slice(0, 10)],
    popularSearches: [
      "dumbbells set 2025",
      "yoga mat",
      "protein powder",
      "running shoes",
      "gym gloves",
      "whey protein",
      "resistance bands",
      "fitness tracker",
    ],
  },
  default: {
    slug: "all",
    title: "All Categories - Best Deals",
    titleHi: "सभी कैटेगरी - बेस्ट डील्स",
    paragraph:
      "DPITER.shop — India's #1 curated e-commerce platform 2025-2028. 100% verified products from Amazon, Flipkart, Meesho, Myntra, Ajio, Nykaa, Tata Cliq, eBay. Safe shopping, best deals, lowest prices, fast delivery across Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow, Ahmedabad & 500+ Indian cities. Fashion, Electronics, Beauty, Home, Fitness - all categories covered. Trusted by millions!",
    paragraphHi:
      "DPITER.shop — भारत का #1 क्यूरेटेड ई-कॉमर्स प्लेटफॉर्म 2025-2028। 100% वेरीफाइड प्रोडक्ट्स Amazon, Flipkart, Meesho, Myntra से। बेस्ट डील्स, फास्ट डिलीवरी दिल्ली, मुंबई, बैंगलोर, चेन्नई, कोलकाता & 500+ शहरों में। करोड़ों ग्राहकों का भरोसा!",
    keywords: [...seoKeywords.primary, ...seoKeywords.trending2025, ...seoKeywords.trending2026],
    popularSearches: [
      "trending products 2025",
      "best deals today",
      "new arrivals",
      "top rated products",
      "bestsellers",
      "flash sale",
      "mega offers",
      "today's deals",
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
  const [showAllKeywords, setShowAllKeywords] = useState(false)

  const { category, seoData, faqSchema, orgSchema } = useMemo(() => {
    let cat = "default"
    if (pathname?.includes("fashion") || pathname?.includes("clothing")) cat = "fashion"
    else if (pathname?.includes("beauty") || pathname?.includes("skincare")) cat = "beauty"
    else if (pathname?.includes("electronics") || pathname?.includes("gadgets")) cat = "electronics"
    else if (pathname?.includes("home") || pathname?.includes("kitchen")) cat = "home"
    else if (pathname?.includes("fitness") || pathname?.includes("sports")) cat = "fitness"

    const data = categorySEOData[cat] || categorySEOData.default

    // FAQ Schema with more Q&As
    const faqs = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is DPITER.shop safe and trustworthy for online shopping in 2025-2028?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, DPITER.shop is India's most trusted curated e-commerce platform for 2025-2028. We only list 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra, Ajio & eBay. All products undergo strict quality verification. Major e-commerce platforms have officially partnered with DPITER.",
          },
        },
        {
          "@type": "Question",
          name: "How does DPITER.shop compare prices across platforms?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DPITER.shop aggregates products from multiple e-commerce platforms including Amazon India, Flipkart, Meesho, Myntra, Ajio, Nykaa, Tata Cliq, and more. Our AI-powered system continuously monitors prices and shows you the best deals, helping you save money on every purchase.",
          },
        },
        {
          "@type": "Question",
          name: "What is the delivery time for products ordered through DPITER?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Delivery typically takes 3-7 business days across major Indian cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur, Lucknow, Ahmedabad, and 500+ cities. Express delivery options available for select products in metros (1-2 days).",
          },
        },
        {
          "@type": "Question",
          name: "How to use DPITER.shop for shopping?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Using DPITER is simple: 1) Browse or search products 2) Compare prices across platforms 3) Read reviews 4) Click to buy - redirected to original marketplace 5) Complete purchase. DPITER saves time and money by showing best deals from Amazon, Flipkart, Meesho, Myntra in one place.",
          },
        },
        {
          "@type": "Question",
          name: "Does DPITER.shop offer COD and EMI options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, all payment options including Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, EMI, No-Cost EMI, and Buy Now Pay Later are available as per original marketplace policies. Shop confidently with secure payment gateways.",
          },
        },
        {
          "@type": "Question",
          name: "Can I return products purchased through DPITER.shop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DPITER redirects you to the original marketplace for purchase. Returns and exchanges follow the respective marketplace policies (Amazon, Flipkart, etc.). Most products have 7-30 days return window. Our 24/7 support team on WhatsApp (+919939091568) assists with any issues.",
          },
        },
      ],
    }

    // Organization Schema
    const org = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DPITER.shop",
      alternateName: [
        "Dpiter",
        "DPITER",
        "dpiter.shop",
        "Dpiter Shop",
        "Dpiter India",
        "deepiter",
        "dipiter",
        "dpitar",
        "डीपीटर",
      ],
      url: "https://dpiter.shop",
      logo: "https://dpiter.shop/logo.png",
      description:
        "India's #1 curated e-commerce platform featuring 100% verified products from Amazon, Flipkart, Meesho, Myntra. Best deals 2025-2028. Trusted by millions.",
      foundingDate: "2024",
      slogan: "Shop Smart, Shop Safe with DPITER",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+919939091568",
        contactType: "customer service",
        email: "deepitermark@gmail.com",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
      sameAs: [
        "https://dpiter.shop",
        "https://dpiter.com",
        "https://dpiter.in",
        "https://dpiter.app",
        "https://dpiter.ai",
      ],
      areaServed: { "@type": "Country", name: "India" },
      award: "India's Most Trusted E-commerce Aggregator 2025-2028",
    }

    return { category: cat, seoData: data, faqSchema: faqs, orgSchema: org }
  }, [pathname])

  // Don't show on admin pages
  if (pathname?.startsWith("/admin")) return null

  // Generate comprehensive keyword list
  const allKeywords = [
    ...seoKeywords.primary,
    ...seoKeywords.trending2025,
    ...seoKeywords.trending2026,
    ...seoKeywords.trending2027_2028,
    ...seoData.keywords,
    ...seoKeywords.cities.slice(0, 30),
    ...seoKeywords.shopping,
    ...seoKeywords.platforms,
    ...seoKeywords.howToUse,
    ...seoKeywords.benefits,
  ]

  const displayKeywords = showAllKeywords ? allKeywords : allKeywords.slice(0, 40)

  return (
    <section
      id="dpiter-seo-block"
      aria-label="SEO Information"
      className="bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black border-t border-gray-200 dark:border-gray-800 py-6 px-4 mt-4"
    >
      <div className="container mx-auto max-w-7xl space-y-5">
        {/* Main SEO Paragraph - Bilingual with better styling */}
        <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8A3224] to-[#B84C3A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {seoData.title} <span className="text-gray-500 dark:text-gray-400 font-normal">|</span> {seoData.titleHi}
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-medium">{seoData.paragraph}</p>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 italic border-l-2 border-[#8A3224] pl-3">
            {seoData.paragraphHi}
          </p>
        </div>

        {/* Trending Links with icons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            <TrendingUp className="w-3.5 h-3.5 text-[#8A3224]" />
            Trending:
          </div>
          {trendingLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-[#8A3224] dark:text-orange-400 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/40 dark:hover:to-red-900/40 font-medium transition-all hover:shadow-sm"
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            <Tag className="w-3.5 h-3.5 text-[#8A3224]" />
            Popular Searches:
          </div>
          {seoData.popularSearches.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#8A3224] hover:text-[#8A3224] dark:hover:border-orange-500 dark:hover:text-orange-400 transition-all font-medium"
            >
              {term}
            </Link>
          ))}
        </div>

        {/* Years and Future Trends */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            <Calendar className="w-3.5 h-3.5 text-[#8A3224]" />
            Shop by Year:
          </div>
          {["2025", "2025-2026", "2026", "2026-2027", "2027", "2027-2028", "2028"].map((year) => (
            <span
              key={year}
              className="px-2 py-1 bg-gradient-to-r from-[#8A3224]/10 to-[#B84C3A]/10 dark:from-[#8A3224]/20 dark:to-[#B84C3A]/20 text-[#8A3224] dark:text-orange-400 rounded-lg text-xs font-semibold"
            >
              {year}
            </span>
          ))}
        </div>

        {/* Growth Tips - Enhanced design */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            Smart Shopping Tips 2025-2028
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {growthTips.map((item, i) => (
              <li
                key={i}
                className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 bg-white/50 dark:bg-gray-800/30 rounded-lg px-2.5 py-1.5"
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="font-medium">{item.tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Article Content - Enhanced */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/80 dark:hover:to-gray-900/80 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{articleContent.title}</span>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expanded && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
              {articleContent.sections.map((section, i) => (
                <div key={i} className="border-l-2 border-[#8A3224] pl-3">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1.5">{section.heading}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Keywords Tags - Enhanced */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
            <Tag className="w-3.5 h-3.5 text-[#8A3224]" />
            Keywords & Tags:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {displayKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-[#8A3224]/10 dark:hover:bg-[#8A3224]/20 hover:text-[#8A3224] dark:hover:text-orange-400 transition-all font-medium"
              >
                {keyword}
              </Link>
            ))}
            {!showAllKeywords && allKeywords.length > 40 && (
              <button
                onClick={() => setShowAllKeywords(true)}
                className="text-[10px] px-3 py-1 bg-[#8A3224] text-white rounded-lg hover:bg-[#6B2419] font-bold"
              >
                +{allKeywords.length - 40} more keywords
              </button>
            )}
          </div>
        </div>

        {/* Cities - Fast Delivery */}
        <div className="flex flex-wrap items-start gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#8A3224]" />
            Fast Delivery:
          </div>
          <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {seoKeywords.cities.slice(0, 30).join(" • ")}{" "}
            <span className="font-semibold text-[#8A3224]">+ 500+ cities</span>
          </span>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200">
            <Store className="w-3.5 h-3.5 text-[#8A3224]" />
            Shop From:
          </div>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Amazon India • Flipkart • Meesho • Myntra • Ajio • Nykaa • Tata Cliq • Snapdeal • eBay
          </span>
        </div>

        {/* CTA - Enhanced */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 bg-gradient-to-r from-[#8A3224]/5 to-[#B84C3A]/5 dark:from-[#8A3224]/10 dark:to-[#B84C3A]/10 rounded-xl p-3 border border-[#8A3224]/20">
            <p className="text-xs text-[#8A3224] dark:text-orange-400 font-bold flex items-center gap-2">
              📌 Save / Bookmark this page for latest deals & trending products 2025-2028
            </p>
          </div>
        </div>

        {/* Hidden SEO Keywords (for crawlers) - Massively expanded */}
        <div className="sr-only" aria-hidden="true">
          <h4>DPITER Keywords Database 2025-2028</h4>
          <p>{Object.values(seoKeywords).flat().join(", ")}</p>
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
            available, wallet payment, emi installment options, no cost emi available, buy now pay later bnpl, student
            discounts, first time user offer.
          </p>
        </div>

        {/* JSON-LD Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </div>
    </section>
  )
}
