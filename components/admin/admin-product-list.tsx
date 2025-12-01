"use client"

import type React from "react"

import { useState } from "react"
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
  const [products, setProducts] = useState(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState(category === "fashion" ? "all" : category)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Product | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const getCategoryCount = (cat: string) => {
    if (cat === "all") return products.length
    return products.filter((p) => p.category === cat).length
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleDragStart = (e: React.DragEvent, product: Product, index: number) => {
    setDraggedItem(product)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const newProducts = [...filteredProducts]
    const dragIndex = newProducts.findIndex((p) => p.id === draggedItem.id)

    if (dragIndex !== -1) {
      newProducts.splice(dragIndex, 1)
      newProducts.splice(dropIndex, 0, draggedItem)

      // Update pin positions
      const updatedProducts = newProducts.map((p, idx) => ({
        ...p,
        pin_position: idx + 1,
      }))

      // Update all products with new positions
      const allUpdated = products.map((p) => {
        const updated = updatedProducts.find((up) => up.id === p.id)
        return updated || p
      })

      setProducts(allUpdated)

      // Save pin positions to database
      try {
        await fetch("/api/admin/products/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: updatedProducts.map((p, idx) => ({
              id: p.id,
              pin_position: idx + 1,
            })),
          }),
        })
      } catch (error) {
        console.error("Failed to save order:", error)
      }
    }

    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handlePinToggle = async (product: Product) => {
    const newPinPosition = product.pin_position ? null : 1

    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin_position: newPinPosition }),
      })

      setProducts(products.map((p) => (p.id === product.id ? { ...p, pin_position: newPinPosition } : p)))
    } catch (error) {
      console.error("Failed to pin product:", error)
    }
  }

  const selectedOption = categoryOptions.find((c) => c.value === selectedCategory)

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Products</h1>
      </header>

      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {selectedOption?.icon && <selectedOption.icon className={`h-5 w-5 ${selectedOption.color}`} />}
              <span className="font-medium">{selectedOption?.label}</span>
              <span className="text-sm text-gray-500">({getCategoryCount(selectedCategory)})</span>
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
                    selectedCategory === option.value ? "bg-primary/10" : ""
                  }`}
                >
                  {option.icon && <option.icon className={`h-5 w-5 ${option.color}`} />}
                  {!option.icon && <div className="w-5 h-5" />}
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                    {option.label}
                  </span>
                  <span className="text-sm text-gray-500">({getCategoryCount(option.value)})</span>
                  {selectedCategory === option.value && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <GripVertical className="h-3 w-3" /> Drag products to reorder their position
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">No products yet</p>
            <Link href="/admin/fashion/add">
              <Button>Add First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, product, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedItem(null)
                  setDragOverIndex(null)
                }}
                className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border transition-all cursor-move ${
                  dragOverIndex === index
                    ? "border-primary border-2 bg-primary/5"
                    : "border-gray-200 dark:border-gray-700"
                } ${draggedItem?.id === product.id ? "opacity-50" : ""}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  {product.pin_position && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      #{product.pin_position}
                    </span>
                  )}
                </div>

                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary-light dark:text-text-primary-dark truncate">
                      {product.title}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        product.category === "fashion"
                          ? "bg-pink-100 text-pink-700"
                          : product.category === "gadgets"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{product.brand}</p>
                  <p className="text-sm font-bold text-primary">₹{product.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePinToggle(product)}
                    className={product.pin_position ? "text-primary" : "text-gray-400"}
                  >
                    <Pin className="h-4 w-4" fill={product.pin_position ? "currentColor" : "none"} />
                  </Button>
                  <Link href={`/admin/fashion/edit/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Link href="/admin/fashion/add" className="fixed bottom-6 right-6 z-20">
        <Button className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl p-0">
          <Plus className="h-7 w-7" />
        </Button>
      </Link>
    </div>
  )
}
