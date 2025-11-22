"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BannerListClient({ banners }: { banners: any[] }) {
  return (
    <div className="grid gap-4">
      {banners.map((banner) => (
        <BannerItem key={banner.id} banner={banner} />
      ))}
    </div>
  )
}

function BannerItem({ banner }: { banner: any }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this banner?")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Failed to delete banner: ${errorData.error || "Unknown error"}`)
        return
      }

      // Force hard refresh of the page
      window.location.reload()
    } catch (error) {
      console.error("Failed to delete:", error)
      alert("Failed to delete banner. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/admin/banners/edit/${banner.id}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {banner.type === "image" ? (
            <img
              src={banner.media_url || "/placeholder.svg"}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover"
            />
          ) : (
            <video src={banner.media_url} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded px-2 py-1 text-xs font-semibold">
            {banner.type === "image" ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">
              {banner.type === "image" ? "Image Banner" : "Video Banner"}
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Position: {banner.position} • {banner.is_active ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline" size="sm">
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 bg-transparent"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
