"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CategoryHeader } from "./category-header"
import { CurrencyDisplay } from "./currency-display"
import { Search, Mic, Camera, X, Clock, TrendingUp, ArrowUpRight, Star } from "lucide-react"

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches] = useState(["Men's Fashion", "Women's Dress", "Shoes", "Watch", "Saree", "T-Shirt"])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()
  const router = useRouter()

  const isAdminPage = pathname.startsWith("/admin")
  const isProductPage = pathname.startsWith("/products/")
  const isProfilePage = pathname === "/profile"
  const isCollectionPage = pathname.startsWith("/collections/")
  const showBackButton = isProductPage || isProfilePage || isCollectionPage
  const showCategoryHeader =
    !isAdminPage && !isProductPage && !isProfilePage && !isCollectionPage && !isSearchFocused && !searchQuery

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 8))
    }
  }, [])

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([])
      setSuggestions([])
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const searchTerm = query.toLowerCase().trim()

    // Search for exact and similar matches
    const { data } = await supabase
      .from("category_products")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(30)

    // Generate auto-suggestions from results
    const uniqueSuggestions = new Set<string>()
    data?.forEach((product) => {
      // Add brand as suggestion
      if (product.brand?.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(product.brand)
      }
      // Add category as suggestion
      if (product.category?.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(product.category)
      }
      // Add title words as suggestions
      const titleWords = product.title?.split(" ") || []
      titleWords.forEach((word: string) => {
        if (word.toLowerCase().includes(searchTerm) && word.length > 3) {
          uniqueSuggestions.add(word)
        }
      })
    })

    setSuggestions(Array.from(uniqueSuggestions).slice(0, 5))
    setProducts(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchProducts(searchQuery)
    }, 200)
    return () => clearTimeout(debounce)
  }, [searchQuery, searchProducts])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + products.length

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      if (selectedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[selectedIndex])
      } else {
        const productIndex = selectedIndex - suggestions.length
        if (products[productIndex]) {
          handleProductClick(products[productIndex])
        }
      }
    } else if (e.key === "Escape") {
      setShowResults(false)
    }
  }

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase())].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const handleProductClick = (product: any) => {
    saveRecentSearch(searchQuery || product.title)
    setShowResults(false)
    setSearchQuery("")
    router.push(`/products/${product.category}/${product.id}/${product.title.toLowerCase().replace(/\s+/g, "-")}`)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    saveRecentSearch(suggestion)
    inputRef.current?.focus()
  }

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter((s) => s !== search)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const searchContainer = inputRef.current?.parentElement?.parentElement
      const resultsContainer = resultsRef.current

      if (
        searchContainer &&
        !searchContainer.contains(target) &&
        resultsContainer &&
        !resultsContainer.contains(target)
      ) {
        setShowResults(false)
        setIsSearchFocused(false)
        if (!searchQuery) {
          setSelectedIndex(-1)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside as any)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside as any)
    }
  }, [searchQuery])

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false)
      setIsSearchFocused(false)
    }, 200)
  }

  if (isAdminPage) return null

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-3 py-2 space-y-1.5">
          <div className="flex items-center gap-2">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-xl text-gray-700 dark:text-gray-300">arrow_back</span>
              </button>
            )}

            <div className="flex-1 relative">
              <div className="flex w-full items-center h-11 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <div className="flex items-center justify-center pl-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  className="flex-1 h-full bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-3 text-sm focus:outline-none"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setShowResults(true)
                    setIsSearchFocused(true)
                  }}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setIsSearchFocused(false)
                      setShowResults(false)
                      inputRef.current?.blur()
                    }}
                    className="flex items-center justify-center px-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center pr-2 gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-1">
                  <button className="flex items-center justify-center rounded-full h-8 w-8 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center rounded-full h-8 w-8 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showCategoryHeader && (
            <div className="bg-white dark:bg-slate-800">
              <CategoryHeader />
            </div>
          )}
        </div>
      </div>

      {showResults && (
        <div
          ref={resultsRef}
          className="fixed top-[60px] md:top-[52px] left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-y-auto shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            {searchQuery && suggestions.length > 0 && (
              <div className="border-b border-gray-100 dark:border-gray-800">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedIndex === idx ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                  >
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 text-left">
                      <span className="font-medium">{suggestion}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <button onClick={clearRecentSearches} className="text-xs text-blue-600 hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <div
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      <button
                        onClick={(e) => removeRecentSearch(search, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!searchQuery && (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Trending Now
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                      <span>Searching...</span>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center px-4">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No results for "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4">
                      Try different keywords or browse categories
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {trendingSearches.slice(0, 4).map((search) => (
                        <button
                          key={search}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Try: {search}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {products.length} results for "<span className="font-medium">{searchQuery}</span>"
                      </p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {products.map((product, idx) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                            selectedIndex === suggestions.length + idx ? "bg-gray-100 dark:bg-gray-800" : ""
                          }`}
                        >
                          <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 py-0.5">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                              {product.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {product.brand} • {product.category}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                <CurrencyDisplay price={product.price} />
                              </span>
                              {product.original_price && product.original_price > product.price && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">
                                    <CurrencyDisplay price={product.original_price} />
                                  </span>
                                  <span className="text-xs font-semibold text-green-600">
                                    {Math.round(
                                      ((product.original_price - product.price) / product.original_price) * 100,
                                    )}
                                    % off
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                4.1 <Star className="w-2.5 h-2.5 fill-current" />
                              </span>
                              <span className="text-[10px] text-gray-500">Free Delivery</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
