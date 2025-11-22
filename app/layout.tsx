import type React from "react"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"

export const metadata = {
  title: "Dpiter - E-commerce Collections",
  description: "Shop the latest fashion, gadgets, and gaming products",
    generator: 'v0.app'
}

export const viewport = {
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
