import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function BannersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: banners } = await supabase.from("banners").select("*").order("position", { ascending: true })

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <span className="material-symbols-outlined">arrow_back</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">Banner Management</h1>
          </div>
          <Link href="/admin/banners/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Add Banner
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-4">
        {!banners || banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              No Banners Yet
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Create your first banner to display on the home page
            </p>
            <Link href="/admin/banners/add">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Create Banner
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {banner.type === "image" ? (
                      <img
                        src={banner.media_url || "/placeholder.svg"}
                        alt={banner.title}
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
                        {banner.title}
                      </h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Position: {banner.position} • {banner.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/banners/edit/${banner.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <form action={`/api/admin/banners/${banner.id}`} method="DELETE">
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
