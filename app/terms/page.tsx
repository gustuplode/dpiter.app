import type { Metadata } from "next"
import TermsPageClient from "./client"

export const metadata: Metadata = {
  title: "Terms of Service | DPITER.shop - India's Trusted Shopping Platform",
  description:
    "DPITER.shop terms of service. Read our terms and conditions for using India's most trusted curated e-commerce platform.",
  keywords: ["dpiter terms", "dpiter.shop terms", "dpiter conditions", "dpiter service terms"],
  openGraph: {
    title: "Terms of Service | DPITER.shop",
    description: "Terms and conditions for using DPITER.shop platform.",
    url: "https://dpiter.shop/terms",
  },
}

export default function TermsPage() {
  return <TermsPageClient />
}
