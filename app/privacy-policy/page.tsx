import type { Metadata } from "next"
import PrivacyPolicyClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Privacy Policy | DPITER.shop - India's Trusted Shopping Platform",
  description:
    "DPITER.shop privacy policy - Learn how we protect your data. We don't collect payments or financial information. All purchases via trusted marketplaces like Amazon, Flipkart, Meesho, Myntra. 100% safe & secure shopping experience.",
  keywords: [
    "dpiter privacy policy",
    "dpiter.shop privacy",
    "dpiter data protection",
    "dpiter safe shopping",
    "dpiter security",
  ],
  openGraph: {
    title: "Privacy Policy | DPITER.shop",
    description: "Learn how DPITER.shop protects your data. 100% safe & secure shopping.",
    url: "https://dpiter.shop/privacy-policy",
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClientPage />
}
