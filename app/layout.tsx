import type React from "react"
import "./globals.css"
import { Suspense } from "react"
import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"

export const metadata = {
  title: "Dpiter - E-commerce Collections",
  description: "Shop the latest fashion, gadgets, and gaming products",
    generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8A3324",
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
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark overflow-x-hidden">
        <Suspense fallback={<div className="h-32 bg-background-light dark:bg-background-dark" />}>
          <SearchHeader />
        </Suspense>
        <main className="pb-16 min-h-screen">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
