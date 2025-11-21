"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const router = useRouter()
  const maxPullDistance = 80

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        const currentY = e.touches[0].clientY
        const distance = currentY - touchStartY.current

        if (distance > 0) {
          setPullDistance(Math.min(distance, maxPullDistance))
        }
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance >= maxPullDistance && !isRefreshing) {
        setIsRefreshing(true)
        router.refresh()
        setTimeout(() => {
          setIsRefreshing(false)
          setPullDistance(0)
        }, 1000)
      } else {
        setPullDistance(0)
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, isRefreshing, router])

  return (
    <>
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance / maxPullDistance,
        }}
      >
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <span className="material-symbols-outlined text-primary">
            {isRefreshing ? "progress_activity" : "refresh"}
          </span>
        </div>
      </div>
      {children}
    </>
  )
}
