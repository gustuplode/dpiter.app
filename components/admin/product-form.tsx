"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ImageCropper } from "./image-cropper"

type Product = {
  id?: string
  title: string
  brand: string
  price: number
  original_price?: number
  image_url: string
  affiliate_link: string
  is_visible: boolean
}

export function ProductForm({ collectionId, product }: { collectionId: string; product?: Product }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    image_url: product?.image_url || "",
    affiliate_link: product?.affiliate_link || "",
    is_visible: product?.is_visible ?? true,
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setCropperImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    e.target.value = ""
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true)
    setCropperImage(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", croppedBlob, `product-${Date.now()}.jpg`)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setFormData((prev) => ({ ...prev, image_url: data.url }))
    } catch (error: any) {
      alert("Error uploading image: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)

    if (!formData.title || !formData.brand || !formData.image_url) {
      alert("Please fill in all required fields and upload an image")
      setLoading(false)
      return
    }

    try {
      const productData = {
        title: formData.title,
        brand: formData.brand,
        price: formData.price,
        original_price: formData.original_price || null,
        image_url: formData.image_url,
        affiliate_link: formData.affiliate_link,
        is_visible: formData.is_visible,
      }

      console.log("[v0] Saving product:", { ...productData, collection_id: collectionId })

      if (product?.id) {
        const { data, error } = await supabase.from("products").update(productData).eq("id", product.id).select()

        if (error) {
          console.error("[v0] Update error:", error)
          throw error
        }
        console.log("[v0] Product updated:", data)
        setSuccessMessage("Product updated successfully!")
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({
            ...productData,
            collection_id: collectionId,
          })
          .select()

        if (error) {
          console.error("[v0] Insert error:", error)
          throw error
        }
        console.log("[v0] Product created:", data)
        setSuccessMessage("Product created successfully! You can add another product or go back.")

        // Reset form for adding another product
        setFormData({
          title: "",
          brand: formData.brand, // Keep brand for convenience
          price: 0,
          original_price: 0,
          image_url: "",
          affiliate_link: "",
          is_visible: true,
        })
      }
    } catch (error: any) {
      console.error("[v0] Error saving product:", error)
      alert("Error saving product: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {cropperImage && (
        <ImageCropper
          imageUrl={cropperImage}
          aspectRatio={3 / 4}
          cropWidth={300}
          cropHeight={400}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperImage(null)}
        />
      )}

      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
        <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
          <Link
            href={`/admin/collections/${collectionId}/products`}
            className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-[#333333] dark:text-[#E5E7EB] text-lg font-bold leading-tight flex-1 text-center">
            {product ? "Edit Product" : "New Product"}
          </h1>
          <div className="size-10 shrink-0" />
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-4 mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
          </div>
        )}

        <main className="flex-1 px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Classic Crew Neck Tee"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Nike"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹ INR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  placeholder="2500.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (₹ INR)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: Number.parseFloat(e.target.value) })}
                  placeholder="3000.00 (for discount)"
                />
                <p className="text-xs text-gray-500">Leave empty or 0 if no discount</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image *</Label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image"
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2a2a2e] border border-[#E5E7EB] dark:border-[#4a4a50] rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333336]"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">{uploading ? "Uploading..." : "Choose & Crop Image"}</span>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <p className="text-xs text-gray-500">Upload HD images - original quality will be preserved</p>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full max-w-xs h-auto object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliate_link">Affiliate Link (optional)</Label>
              <Textarea
                id="affiliate_link"
                value={formData.affiliate_link}
                onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                placeholder="https://amzn.to/49SNT2h"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_visible"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_visible">Product Visible</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-[#4A90E2] hover:bg-[#4A90E2]/90"
              >
                {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                {product ? "Cancel" : "Done"}
              </Button>
            </div>

            {!product && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                You can add multiple products with the same name - each will be saved as a unique entry.
              </p>
            )}
          </form>
        </main>
      </div>
    </>
  )
}
