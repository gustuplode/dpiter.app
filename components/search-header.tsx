"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { CategoryHeader } from "./category-header"
import { CurrencyDisplay } from "./currency-display"

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        .from("category_products")
        .select("*")
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
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

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const handleProductClick = (product: any) => {
    saveRecentSearch(searchQuery)
    setShowResults(false)
    setSearchQuery("")
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const isAdminPage = pathname.startsWith("/admin")
  const isProductPage = pathname.startsWith("/products/")
  const isProfilePage = pathname === "/profile"
  const isCollectionPage = pathname.startsWith("/collections/")
  const showBackButton = isProductPage || isProfilePage || isCollectionPage
  const showCategoryHeader = !isAdminPage && !isProductPage && !isProfilePage && !isCollectionPage

  if (isAdminPage) {
    return null
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-2 space-y-1.5">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-xl text-text-primary-light dark:text-text-primary-dark">
                  arrow_back
                </span>
              </button>
            )}

            <label className="flex flex-col min-w-40 h-10 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                <div className="text-text-secondary-light dark:text-text-secondary-dark flex items-center justify-center pl-3">
                  <span className="material-symbols-outlined text-lg">search</span>
                </div>
                <input
                  ref={inputRef}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-2 text-sm font-normal leading-normal"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="flex items-center justify-center px-2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
                <div className="flex items-center pr-2 gap-1">
                  <button className="flex items-center justify-center rounded-md h-7 w-7 bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-lg">mic</span>
                  </button>
                  <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                  <button className="flex items-center justify-center rounded-md h-7 w-7 bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </button>
                </div>
              </div>
            </label>
          </div>

          {showCategoryHeader && (
            <div className="bg-white dark:bg-slate-800">
              <CategoryHeader />
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <div className="fixed top-[60px] md:top-[52px] left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="max-w-7xl mx-auto">
            {/* Recent Searches - show when no query */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Searches</h3>
                  <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecentSearchClick(search)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">history</span>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span>Searching...</span>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3 block">
                      search_off
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Try different keywords or check spelling
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Results Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Found <strong>{products.length}</strong> results for "<strong>{searchQuery}</strong>"
                      </p>
                    </div>

                    {/* YouTube-style list view for search results */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.category}/${product.id}/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => handleProductClick(product)}
                          className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          {/* Thumbnail */}
                          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                              {product.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {product.brand} • {product.category}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                <CurrencyDisplay price={product.price} />
                              </span>
                              {product.original_price && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">
                                    <CurrencyDisplay price={product.original_price} />
                                  </span>
                                  <span className="text-sm font-semibold text-green-600">
                                    {Math.round(
                                      ((product.original_price - product.price) / product.original_price) * 100,
                                    )}
                                    % off
                                  </span>
                                </>
                              )}
                            </div>
                            {/* Rating badge */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                4.1
                                <span
                                  className="material-symbols-outlined text-[10px]"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                              </span>
                              <span className="text-xs text-gray-500">Free Delivery</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Quick Links when no query */}
            {!searchQuery && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Popular Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Fashion", "Electronics", "Beauty", "Home"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/${cat.toLowerCase()}`}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary">trending_up</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
