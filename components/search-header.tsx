"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useTransition } from "react"
import { Search, X, Mic, ArrowLeft, Clock, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  id: string
  title: string
  brand?: string
  price: number
  original_price?: number
  image_url: string
  category?: string
}

export function SearchHeader() {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const trendingSearches = ["Fashion", "Electronics", "Home Decor", "Beauty", "Gadgets", "Shoes"]

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (isInteractingRef.current) return
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearchActive(false)
      }
    }

    const handleScroll = () => {
      if (isInteractingRef.current) return
      if (isSearchActive && !searchQuery) {
        setIsSearchActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isSearchActive, searchQuery])

  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("category_products")
        .select("id, title, brand, price, original_price, image_url, category")
        .eq("is_visible", true)
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(10)

      setResults(data || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchProducts])

  const handleSearch = (query: string) => {
    if (!query.trim()) return

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))

    setIsSearchActive(false)
    setSearchQuery("")
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleFocus = () => {
    isInteractingRef.current = true
    setIsSearchActive(true)
    setTimeout(() => {
      isInteractingRef.current = false
    }, 500)
  }

  const handleSearchClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    isInteractingRef.current = true
    setIsSearchActive(true)
    inputRef.current?.focus()
    setTimeout(() => {
      isInteractingRef.current = false
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = results.length > 0 ? results : []
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const product = results[selectedIndex]
        router.push(
          `/products/${product.category || "fashion"}/${product.id}/${encodeURIComponent(product.title.toLowerCase().replace(/\s+/g, "-"))}`,
        )
        setIsSearchActive(false)
      } else {
        handleSearch(searchQuery)
      }
    } else if (e.key === "Escape") {
      setIsSearchActive(false)
    }
  }

  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      handleSearch(transcript)
    }

    recognition.start()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
    inputRef.current?.focus()
  }

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const getProductUrl = (product: SearchResult) => {
    return `/products/${product.category || "fashion"}/${product.id}/${encodeURIComponent(product.title.toLowerCase().replace(/\s+/g, "-"))}`
  }

  return (
    <div ref={containerRef} className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 lg:px-6 lg:py-3">
        {isSearchActive ? (
          <button
            onClick={() => {
              setIsSearchActive(false)
              setSearchQuery("")
            }}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <Link href="/" className="flex items-center">
            <span className="text-xl lg:text-2xl font-bold text-[#883223]">Dpiter</span>
          </Link>
        )}

        <div
          className="flex-1 flex items-center h-10 lg:h-11 bg-white dark:bg-gray-800 rounded-full overflow-hidden cursor-text border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-[#883223] focus-within:ring-1 focus-within:ring-[#883223]/30 transition-all shadow-sm"
          onClick={handleSearchClick}
          onTouchStart={handleSearchClick}
        >
          <div className="flex items-center justify-center w-10 lg:w-12 h-full">
            <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="flex-1 h-full bg-transparent text-sm lg:text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />

          {searchQuery && (
            <button
              onClick={clearSearch}
              className="flex items-center justify-center w-8 h-full text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <button
            onClick={startVoiceSearch}
            disabled={isListening}
            className={`flex items-center justify-center w-10 h-full transition-colors ${
              isListening ? "text-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Mic className={`h-4 w-4 ${isListening ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchActive && (
        <div
          className="absolute left-0 right-0 top-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg max-h-[70vh] overflow-y-auto"
          onMouseDown={() => (isInteractingRef.current = true)}
          onMouseUp={() => setTimeout(() => (isInteractingRef.current = false), 100)}
          onTouchStart={() => (isInteractingRef.current = true)}
          onTouchEnd={() => setTimeout(() => (isInteractingRef.current = false), 100)}
        >
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#883223]" />
            </div>
          )}

          {!loading && searchQuery && results.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Results</p>
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={getProductUrl(product)}
                  onClick={() => setIsSearchActive(false)}
                  className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selectedIndex === index ? "bg-gray-50 dark:bg-gray-800" : ""
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${product.image_url || "/placeholder.svg"})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  </div>
                  <p className="text-sm font-bold text-[#883223]">₹{product.price}</p>
                </Link>
              ))}
            </div>
          )}

          {!loading && searchQuery && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-gray-500">No products found for "{searchQuery}"</p>
            </div>
          )}

          {!searchQuery && (
            <>
              {recentSearches.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Recent Searches</p>
                  {recentSearches.map((search) => (
                    <div
                      key={search}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <button onClick={() => handleSearch(search)} className="flex items-center gap-3 flex-1 text-left">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="py-2">
                <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Trending</p>
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
                  >
                    <TrendingUp className="h-4 w-4 text-[#883223]" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
