import type React from "react"
import type { Metadata } from "next"
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LoadingBar } from "@/components/loading-bar"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Dpiter - Best Shopping Website for Boys | Best Clothing Website India USA UK",
  description:
    "Discover the best shopping website for boys with curated fashion and lifestyle collections. Shop best clothing website India, USA, UK. Full outfit collection low price with premium brands and exclusive deals.",
  keywords: [
    "best shopping website for boys",
    "best clothing website for boy",
    "best clothing website India",
    "best clothing website USA",
    "best clothing website UK",
    "full outfit collection low price",
    "affordable fashion India",
    "boys fashion online",
    "premium brands low price",
    "fashion collections",
    "lifestyle products",
    "shopping deals",
    "branded clothes affordable",
    "online shopping India",
    "trendy outfits boys",
    "fashion",
    "lifestyle",
    "collections",
    "shopping",
    "brands",
    "trends",
    "deals"
  ],
  authors: [{ name: "Dpiter" }],
  openGraph: {
    title: "Dpiter - Best Shopping Website for Boys | Affordable Fashion Collections",
    description: "Shop the best clothing website for boys in India, USA, UK. Full outfit collection low price with premium brands.",
    type: "website",
    siteName: "Dpiter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dpiter - Best Shopping Website for Boys",
    description: "Discover curated fashion collections at affordable prices",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw",
    other: {
      "msvalidate.01": "FC0ED3E2CD6BC6E015201B4F0DABF03E",
      monetag: "8e701858f43c71973d12ef290cd91d1f",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-8731726233953156",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="oAxbL_tiEoWvDgMQCCvT-bx5SpTHBRKA9yetJtFsoCw" />
      </head>
      <body className={`${poppins.className} font-display antialiased`}>
        <LoadingBar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
