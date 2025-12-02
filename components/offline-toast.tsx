"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi, X } from "lucide-react"

export function OfflineToast() {
  const [isOffline, setIsOffline] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isCachedView, setIsCachedView] = useState(false)
  const [justCameOnline, setJustCameOnline] = useState(false)

  useEffect(() => {
    setIsOffline(!navigator.onLine)

    const handleOffline = () => {
      setIsOffline(true)
      setShowToast(true)
      setJustCameOnline(false)
    }

    const handleOnline = () => {
      setIsOffline(false)
      setJustCameOnline(true)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        setJustCameOnline(false)
      }, 3000)
    }

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

  const bgColor = justCameOnline ? "bg-green-600" : "bg-gray-900"
  const iconBg = justCameOnline ? "bg-green-500/30" : "bg-orange-500/20"
  const iconColor = justCameOnline ? "text-white" : "text-orange-400"

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${bgColor} text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 max-w-md mx-auto`}>
        <div className={`flex-shrink-0 w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
          {justCameOnline ? (
            <Wifi className={`w-4 h-4 ${iconColor}`} />
          ) : (
            <WifiOff className={`w-4 h-4 ${iconColor}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {justCameOnline
              ? "Back online"
              : isCachedView
                ? "You are offline — viewing cached version"
                : "No internet connection"}
          </p>
          <p className="text-xs text-gray-300 mt-0.5">
            {justCameOnline ? "Connection restored" : "Some features may be unavailable"}
          </p>
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
