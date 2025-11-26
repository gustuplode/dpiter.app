"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SearchHeader } from "@/components/search-header"
import { BottomNav } from "@/components/bottom-nav"
import { SwipeablePageWrapper } from "@/components/swipeable-page-wrapper"
import { PullToRefresh } from "@/components/pull-to-refresh"
import { OfflineDetector } from "@/components/offline-detector"
import { FooterLinks } from "@/components/footer-links"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith("/admin")
  const isProfilePage = pathname === "/profile"
  const isProfileSubpage = pathname?.startsWith("/profile/")

  if (isAdminPage) {
    return <main className="min-h-screen">{children}</main>
  }

  if (isProfilePage || isProfileSubpage) {
    return (
      <>
        <SearchHeader />
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <SearchHeader />
      <PullToRefresh>
        <main className="pb-20 min-h-screen">
          <OfflineDetector>
            <SwipeablePageWrapper>{children}</SwipeablePageWrapper>
          </OfflineDetector>
        </main>
      </PullToRefresh>
      <FooterLinks />
      <BottomNav />
    </>
  )
}
