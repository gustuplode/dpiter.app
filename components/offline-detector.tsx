"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { OfflineGame } from "./offline-game"

export function OfflineDetector({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    const checkOnline = () => {
      const online = navigator.onLine
      setIsOnline(online)
      if (!online) {
        setShowGame(true)
      }
    }

    checkOnline()

    const handleOnline = () => {
      console.log("[v0] Internet connected")
      setIsOnline(true)
      // Hide game after a short delay to show smooth transition
      setTimeout(() => setShowGame(false), 500)
    }

    const handleOffline = () => {
      console.log("[v0] Internet disconnected")
      setIsOnline(false)
      setShowGame(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (showGame && !isOnline) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-950">
        <OfflineGame />
      </div>
    )
  }

  return <>{children}</>
}
