"use client"

import { useState, useEffect } from "react"
import { WifiOff, X } from "lucide-react"

export function OfflineToast() {
  const [isOffline, setIsOffline] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isCachedView, setIsCachedView] = useState(false)

  useEffect(() => {
    // Check initial state
    setIsOffline(!navigator.onLine)

    // Listen for online/offline events
    const handleOffline = () => {
      setIsOffline(true)
      setShowToast(true)
    }

    const handleOnline = () => {
      setIsOffline(false)
      setShowToast(false)
      setIsCachedView(false)
    }

    // Listen for service worker messages
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === "OFFLINE_MODE") {
        setIsCachedView(true)
        setShowToast(true)
      }
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleSWMessage)
    }

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleSWMessage)
      }
    }
  }, [])

  if (!showToast) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 max-w-md mx-auto">
        <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
          <WifiOff className="w-4 h-4 text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {isCachedView ? "You are offline — viewing cached version" : "No internet connection"}
          </p>
          {!isCachedView && <p className="text-xs text-gray-400 mt-0.5">Some features may be unavailable</p>}
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
