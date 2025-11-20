"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { CategoryHeader } from "./category-header"

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

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
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%`)
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

  const isAdminPage = pathname.startsWith("/admin")
  const isProductPage = pathname.startsWith("/products/")
  const isProfilePage = pathname === "/profile"
  const isCollectionPage = pathname.startsWith("/collections/")
  const showBackButton = isProductPage || isProfilePage || isCollectionPage
  const showLogo = pathname === "/" && !isScrolled
  const showCategoryHeader = !isAdminPage && !isProductPage && !isProfilePage && !isCollectionPage

  if (isAdminPage) {
    return null
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-700/50">
        {/* Logo section */}
        {showLogo && (
          <div className="flex items-center justify-between gap-4 px-4 py-1.5 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white">
                <span className="font-display font-bold text-lg">D</span>
              </div>
              <h1 className="font-display text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                Dpiter
              </h1>
            </div>
          </div>
        )}

        {/* Search bar section */}
        <div className="px-4 py-2">
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
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-2 text-sm font-normal leading-normal"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
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
        </div>

        {showCategoryHeader && (
          <div className="pb-1.5 bg-white dark:bg-gray-900">
            <CategoryHeader />
          </div>
        )}
      </div>

      {showResults && searchQuery && (
        <div className="fixed top-[160px] left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto shadow-lg">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-text-secondary-light dark:text-text-secondary-dark text-sm">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.category}/${product.id}/${product.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex flex-col bg-white dark:bg-slate-700 rounded-md overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full aspect-square bg-slate-200 dark:bg-slate-600">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                      {product.brand}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-1">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-text-primary-light dark:text-white mt-1">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
