"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AdminMediaCropper } from "./admin-media-cropper"
import Link from "next/link"

export function AdminBannerForm({ banner }: { banner?: any }) {
  const router = useRouter()
  const [mediaType, setMediaType] = useState<"image" | "video" | "ad_code">(banner?.type || "image")
  const [mediaUrl, setMediaUrl] = useState(banner?.media_url || "")
  const [adCode, setAdCode] = useState(banner?.ad_code || "")
  const [position, setPosition] = useState(banner?.position || 0)
  const [isActive, setIsActive] = useState(banner?.is_active ?? true)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const fileType = file.type.startsWith("video/") ? "video" : "image"
      setMediaType(fileType)
      setShowCropper(true)
    }
  }

  const handleMediaProcessed = (url: string) => {
    setMediaUrl(url)
    setShowCropper(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = banner ? "PUT" : "POST"
      const url = banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mediaType === "image" ? "Image Banner" : mediaType === "video" ? "Video Banner" : "Ad Code Banner",
          type: mediaType,
          media_url: mediaType === "ad_code" ? "" : mediaUrl,
          ad_code: mediaType === "ad_code" ? adCode : null,
          position,
          is_active: isActive,
        }),
      })

      if (response.ok) {
        router.push("/admin/banners")
        router.refresh()
      } else {
        alert("Failed to save banner")
      }
    } catch (error) {
      console.error("Error saving banner:", error)
      alert("Error saving banner")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!banner || !confirm("Are you sure you want to delete this banner?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/banners")
        router.refresh()
      } else {
        alert("Failed to delete banner")
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      alert("Error deleting banner")
    } finally {
      setLoading(false)
    }
  }

  if (showCropper && selectedFile) {
    return (
      <AdminMediaCropper
        file={selectedFile}
        mediaType={mediaType === "ad_code" ? "image" : mediaType}
        onComplete={handleMediaProcessed}
        onCancel={() => {
          setShowCropper(false)
          setSelectedFile(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/banners">
            <Button variant="ghost" size="icon">
              <span className="material-symbols-outlined">arrow_back</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {banner ? "Edit Banner" : "Add Banner"}
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Banner Type
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaType === "image"}
                onChange={() => setMediaType("image")}
                className="w-4 h-4"
              />
              <span>Image</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaType === "video"}
                onChange={() => setMediaType("video")}
                className="w-4 h-4"
              />
              <span>Video</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={mediaType === "ad_code"}
                onChange={() => setMediaType("ad_code")}
                className="w-4 h-4"
              />
              <span>Ad Code</span>
            </label>
          </div>
        </div>

        {mediaType === "ad_code" ? (
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Ad Code (Script/Iframe)
            </label>
            <textarea
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
              placeholder="Paste your ad script or iframe code here, e.g., <script>...</script> or <iframe>...</iframe>"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark font-mono text-sm"
              rows={10}
            />
            {adCode && (
              <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                <div className="w-full aspect-[16/7] rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center">
                  <div dangerouslySetInnerHTML={{ __html: adCode }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              Upload {mediaType === "image" ? "Image" : "Video"}
            </label>
            <input
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
            {mediaUrl && (
              <div className="mt-4 relative w-full aspect-[16/7] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {mediaType === "image" ? (
                  <img src={mediaUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={mediaUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Position (Order)
          </label>
          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
            min="0"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
            id="is-active"
          />
          <label
            htmlFor="is-active"
            className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            Active (Show on website)
          </label>
        </div>

        <div className="flex gap-3">
          {banner && (
            <Button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || (mediaType !== "ad_code" && !mediaUrl) || (mediaType === "ad_code" && !adCode)}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? "Saving..." : banner ? "Update Banner" : "Publish Banner"}
          </Button>
        </div>
      </form>
    </div>
  )
}
