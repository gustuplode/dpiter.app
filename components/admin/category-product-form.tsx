"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageCropper } from "@/components/admin/image-cropper"
import { Loader2 } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"

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
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(product?.image_url || "")
  const [formData, setFormData] = useState({
    title: product?.title || "",
    brand: product?.brand || "",
    price: product?.price?.toString() || "",
    affiliate_link: product?.affiliate_link || "",
    is_visible: product?.is_visible ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const productData = {
        title: formData.title,
        brand: formData.brand,
        price: parseFloat(formData.price),
        image_url: imageUrl,
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
      } else {
        const { error } = await supabase
          .from("category_products")
          .insert([productData])

        if (error) throw error
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
      const supabase = createClient()

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="image">Product Image *</Label>
          <ImageCropper
            onImageCropped={setImageUrl}
            initialImage={imageUrl}
            aspectRatio={3 / 4}
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            placeholder="Enter brand name"
            required
          />
        </div>

        <div>
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter product title"
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price (INR) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <Label htmlFor="affiliate_link">Affiliate Link *</Label>
          <Input
            id="affiliate_link"
            type="url"
            value={formData.affiliate_link}
            onChange={(e) =>
              setFormData({ ...formData, affiliate_link: e.target.value })
            }
            placeholder="https://..."
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_visible"
            checked={formData.is_visible}
            onChange={(e) =>
              setFormData({ ...formData, is_visible: e.target.checked })
            }
            className="h-4 w-4"
          />
          <Label htmlFor="is_visible">Visible to users</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading || !imageUrl}
          className="flex-1 bg-[#4A90E2] hover:bg-[#357ABD]"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Update" : "Create"} Product
        </Button>

        {product && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
