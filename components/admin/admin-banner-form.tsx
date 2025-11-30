"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AdminMediaCropper } from "./admin-media-cropper"
import Link from "next/link"
import { Check, Link2, RatioIcon } from "lucide-react"

const ASPECT_RATIOS = [
  { label: "16:7 (Default)", value: "16/7", width: 1920, height: 840 },
  { label: "16:9 (Widescreen)", value: "16/9", width: 1920, height: 1080 },
  { label: "21:9 (Ultra Wide)", value: "21/9", width: 2520, height: 1080 },
  { label: "4:3 (Standard)", value: "4/3", width: 1600, height: 1200 },
  { label: "1:1 (Square)", value: "1/1", width: 1080, height: 1080 },
  { label: "3:1 (Banner)", value: "3/1", width: 1800, height: 600 },
  { label: "2:1 (Wide Banner)", value: "2/1", width: 1600, height: 800 },
  { label: "Custom", value: "custom", width: 0, height: 0 },
]

export function AdminBannerForm({ banner }: { banner?: any }) {
  const router = useRouter()
  const [mediaType, setMediaType] = useState<"image" | "video" | "ad_code">(banner?.type || "image")
  const [mediaUrl, setMediaUrl] = useState(banner?.media_url || "")
  const [adCode, setAdCode] = useState(banner?.ad_code || "")
  const [linkUrl, setLinkUrl] = useState(banner?.link_url || "")
  const [position, setPosition] = useState(banner?.position || 0)
  const [isActive, setIsActive] = useState(banner?.is_active ?? true)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [aspectRatio, setAspectRatio] = useState(banner?.aspect_ratio || "16/7")
  const [customWidth, setCustomWidth] = useState(banner?.custom_width || 1920)
  const [customHeight, setCustomHeight] = useState(banner?.custom_height || 840)

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

  const getSelectedRatio = () => {
    const selected = ASPECT_RATIOS.find((r) => r.value === aspectRatio)
    if (aspectRatio === "custom") {
      return { width: customWidth, height: customHeight }
    }
    return selected || ASPECT_RATIOS[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)

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
          link_url: linkUrl || null,
          position,
          is_active: isActive,
          aspect_ratio: aspectRatio,
          custom_width: aspectRatio === "custom" ? customWidth : null,
          custom_height: aspectRatio === "custom" ? customHeight : null,
        }),
      })

      if (response.ok) {
        if (banner) {
          router.push("/admin/banners")
          router.refresh()
        } else {
          setSuccessMessage("Banner added successfully! You can add another banner or go back.")
          setMediaUrl("")
          setAdCode("")
          setLinkUrl("")
          setPosition(position + 1)
        }
      } else {
        const error = await response.json()
        alert("Failed to save banner: " + (error.error || "Unknown error"))
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
    const ratio = getSelectedRatio()
    return (
      <AdminMediaCropper
        file={selectedFile}
        mediaType={mediaType === "ad_code" ? "image" : mediaType}
        onComplete={handleMediaProcessed}
        onCancel={() => {
          setShowCropper(false)
          setSelectedFile(null)
        }}
        aspectRatio={aspectRatio === "custom" ? customWidth / customHeight : undefined}
        targetWidth={ratio.width}
        targetHeight={ratio.height}
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

      {successMessage && (
        <div className="mx-4 mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <Check className="h-5 w-5 text-green-600" />
          <p className="text-green-700 dark:text-green-400 font-medium">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            Banner Type
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mediaType === "image"}
                onChange={() => setMediaType("image")}
                className="w-4 h-4"
              />
              <span>Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mediaType === "video"}
                onChange={() => setMediaType("video")}
                className="w-4 h-4"
              />
              <span>Video</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
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

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            <div className="flex items-center gap-2">
              <RatioIcon className="w-4 h-4" />
              <span>Aspect Ratio</span>
            </div>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setAspectRatio(ratio.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  aspectRatio === ratio.value
                    ? "bg-[#883223] text-white border-[#883223]"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-[#883223] hover:text-[#883223]"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {aspectRatio === "custom" && (
            <div className="flex gap-3 items-center mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  min="100"
                  max="4000"
                />
              </div>
              <span className="text-gray-400 mt-5">x</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  min="100"
                  max="4000"
                />
              </div>
            </div>
          )}

          {/* Preview box */}
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Preview Ratio:</p>
            <div
              className="bg-gradient-to-br from-[#883223] to-[#5a211a] rounded-lg flex items-center justify-center text-white text-xs"
              style={{
                aspectRatio: aspectRatio === "custom" ? `${customWidth}/${customHeight}` : aspectRatio,
                maxHeight: "120px",
                width: "100%",
              }}
            >
              {aspectRatio === "custom" ? `${customWidth} x ${customHeight}` : aspectRatio.replace("/", ":")}
            </div>
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
              placeholder="Paste your ad script or iframe code here..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark font-mono text-sm"
              rows={10}
            />
            {adCode && (
              <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                <div
                  className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center"
                  style={{ aspectRatio: aspectRatio === "custom" ? `${customWidth}/${customHeight}` : aspectRatio }}
                >
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
            <p className="text-xs text-gray-500 mt-2">
              {mediaType === "image"
                ? `Images will be cropped to selected aspect ratio`
                : "Videos up to 500MB supported (MP4, WebM, MOV)"}
            </p>
            {mediaUrl && (
              <div
                className="mt-4 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                style={{ aspectRatio: aspectRatio === "custom" ? `${customWidth}/${customHeight}` : aspectRatio }}
              >
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
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              <span>Redirect Link (Optional)</span>
            </div>
          </label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com/page or /products/category"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark"
          />
          <p className="text-xs text-gray-500 mt-1">
            When user clicks on this banner, they will be redirected to this URL. Leave empty for no redirect.
          </p>
        </div>

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
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first. Use same number to display multiple banners at once.
          </p>
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
            className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark cursor-pointer"
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
            className="flex-1 bg-[#883223] hover:bg-[#6a2619]"
          >
            {loading ? "Saving..." : banner ? "Update Banner" : "Add Banner"}
          </Button>
        </div>

        {!banner && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            You can add multiple banners with the same image/video - each will be saved as a unique entry.
          </p>
        )}
      </form>
    </div>
  )
}
