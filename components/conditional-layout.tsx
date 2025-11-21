"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"
import { SwipeablePageWrapper } from "@/components/swipeable-page-wrapper"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { OfflineDetector } from "@/components/offline-detector"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")

  if (isAdminPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <>
      <SearchHeader />
      <PullToRefresh>
        <main className="pb-16 min-h-screen">
          <OfflineDetector>
            <SwipeablePageWrapper>{children}</SwipeablePageWrapper>
          </OfflineDetector>
        </main>
      </PullToRefresh>
      <BottomNav />
    </>
  )
}
