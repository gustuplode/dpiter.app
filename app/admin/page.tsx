import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ArrowLeft, Network, Search, ChevronDown, Plus, LogOut, BarChart3, Grid3X3, PackagePlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CollectionList } from "@/components/admin/collection-list"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      {/* Top App Bar */}
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-3 md:p-4 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/" className="text-[#333333] dark:text-[#E5E7EB] flex size-8 md:size-10 shrink-0 items-center justify-center">
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
        <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1 justify-center px-2">
          <Network className="h-6 w-6 md:h-8 md:w-8 text-[#4A90E2] shrink-0" />
          <h1 className="text-[#333333] dark:text-[#E5E7EB] text-lg md:text-xl font-bold leading-tight tracking-tight truncate">Dpiter</h1>
        </div>
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Link href="/admin/requests">
            <Button variant="ghost" className="size-8 md:size-10 p-0">
              <PackagePlus className="h-4 w-4 md:h-5 md:w-5 text-[#333333] dark:text-[#E5E7EB]" />
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" className="size-8 md:size-10 p-0">
              <Grid3X3 className="h-4 w-4 md:h-5 md:w-5 text-[#333333] dark:text-[#E5E7EB]" />
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="ghost" className="size-8 md:size-10 p-0">
              <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-[#333333] dark:text-[#E5E7EB]" />
            </Button>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <Button variant="ghost" type="submit" className="size-8 md:size-10 p-0">
              <LogOut className="h-4 w-4 md:h-5 md:w-5 text-[#333333] dark:text-[#E5E7EB]" />
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-3 md:px-4 py-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#333333] dark:text-[#E5E7EB] mb-4 truncate">Collections (Outfits)</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-10 md:h-12 border border-[#E5E7EB] dark:border-[#4a4a50] bg-white dark:bg-[#2a2a2e]">
            <div className="flex items-center justify-center pl-3 md:pl-4 text-[#333333]/70 dark:text-[#E5E7EB]/70">
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#333333] dark:text-[#E5E7EB] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 px-3 md:px-4 text-sm md:text-base font-normal leading-normal placeholder:text-[#333333]/50 dark:placeholder:text-[#E5E7EB]/50"
              placeholder="Search collections..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a2a2e] pl-4 pr-3 border border-[#E5E7EB] dark:border-[#4a4a50] shadow-sm">
            <p className="text-[#333333] dark:text-[#E5E7EB] text-sm font-medium leading-normal">Sort by</p>
            <ChevronDown className="h-4 w-4 text-[#333333]/80 dark:text-[#E5E7EB]/80" />
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a2a2e] pl-4 pr-3 border border-[#E5E7EB] dark:border-[#4a4a50] shadow-sm">
            <p className="text-[#333333] dark:text-[#E5E7EB] text-sm font-medium leading-normal">Status</p>
            <ChevronDown className="h-4 w-4 text-[#333333]/80 dark:text-[#E5E7EB]/80" />
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a2a2e] pl-4 pr-3 border border-[#E5E7EB] dark:border-[#4a4a50] shadow-sm">
            <p className="text-[#333333] dark:text-[#E5E7EB] text-sm font-medium leading-normal">Date created</p>
            <ChevronDown className="h-4 w-4 text-[#333333]/80 dark:text-[#E5E7EB]/80" />
          </button>
        </div>

        {/* Collection List */}
        <CollectionList initialCollections={collections || []} />
      </main>

      {/* Floating Action Button */}
      <Link href="/admin/collections/new" className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-20">
        <Button className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white shadow-lg transition-transform hover:scale-105 p-0">
          <Plus className="h-6 w-6 md:h-8 md:w-8" />
        </Button>
      </Link>
    </div>
  )
}
