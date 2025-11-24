import type React from "react"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"

export const metadata = {
  title: "DPITER.shop - Best Fashion Discovery Platform | Shop Trending Styles from Amazon, Flipkart, Meesho",
  description:
    "Discover trending fashion & lifestyle products curated from Amazon, Flipkart, Meesho, Myntra. Safe redirect shopping with best prices. 4.1 rated platform for boys fashion, mens clothing, gadgets & more.",
  keywords:
    "dpiter, dpiter shop, dpiter.shop, deepiter, dipiter, dpter, dkart, dcart, jpiter, jupter, jupiter shop, shopy, shopee, flipdkart, flipdpiter, flip dpiter, flip kart fashion, flipcart, fashion shopping, online shopping india, amazon fashion, flipkart fashion, meesho clothes, myntra outfits, boys fashion, mens clothing, trending fashion, curated fashion, affiliate shopping, best deals online, shopping, online shopping, fashion shopping, online shopping india, e-commerce india, ecommerce, shopping site, buy online, shop now, best deals, discount shopping, sale, offers, online store, fashion store, shopping app, mobile shopping, meesho shopping, meesho app, myntra sale, amazon deals, mens fashion, boys clothes, boys outfit, mens outfit, fashion trends, latest fashion, new fashion, stylish clothes, branded clothes, fashionable, trendy outfits, outfit ideas, street fashion, casual fashion, formal wear, party wear, ethnic wear, western wear, traditional wear, indo western, kurta sets, shirts, t-shirts, jeans, pants, shoes, footwear, sneakers, accessories, watches, bags, wallets, belts, sunglasses, jewelry, gadgets, electronics, mobile phones, smartphones, laptops, tablets, earphones, headphones, speakers, smart watch, fitness band, gaming, gaming accessories, ps5, xbox, nintendo, gaming console, gadgets shop, electronics shop, fashion discovery, style discovery, outfit discovery, fashion curator, best fashion, top fashion, quality fashion, premium fashion, affordable fashion, budget fashion, cheap clothes, low price, best price, price comparison, deal finder, coupon codes, discount codes, cashback, offers today, flash sale, mega sale, clearance sale, season sale, festival sale, diwali sale, christmas sale, new year sale, fashion sale, safe shopping, secure shopping, redirect shopping, comparison shopping, shopping india, india shopping, indian fashion, indian clothes, indian outfits, traditional indian, ethnic indian, fusion fashion, contemporary fashion, modern fashion",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "DPITER.shop - Fashion Discovery Platform",
    description:
      "Shop trending fashion from Amazon, Flipkart, Meesho. Curated collections, best prices, safe shopping.",
    type: "website",
    url: "https://dpiter.shop",
    images: [{ url: "/apple-touch-icon.png", width: 512, height: 512 }],
    siteName: "DPITER.shop",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPITER.shop - Fashion Discovery Platform",
    description: "Shop trending fashion from Amazon, Flipkart, Meesho",
    images: ["/apple-touch-icon.png"],
    site: "@dpiter_shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://dpiter.shop",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8A3224",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <style>{`
          body { opacity: 0; transition: opacity 0.2s ease-in; }
          body.loaded { opacity: 1; }
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('loaded');
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw-ad.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark overflow-x-hidden">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
