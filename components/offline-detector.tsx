"use client"

import type React from "react"
import { useState, useEffect } from "react"

export function OfflineDetector({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsReconnecting(true)
      setTimeout(() => {
        setIsOnline(true)
        setIsReconnecting(false)
      }, 800)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isReconnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <span className="material-symbols-outlined text-4xl text-green-600 animate-pulse">wifi</span>
          </div>
          <p className="text-lg font-medium text-green-700 dark:text-green-400">Connection Restored</p>
        </div>
      </div>
    )
  }

  // No more game blocking content
  return <>{children}</>
}
