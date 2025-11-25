"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* YouTube-style spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#8A3324] border-t-transparent animate-spin"></div>
        </div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    </div>
  )
}
