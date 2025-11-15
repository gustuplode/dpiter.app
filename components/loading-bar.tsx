"use client"

import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'

export function LoadingBar() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(30)

    const timer1 = setTimeout(() => setProgress(60), 50)
    const timer2 = setTimeout(() => setProgress(90), 150)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setLoading(false), 100)
    }, 250)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#F97316] transition-all duration-200 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {progress < 100 && (
        <div className="fixed inset-0 bg-white/5 backdrop-blur-[0.5px] z-[9998] pointer-events-none" />
      )}
    </>
  )
}
