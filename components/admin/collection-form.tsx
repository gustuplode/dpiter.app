"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ImageCropper } from "./image-cropper"

type Collection = {
  id?: string
  title: string
  brand: string
  image_url: string
  status: string
  is_limited_time: boolean
}

export function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropperImage, setCropperImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: collection?.title || "",
    brand: collection?.brand || "",
    image_url: collection?.image_url || "",
    status: collection?.status || "draft",
    is_limited_time: collection?.is_limited_time || false,
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
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true)
    setCropperImage(null)

    try {
      const formData = new FormData()
      formData.append("file", croppedBlob, "collection-image.jpg")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
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

    try {
      if (collection?.id) {
        // Update existing collection
        const { error } = await supabase.from("collections").update(formData).eq("id", collection.id)

        if (error) throw error
      } else {
        // Create new collection
        const { error } = await supabase.from("collections").insert(formData)

        if (error) throw error
      }

      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      alert("Error saving collection: " + error.message)
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
            href="/admin"
            className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-[#333333] dark:text-[#E5E7EB] text-lg font-bold leading-tight flex-1 text-center">
            {collection ? "Edit Collection" : "New Collection"}
          </h1>
          <div className="size-10 shrink-0" />
        </header>

        <main className="flex-1 px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Collection Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Essentials"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Zara"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Collection Image</Label>
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
              <p className="text-xs text-gray-500">
                Will be cropped to 300×400px (3:4 aspect ratio) to match home page display
              </p>
              {formData.image_url && (
                <div className="mt-2">
                  <div className="w-full max-w-[150px] aspect-[3/4] rounded-md overflow-hidden">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_limited_time"
                checked={formData.is_limited_time}
                onChange={(e) => setFormData({ ...formData, is_limited_time: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_limited_time">Limited Time Offer</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-[#4A90E2] hover:bg-[#4A90E2]/90"
              >
                {loading ? "Saving..." : collection ? "Update Collection" : "Create Collection"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
