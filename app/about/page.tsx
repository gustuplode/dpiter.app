import type { Metadata } from "next"
import AboutPageClient from "./client"

export const metadata: Metadata = {
  title: "About DPITER.shop | India's #1 Curated E-commerce Platform 2025-2026",
  description:
    "Learn about DPITER.shop - India's most trusted curated e-commerce platform. We showcase 100% verified, safe & certified products from Amazon, Flipkart, Meesho, Myntra & eBay. All major e-commerce giants have partnered with DPITER.",
  keywords: [
    "about dpiter",
    "dpiter shop story",
    "curated fashion platform",
    "fashion discovery",
    "amazon flipkart meesho",
    "dpiter mission",
    "dpiter vision",
    "fashion curation",
    "online shopping guide",
    "dpiter 2025",
    "dpiter 2026",
    "trusted shopping platform india",
  ],
  openGraph: {
    title: "About DPITER.shop | India's Premier Shopping Platform",
    description: "Discover why millions trust DPITER.shop for curated products from Amazon, Flipkart, Meesho & more.",
    url: "https://dpiter.shop/about",
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
