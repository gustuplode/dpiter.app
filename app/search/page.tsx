"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SearchIcon } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { createClient } from "@/lib/supabase/client"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([])
        return
      }

      setIsLoading(true)
      const supabase = createClient()

      const { data } = await supabase
        .from("products")
        .select("*")
        .or(
          `title.ilike.${searchQuery}%,brand.ilike.${searchQuery}%,title.ilike.% ${searchQuery}%,brand.ilike.% ${searchQuery}%`,
        )
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(50)

      setProducts(data || [])
      setIsLoading(false)
    }

    const debounce = setTimeout(() => {
      searchProducts()
    }, 100)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f5] dark:bg-[#23150f]">
      <main className="flex-1 px-4 py-6">
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2a2a2e] text-[#23150f] dark:text-[#f8f6f5] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-4">
              {isLoading ? "Searching..." : `${products.length} results found`}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchIcon className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-[#23150f] dark:text-[#f8f6f5]">
              {searchQuery ? "No Products Found" : "Start Searching"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xs">
              {searchQuery ? "Try searching with different keywords" : "Search for your favorite brands and products"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-24 max-w-7xl mx-auto">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.affiliate_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col bg-white dark:bg-[#2a2a2e] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full overflow-hidden">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover"
                    style={{ backgroundImage: `url('${product.image_url}')` }}
                  />
                </div>
                <div className="flex flex-col p-3">
                  <p className="text-xs md:text-sm font-bold uppercase leading-normal tracking-wide text-slate-700 dark:text-slate-400">
                    {product.brand}
                  </p>
                  <p className="text-sm font-normal leading-normal text-slate-600 dark:text-slate-300 line-clamp-2">
                    {product.title}
                  </p>
                  <p className="text-sm font-medium leading-normal text-[#23150f] dark:text-[#f8f6f5] pt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
