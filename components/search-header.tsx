"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { CategoryHeader } from "./category-header"
import { CurrencyDisplay } from "./currency-display"
import { Search, Mic, X, Clock, TrendingUp, ArrowUpRight } from "lucide-react"

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
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

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

    const { data } = await supabase
      .from("category_products")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(30)

    const uniqueSuggestions = new Set<string>()
    data?.forEach((product) => {
      if (product.brand?.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(product.brand)
      }
      if (product.category?.toLowerCase().includes(searchTerm)) {
        uniqueSuggestions.add(product.category)
      }
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

  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-IN"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      setShowResults(true)
      setIsSearchFocused(true)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

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
      closeSearch()
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
    closeSearch()
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

  const closeSearch = () => {
    setShowResults(false)
    setIsSearchFocused(false)
    setSearchQuery("")
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isSearchFocused || showResults) {
        closeSearch()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isSearchFocused, showResults])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        resultsRef.current &&
        !resultsRef.current.contains(target)
      ) {
        closeSearch()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  if (isAdminPage) return null

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-3 py-2 space-y-1.5">
          <div className="flex items-center gap-2" ref={searchContainerRef}>
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-xl text-gray-700 dark:text-gray-300">arrow_back</span>
              </button>
            )}

            <div className="flex-1 relative">
              <div className="flex w-full items-center h-10 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:border-orange-400 dark:focus-within:border-orange-500 focus-within:shadow-sm transition-all">
                <div className="flex items-center justify-center pl-3">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  className="flex-1 h-full bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-2 text-sm focus:outline-none"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowResults(true)
                    setIsSearchFocused(true)
                  }}
                  onFocus={() => {
                    setShowResults(true)
                    setIsSearchFocused(true)
                  }}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery && (
                  <button
                    onClick={closeSearch}
                    className="flex items-center justify-center px-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={startVoiceSearch}
                  className={`flex items-center justify-center h-10 w-10 rounded-r-md transition-colors ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
                </button>
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
          className="fixed top-[52px] left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-y-auto shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            {searchQuery && suggestions.length > 0 && (
              <div className="border-b border-gray-100 dark:border-gray-800">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedIndex === idx ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                  >
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 text-left font-medium">
                      {suggestion}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            )}

            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    Recent
                  </h3>
                  <button onClick={clearRecentSearches} className="text-xs text-blue-600 hover:underline">
                    Clear
                  </button>
                </div>
                <div className="space-y-0.5">
                  {recentSearches.map((search) => (
                    <div
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      <button
                        onClick={(e) => removeRecentSearch(search, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!searchQuery && (
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2 uppercase">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {trendingSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                      <span className="text-sm">Searching...</span>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                      No results for "{searchQuery}"
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-3">Try different keywords</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {trendingSearches.slice(0, 4).map((search) => (
                        <button
                          key={search}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-2.5 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{products.length} results</p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {products.map((product, idx) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className={`flex gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
                            selectedIndex === suggestions.length + idx ? "bg-gray-100 dark:bg-gray-800" : ""
                          }`}
                        >
                          <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                              {product.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.brand}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                <CurrencyDisplay price={product.price} />
                              </span>
                              {product.original_price && product.original_price > product.price && (
                                <span className="text-xs font-medium text-green-600">
                                  {Math.round(
                                    ((product.original_price - product.price) / product.original_price) * 100,
                                  )}
                                  % off
                                </span>
                              )}
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
