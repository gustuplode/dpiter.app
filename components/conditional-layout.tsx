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
  const isProfilePage = pathname === "/profile"
  const isCartPage = pathname === "/cart"
  const isWishlistPage = pathname === "/wishlist"
  const isSearchPage = pathname === "/search"
  const isOffersPage = pathname === "/offers"

  // Hide full layout for admin and self-managed pages
  const hideFullLayout = isAdminPage || isProfilePage

  if (hideFullLayout) {
    return <main className="min-h-screen">{children}</main>
  }

  const showBottomNav = !isCartPage && !isWishlistPage && !isSearchPage && !isOffersPage

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
      {showBottomNav && <BottomNav />}
    </>
  )
}
