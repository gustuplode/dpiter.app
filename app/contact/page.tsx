import type { Metadata } from "next"
import ContactPageClient from "./client"

export const metadata: Metadata = {
  title: "Contact Us | DPITER.shop - Get in Touch",
  description:
    "Contact DPITER.shop for questions about our curated fashion collections from Amazon, Flipkart, Meesho, Myntra. We're here to help with your shopping experience.",
  keywords: [
    "contact dpiter",
    "dpiter support",
    "dpiter customer service",
    "fashion help",
    "shopping assistance",
    "dpiter email",
    "dpiter social media",
    "dpiter contact form",
  ],
  openGraph: {
    title: "Contact Us | DPITER.shop",
    description: "Get in touch with DPITER.shop team for any queries or support.",
    url: "https://dpiter.shop/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
