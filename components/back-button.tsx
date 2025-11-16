"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"

export function BackButton() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.back()
      setTimeout(() => setIsAnimating(false), 300)
    }, 500)
  }

  return (
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 z-50 h-12 w-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="Go back"
    >
      {isAnimating ? (
        <div className="relative h-10 w-10 animate-spin">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png"
            alt="Dpiter"
            className="h-full w-full object-contain rounded-full"
          />
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6 text-[#3B82F6]"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      )}
    </button>
  )
}
