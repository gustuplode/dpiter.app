"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface AdFormatFormProps {
  formatType: "banner" | "onclick" | "push_notifications" | "in_page_push" | "interstitial" | "vignette" | "native"
  initialData?: {
    id: string
    ad_code: string
    is_active: boolean
    position: number
  }
}

const formatTitles = {
  banner: "Display Banner Ad",
  onclick: "Onclick (Popunder) Ad",
  push_notifications: "Push Notifications",
  in_page_push: "In-Page Push Banner",
  interstitial: "Interstitial Ad",
  vignette: "Vignette Banner",
  native: "Native Banner",
}

export function AdFormatForm({ formatType, initialData }: AdFormatFormProps) {
  const router = useRouter()
  const [adCode, setAdCode] = useState(initialData?.ad_code || "")
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true)
  const [position, setPosition] = useState(initialData?.position || 0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = initialData ? `/api/admin/ads/${initialData.id}` : "/api/admin/ads"

      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format_type: formatType,
          ad_code: adCode,
          is_active: isActive,
          position,
        }),
      })

      if (!response.ok) throw new Error("Failed to save ad format")

      router.push(`/admin/ads/${formatType}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving ad format:", error)
      alert("Failed to save ad format")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/ads/${formatType}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {initialData ? "Edit" : "Add"} {formatTitles[formatType]}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              Ad Code (Script or iframe)
            </label>
            <Textarea
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
              placeholder="Paste your ad script or iframe code here..."
              className="min-h-[200px] font-mono text-sm"
              required
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                Active Status
              </label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                Position (0 = first)
              </label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                min={0}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Ad Format" : "Save Ad Format"}
          </Button>
        </form>
      </div>
    </div>
  )
}
