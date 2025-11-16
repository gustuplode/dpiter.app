"use client"

import { useState } from "react"

interface ImageLoaderProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: string
}

export function ImageLoader({ src, alt, className = "", aspectRatio = "3/4" }: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <span className="material-symbols-outlined text-slate-400 text-4xl">broken_image</span>
        </div>
      ) : (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
          loading="lazy"
        />
      )}
    </div>
  )
}
