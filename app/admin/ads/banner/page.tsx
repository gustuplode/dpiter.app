import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function BannerAdsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: ads } = await supabase
    .from("ad_formats")
    .select("*")
    .eq("format_type", "banner")
    .order("position", { ascending: true })

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
              Display Banner Ads
            </h1>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Classic display ad format (300×250 & 728×90)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            About Display Banners
          </h3>
          <ul className="space-y-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <li>• A classic display ad format</li>
            <li>• UX-safe</li>
            <li>• Compatible with AdSense</li>
            <li>• Available in two ad sizes: 300×250 and 728×90</li>
          </ul>
        </div>

        <Link href="/admin/ads/banner/add">
          <Button className="w-full mb-6">
            <Plus className="h-5 w-5 mr-2" />
            Add Display Banner Code
          </Button>
        </Link>

        {ads && ads.length > 0 ? (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${ad.is_active ? "text-green-600" : "text-gray-500"}`}>
                    {ad.is_active ? "Active" : "Inactive"}
                  </span>
                  <Link href={`/admin/ads/banner/edit/${ad.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
                <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                  {ad.ad_code.substring(0, 100)}...
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary-light dark:text-text-secondary-dark">
            No banner ads configured yet
          </div>
        )}
      </div>
    </div>
  )
}
