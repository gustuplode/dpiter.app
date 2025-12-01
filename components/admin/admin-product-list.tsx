"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ChevronDown,
  Shirt,
  Smartphone,
  Gamepad2,
  Pin,
  Check,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  brand: string
  title: string
  price: number
  image_url: string
  affiliate_link: string
  category: string
  is_visible: boolean
  pin_position?: number | null
}

const categoryOptions = [
  { value: "all", label: "All Products", icon: null, color: "text-gray-500" },
  { value: "fashion", label: "Fashion", icon: Shirt, color: "text-pink-500" },
  { value: "gadgets", label: "Gadgets", icon: Smartphone, color: "text-green-500" },
  { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-red-500" },
]

export function AdminProductList({ category, initialProducts }: { category: string; initialProducts: Product[] }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const dragStartIndex = useRef<number>(-1)

  const refreshProducts = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to refresh products:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.pin_position && b.pin_position) return a.pin_position - b.pin_position
    if (a.pin_position) return -1
    if (b.pin_position) return 1
    return 0
  })

  const getCategoryCount = (cat: string) => {
    if (cat === "all") return products.length
    return products.filter((p) => p.category === cat).length
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete product")
    }
  }

  const handleDragStart = (e: React.DragEvent, product: Product, index: number) => {
    setDraggedProduct(product)
    dragStartIndex.current = index
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", product.id)

    // Add visual feedback
    const target = e.target as HTMLElement
    setTimeout(() => {
      target.style.opacity = "0.5"
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverId(productId)
  }

  const handleDrop = async (e: React.DragEvent, dropProduct: Product, dropIndex: number) => {
    e.preventDefault()

    if (!draggedProduct || draggedProduct.id === dropProduct.id) {
      setDraggedProduct(null)
      setDragOverId(null)
      return
    }

    // Create new order
    const newProducts = [...sortedProducts]
    const dragIndex = newProducts.findIndex((p) => p.id === draggedProduct.id)

    if (dragIndex !== -1) {
      // Remove dragged item
      newProducts.splice(dragIndex, 1)
      // Insert at new position
      newProducts.splice(dropIndex, 0, draggedProduct)

      // Update pin positions
      const updatedProducts = newProducts.map((p, idx) => ({
        ...p,
        pin_position: idx + 1,
      }))

      // Update local state
      setProducts((prev) => {
        return prev.map((p) => {
          const updated = updatedProducts.find((up) => up.id === p.id)
          return updated || p
        })
      })

      // Save to database
      try {
        const res = await fetch("/api/admin/products/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: updatedProducts.map((p) => ({
              id: p.id,
              pin_position: p.pin_position,
            })),
          }),
        })

        if (!res.ok) {
          console.error("Failed to save order")
          refreshProducts() // Revert on error
        }
      } catch (error) {
        console.error("Failed to save order:", error)
        refreshProducts() // Revert on error
      }
    }

    setDraggedProduct(null)
    setDragOverId(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = "1"
    setDraggedProduct(null)
    setDragOverId(null)
  }

  const handlePinToggle = async (product: Product) => {
    const currentPinned = sortedProducts.filter((p) => p.pin_position !== null && p.pin_position !== undefined)
    const newPinPosition = product.pin_position ? null : currentPinned.length + 1

    // Optimistic update
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, pin_position: newPinPosition } : p)))

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin_position: newPinPosition }),
      })

      if (!res.ok) {
        // Revert on error
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, pin_position: product.pin_position } : p)))
        console.error("Failed to pin product")
      }
    } catch (error) {
      // Revert on error
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, pin_position: product.pin_position } : p)))
      console.error("Failed to pin product:", error)
    }
  }

  const selectedOption = categoryOptions.find((c) => c.value === selectedCategory)

  return (
    <div className="relative flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
      <header className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Products</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshProducts}
          disabled={isRefreshing}
          className={isRefreshing ? "animate-spin" : ""}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </header>

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {selectedOption?.icon && <selectedOption.icon className={`h-5 w-5 ${selectedOption.color}`} />}
              <span className="font-medium">{selectedOption?.label}</span>
              <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {getCategoryCount(selectedCategory)}
              </span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(option.value)
                    setShowCategoryDropdown(false)
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedCategory === option.value ? "bg-orange-50 dark:bg-orange-900/20" : ""
                  }`}
                >
                  {option.icon && <option.icon className={`h-5 w-5 ${option.color}`} />}
                  {!option.icon && <div className="w-5 h-5" />}
                  <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                  <span className="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {getCategoryCount(option.value)}
                  </span>
                  {selectedCategory === option.value && <Check className="ml-auto h-4 w-4 text-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <GripVertical className="h-3 w-3" /> Drag products to reorder their position
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No {selectedCategory === "all" ? "" : selectedCategory} products yet
            </p>
            <Link href="/admin/fashion/add">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Add First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedProducts.map((product, index) => (
              <div
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, product, index)}
                onDragOver={(e) => handleDragOver(e, product.id)}
                onDrop={(e) => handleDrop(e, product, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={() => setDragOverId(null)}
                className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                  dragOverId === product.id
                    ? "border-orange-500 border-2 bg-orange-50 dark:bg-orange-900/20 scale-[1.02]"
                    : "border-gray-200 dark:border-gray-700"
                } ${draggedProduct?.id === product.id ? "opacity-50 scale-95" : ""}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  {product.pin_position && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">
                      #{product.pin_position}
                    </span>
                  )}
                </div>

                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  draggable={false}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{product.title}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
                        product.category === "fashion"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                          : product.category === "gadgets"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                  <p className="text-sm font-bold text-orange-600">₹{product.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePinToggle(product)}
                    className={`h-8 w-8 ${product.pin_position ? "text-orange-500 bg-orange-50" : "text-gray-400"}`}
                    title={product.pin_position ? "Unpin product" : "Pin product"}
                  >
                    <Pin className="h-4 w-4" fill={product.pin_position ? "currentColor" : "none"} />
                  </Button>
                  <Link href={`/admin/fashion/edit/${product.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Link href="/admin/fashion/add" className="fixed bottom-6 right-6 z-20">
        <Button className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl p-0">
          <Plus className="h-7 w-7" />
        </Button>
      </Link>
    </div>
  )
}
