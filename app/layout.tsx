import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] })

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
      "msvalidate.01": "FC0ED3E2CD6BC6E015201B4F0DABFp03E",
      monetag: "8e701858f43c71973d12ef290cd91d1f",
    },
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className={`${plusJakartaSans.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
