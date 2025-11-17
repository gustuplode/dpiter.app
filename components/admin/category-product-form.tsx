"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ImageCropper } from "./image-cropper"

interface CategoryProduct {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  affiliate_link: string
  category: string
  is_visible: boolean
}

interface CategoryProductFormProps {
  product?: CategoryProduct
  category: string
}

export function CategoryProductForm({ product, category }: CategoryProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    price: product?.price?.toString() || "",
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
    
    e.target.value = ''
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true)
    setCropperImage(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", croppedBlob, "category-product.jpg")

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
    
    if (!formData.title || !formData.brand || !formData.image_url) {
      alert("Please fill in all required fields and upload an image")
      return
    }
    
    setIsLoading(true)

    try {
      const productData = {
        title: formData.title,
        brand: formData.brand,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        affiliate_link: formData.affiliate_link,
        category: category,
        is_visible: formData.is_visible,
        updated_at: new Date().toISOString(),
      }

      if (product) {
        const { error } = await supabase
          .from("category_products")
          .update(productData)
          .eq("id", product.id)

        if (error) throw error
        alert("Product updated successfully!")
      } else {
        const { error } = await supabase
          .from("category_products")
          .insert([productData])

        if (error) throw error
        alert("Product created successfully!")
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("category_products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setIsLoading(false)
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Classic Crew Neck Tee"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            placeholder="e.g., Nike"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹ INR)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="2500.00"
            required
          />
          <p className="text-xs text-gray-500">
            Enter price in INR (Indian Rupees)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Product Image</Label>
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
          <Label htmlFor="affiliate_link">Affiliate Link</Label>
          <Textarea
            id="affiliate_link"
            value={formData.affiliate_link}
            onChange={(e) =>
              setFormData({ ...formData, affiliate_link: e.target.value })
            }
            placeholder="https://amzn.to/49SNT2h"
            rows={3}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_visible"
            checked={formData.is_visible}
            onChange={(e) =>
              setFormData({ ...formData, is_visible: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="is_visible">Product Visible</Label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isLoading || uploading || !formData.image_url}
            className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD]"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>

          {product && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1"
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </>
  )
}
