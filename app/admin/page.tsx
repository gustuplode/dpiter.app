import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Search, ChevronDown, Plus, LogOut, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CollectionList } from "@/components/admin/collection-list"
import { AdminCategorySelector } from "@/components/admin/admin-category-selector"

export default async function AdminDashboard() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Admin auth check failed:", authError?.message)
      redirect("/admin/login")
    }

    const { data: collections, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false })

    return (
      <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
        <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white shadow-md">
              <span className="font-display font-bold text-xl">D</span>
            </div>
            <h1 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold font-display">
              Dpiter Admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/analytics">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" size="icon" type="submit" className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-4">
          <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Collections (Outfits)
          </h2>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-12 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-center pl-4 text-text-secondary-light dark:text-text-secondary-dark">
                <Search className="h-5 w-5" />
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-text-primary-light dark:text-text-primary-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 px-4 text-base font-normal leading-normal placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark"
                placeholder="Search collections..."
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-4">
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 pl-4 pr-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal">
                Sort by
              </p>
              <ChevronDown className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 pl-4 pr-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal">
                Status
              </p>
              <ChevronDown className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 pl-4 pr-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-text-primary-light dark:text-text-primary-dark text-sm font-medium leading-normal">
                Date created
              </p>
              <ChevronDown className="h-4 w-4 text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
          </div>

          {/* Collection List */}
          <CollectionList initialCollections={collections || []} />
        </main>

        <AdminCategorySelector />

        {/* Floating Action Button */}
        <Link href="/admin/collections/new" className="fixed bottom-6 right-6 z-20">
          <Button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:scale-105 p-0">
            <Plus className="h-8 w-8" />
          </Button>
        </Link>
      </div>
    )
  } catch (error) {
    console.error("[v0] Admin dashboard error:", error)
    redirect("/admin/login")
  }
}
