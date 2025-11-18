'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserAvatar } from './user-avatar'
import { createClient } from '@/lib/supabase/client'

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim()) {
        setProducts([])
        return
      }

      setIsLoading(true)
      const supabase = createClient()
      const query = searchQuery.toLowerCase().trim()

      const { data } = await supabase
        .from("products")
        .select("*")
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%,price.eq.${Number.parseFloat(query) || -1}`)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(20)

      setProducts(data || [])
      setIsLoading(false)
    }

    const debounce = setTimeout(() => {
      searchProducts()
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  return (
    <>
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto max-w-7xl px-2 py-1.5">
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                placeholder="Search for products..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <UserAvatar size="sm" asButton />
          </div>
        </div>
      </div>

      {showResults && searchQuery && (
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-lg max-h-[60vh] overflow-y-auto">
          <div className="container mx-auto max-w-7xl">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.category}/${product.id}/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col bg-slate-50 dark:bg-slate-700 rounded-md overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full aspect-[3/4] bg-slate-200 dark:bg-slate-600">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {product.brand}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
