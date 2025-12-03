"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Upload,
  X,
  ChevronDown,
  Shirt,
  Smartphone,
  Gamepad2,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react"
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
    description?: string
    keywords?: string
    image_aspect_ratio?: string
    image_width?: number
    image_height?: number
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
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || initialCategory || "fashion")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const [description, setDescription] = useState(initialData?.description || "")
  const [keywords, setKeywords] = useState(initialData?.keywords || "")

  const [imageAspectRatio, setImageAspectRatio] = useState(initialData?.image_aspect_ratio || "1:1 Square")
  const [imageWidth, setImageWidth] = useState(initialData?.image_width || 1080)
  const [imageHeight, setImageHeight] = useState(initialData?.image_height || 1080)

  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [aiSuccess, setAiSuccess] = useState(false)
  const previousImageUrl = useRef<string | null>(null)

  useEffect(() => {
    if (imageUrl && imageUrl !== previousImageUrl.current && !initialData) {
      previousImageUrl.current = imageUrl
      analyzeImageWithAI(imageUrl)
    }
  }, [imageUrl, initialData])

  const analyzeImageWithAI = async (url: string) => {
    setAiAnalyzing(true)
    setAiError(null)
    setAiSuccess(false)

    try {
      const res = await fetch("/api/admin/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "AI could not analyze the image. Please try again.")
      }

      setTitle(data.title || "")
      setBrand(data.brand || "Dpiter")
      setDescription(data.description || "")
      setKeywords(Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords || "")

      setAiSuccess(true)
      setTimeout(() => setAiSuccess(false), 3000)
    } catch (error) {
      console.error("AI analysis error:", error)
      setAiError(error instanceof Error ? error.message : "AI could not analyze the image. Please try again.")
    } finally {
      setAiAnalyzing(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setTempImageUrl(url)
      setShowCropper(true)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob, aspectRatio: string, width: number, height: number) => {
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
      setImageAspectRatio(aspectRatio)
      setImageWidth(width)
      setImageHeight(height)
      setShowCropper(false)
      setTempImageUrl(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    previousImageUrl.current = null
    setAiError(null)
    setAiSuccess(false)
    setImageAspectRatio("1:1 Square")
    setImageWidth(1080)
    setImageHeight(1080)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!brand || !title || !price || !imageUrl) {
      alert("Please fill all required fields and upload an image")
      return
    }

    setLoading(true)
    setUpdateSuccess(false)
    try {
      const payload = {
        brand,
        title,
        price: Number.parseFloat(price),
        image_url: imageUrl,
        affiliate_link: affiliateLink,
        category: selectedCategory,
        is_visible: true,
        description,
        keywords,
        image_aspect_ratio: imageAspectRatio,
        image_width: imageWidth,
        image_height: imageHeight,
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

      setUpdateSuccess(true)

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("productUpdated", { detail: { id: initialData?.id } }))
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push(`/admin/fashion`)
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
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
        <Link href="/admin/settings" className="ml-auto">
          <Button variant="ghost" size="sm" className="text-primary">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Settings
          </Button>
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Image * <span className="text-xs text-gray-500">(Upload first for AI auto-fill)</span>
          </label>
          {imageUrl ? (
            <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}>
                <img src={imageUrl || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {imageAspectRatio} • {imageWidth}×{imageHeight}
              </div>
              {aiAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 text-white animate-spin mb-3" />
                  <p className="text-white font-medium">AI is analyzing image...</p>
                  <p className="text-white/70 text-sm">Auto-filling product details</p>
                </div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white dark:bg-gray-800">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">Choose aspect ratio in crop screen</span>
              <span className="text-xs text-primary mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI will auto-fill details
              </span>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </label>
          )}

          {aiError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-400">{aiError}</p>
                <button
                  type="button"
                  onClick={() => analyzeImageWithAI(imageUrl)}
                  className="text-xs text-red-600 underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {aiSuccess && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-400">
                AI auto-filled Title, Brand, Description & Keywords!
              </p>
            </div>
          )}
        </div>

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
            Brand Name * <span className="text-xs text-primary">(AI: always "Dpiter")</span>
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="e.g., Dpiter"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Product Title * <span className="text-xs text-primary">(AI auto-fill)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="SEO optimized title will be auto-filled..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Price (₹) * <span className="text-xs text-gray-500">(Manual entry)</span>
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
            Description <span className="text-xs text-primary">(AI auto-fill)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary resize-none"
            placeholder="AI will generate SEO-friendly description..."
          />
          <p className="text-xs text-gray-500 mt-1">
            40-70 words SEO friendly description (shown on product details page)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Keywords (SEO) <span className="text-xs text-primary">(AI auto-fill)</span>
          </label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary resize-none"
            placeholder="AI will generate 8-12 SEO keywords..."
          />
          <p className="text-xs text-gray-500 mt-1">Comma-separated keywords for SEO (shown on product details page)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Affiliate Link <span className="text-xs text-gray-500">(Manual entry)</span>
          </label>
          <input
            type="url"
            value={affiliateLink}
            onChange={(e) => setAffiliateLink(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <Button
          type="submit"
          disabled={loading || aiAnalyzing || !brand || !title || !price || !imageUrl}
          className={`w-full h-12 font-semibold text-base disabled:opacity-50 transition-all ${
            updateSuccess ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {initialData ? "Updating..." : "Publishing..."}
            </span>
          ) : updateSuccess ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Updated Successfully!
            </span>
          ) : initialData ? (
            "Update Product"
          ) : (
            "Publish Product"
          )}
        </Button>
      </form>

      {showCropper && tempImageUrl && (
        <ImageCropper
          imageUrl={tempImageUrl}
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
