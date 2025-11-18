"use client"

import Link from "next/link"
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { useState } from "react"
import { LogoModal } from "./logo-modal"
import { UserAvatar } from "./user-avatar"
import { SearchHeader } from "./search-header"

interface AppHeaderProps {
  showBackButton?: boolean
  backHref?: string
}

export function AppHeader({ showBackButton = false, backHref = "/" }: AppHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-[#f8f6f5]/80 p-4 pb-3 backdrop-blur-sm dark:bg-[#23150f]/80 border-b border-gray-200/50 dark:border-gray-800/50">
        {showBackButton ? (
          <Link
            href={backHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
        ) : (
          <div className="size-10 shrink-0" />
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tighter text-[#23150f] dark:text-[#f8f6f5]">Dpiter</h1>
        </button>

        <UserAvatar />
      </header>

      <SearchHeader />

      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
