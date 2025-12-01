"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, ChevronDown, Shirt, Smartphone, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ImageCropper } from "./image-cropper"

interface ProductFormProps {
  category?: string
  initialData?: {
    id: string
    brand: string
    title: string
    price: number
    image_url: string
    affiliate_link: string
    category?: string
  }
}

const categoryOptions = [
  { value: "fashion", label: "Fashion", icon: Shirt, color: "text-pink-500" },
  { value: "gadgets", label: "Gadgets", icon: Smartphone, color: "text-green-500" },
  { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-red-500" },
]

export function AdminProductForm({ category: initialCategory, initialData }: ProductFormProps) {
  const router = useRouter()
  const [brand, setBrand] = useState(initialData?.brand || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [price, setPrice] = useState(initialData?.price?.toString() || "")
  const [affiliateLink, setAffiliateLink] = useState(initialData?.affiliate_link || "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || initialCategory || "fashion")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setTempImageUrl(url)
      setShowCropper(true)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setLoading(true)
    try {
      const formData = new FormData()
      const file = new File([croppedBlob], `product-${Date.now()}.jpg`, { type: "image/jpeg" })
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await uploadRes.json()
      setImageUrl(url)
      setShowCropper(false)
      setTempImageUrl(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!brand || !title || !price || !imageUrl) {
      alert("Please fill all required fields and upload an image")
      return
    }

    setLoading(true)
    try {
      const payload = {
        brand,
        title,
        price: Number.parseFloat(price),
        image_url: imageUrl,
        affiliate_link: affiliateLink,
        category: selectedCategory, // Use selected category
        is_visible: true,
      }

      const res = initialData
        ? await fetch(`/api/admin/products/${initialData.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to save product")
      }

      router.push(`/admin/fashion`)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert(error instanceof Error ? error.message : "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryOption = categoryOptions.find((c) => c.value === selectedCategory)

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin/fashion">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          {initialData ? "Edit" : "Add"} Product
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Choose Category *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {selectedCategoryOption && (
                  <>
                    <selectedCategoryOption.icon className={`h-5 w-5 ${selectedCategoryOption.color}`} />
                    <span className="font-medium">{selectedCategoryOption.label}</span>
                  </>
                )}
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
                    <option.icon className={`h-5 w-5 ${option.color}`} />
                    <span className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {option.label}
                    </span>
                    {selectedCategory === option.value && (
                      <span className="ml-auto text-primary text-sm">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="e.g., TECHCORP"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="e.g., Smartwatch Pro X"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Price (₹) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="20699"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Affiliate Link
          </label>
          <input
            type="url"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Image *
          </label>
          {imageUrl ? (
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img src={imageUrl || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white dark:bg-gray-800">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !brand || !title || !price || !imageUrl}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base disabled:opacity-50"
        >
          {loading ? "Publishing..." : initialData ? "Update Product" : "Publish Product"}
        </Button>
      </form>

      {showCropper && tempImageUrl && (
        <ImageCropper
          imageUrl={tempImageUrl}
          aspectRatio={1}
          cropWidth={1080}
          cropHeight={1080}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false)
            setTempImageUrl(null)
            setSelectedFile(null)
          }}
        />
      )}
    </div>
  )
}
