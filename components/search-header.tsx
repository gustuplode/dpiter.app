"use client"

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchHeader() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="container mx-auto max-w-7xl px-3 py-2">
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-700 px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="h-5 w-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
