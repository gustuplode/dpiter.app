"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { OfflineGame } from "./offline-game"

export function OfflineDetector({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkConnection = () => {
      const online = navigator.onLine
      setIsOnline(online)
      setIsLoading(false)
      console.log("[v0] Connection status:", online ? "online" : "offline")
    }

    checkConnection()

    const handleOnline = () => {
      console.log("[v0] Connection restored, showing website")
      setIsOnline(true)
    }

    const handleOffline = () => {
      console.log("[v0] Connection lost, showing offline game")
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
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900">
        <OfflineGame />
      </div>
    )
  }

  return <>{children}</>
}
