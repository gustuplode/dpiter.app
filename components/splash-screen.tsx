"use client"

import { useEffect, useState } from "react"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    
    if (hasSeenSplash) {
      setIsVisible(false)
      return
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('hasSeenSplash', 'true')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex items-center justify-center animate-fadeOut">
      <div className="flex flex-col items-center gap-6">
        <img
          src="https://complicated-coral-dt9pgpdgdp.edgeone.app/1000007078-01_imgupscaler.ai_V1(Fast)_2K%20(2).jpg"
          alt="Dpiter"
          className="w-32 h-32 object-contain animate-pulse"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F97316] to-[#FB923C] bg-clip-text text-transparent">
          DPITER
        </h1>
      </div>
    </div>
  )
}
