"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AdFormat {
  id: string
  format_type: string
  ad_code: string
  is_active: boolean
  position: number
  created_at: string
}

interface AdFormatListProps {
  formatType: string
  ads: AdFormat[]
}

const formatTitles: Record<string, string> = {
  banner: "Display Banner Ads",
  onclick: "Onclick (Popunder) Ads",
  push_notifications: "Push Notifications",
  in_page_push: "In-Page Push Banners",
  interstitial: "Interstitial Ads",
  vignette: "Vignette Banners",
  native: "Native Banners",
}

export function AdFormatList({ formatType, ads }: AdFormatListProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      router.refresh()
    } catch (error) {
      console.error("Error deleting ad:", error)
      alert("Failed to delete ad")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              {formatTitles[formatType]}
            </h1>
          </div>
          <Link href={`/admin/ads/${formatType}/add`}>
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">No ads configured yet</p>
            <Link href={`/admin/ads/${formatType}/add`}>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Ad
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ad.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {ad.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Position: {ad.position}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                      <code className="text-xs font-mono text-text-primary-light dark:text-text-primary-dark break-all whitespace-pre-wrap">
                        {ad.ad_code.substring(0, 200)}
                        {ad.ad_code.length > 200 && "..."}
                      </code>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto sm:flex-shrink-0">
                    <Link href={`/admin/ads/${formatType}/edit/${ad.id}`} className="flex-1 sm:flex-none">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-blue-600 hover:bg-blue-50 bg-transparent w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 bg-transparent flex-1 sm:flex-none"
                      onClick={() => handleDelete(ad.id)}
                      disabled={deleting === ad.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
