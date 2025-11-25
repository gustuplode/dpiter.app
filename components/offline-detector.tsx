"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { OfflineGame } from "./offline-game"

export function OfflineDetector({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    setInitialLoad(false)

    const handleOnline = () => {
      setIsOnline(true)
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

  if (!isOnline) {
    return <OfflineGame />
  }

  // Prevent flash on initial load
  if (initialLoad) {
    return null
  }

  return <>{children}</>
}
