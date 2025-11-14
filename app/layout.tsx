import type React from "react"
import type { Metadata } from "next"
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Dpiter - Curated Fashion & Lifestyle Collections",
  description:
    "Discover handpicked collections of premium fashion and lifestyle products from top brands. Shop the latest trends with exclusive deals.",
  keywords: ["fashion", "lifestyle", "collections", "shopping", "brands", "trends", "deals"],
  authors: [{ name: "Dpiter" }],
  openGraph: {
    title: "Dpiter - Curated Fashion & Lifestyle Collections",
    description: "Discover handpicked collections of premium fashion and lifestyle products",
    type: "website",
    siteName: "Dpiter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dpiter - Curated Fashion Collections",
    description: "Discover handpicked collections of premium fashion products",
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
    google: "sHFi0coDLCMtYeXcBFJ7pIrzGeebms59PVwFCCrATSA",
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
        <meta name="google-site-verification" content="sHFi0coDLCMtYeXcBFJ7pIrzGeebms59PVwFCCrATSA" />
      </head>
      <body className={`${poppins.className} font-display antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
