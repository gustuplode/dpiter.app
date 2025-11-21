"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface Banner {
  id: string
  title: string
  type: "image" | "video"
  media_url: string
  position: number
}

export function BannerCarouselClient({ banners }: { banners: Banner[] }) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (banners[currentBanner].type === "image") {
      timerRef.current = setTimeout(() => {
        setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentBanner, banners])

  const handleVideoEnd = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const handleBannerInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className="mb-4 relative"
      onClick={handleBannerInteraction}
      onTouchStart={handleBannerInteraction}
      onTouchMove={handleBannerInteraction}
      onTouchEnd={handleBannerInteraction}
    >
      <div className="w-full aspect-[16/7] md:aspect-[24/7] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-2xl shadow-lg">
        {banners[currentBanner].type === "image" ? (
          <img
            src={banners[currentBanner].media_url || "/placeholder.svg"}
            alt={banners[currentBanner].title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <video
            ref={videoRef}
            src={banners[currentBanner].media_url}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
          }}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
            chevron_left
          </span>
        </button>
        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentBanner(index)
              }}
              className={`h-2.5 rounded-full transition-all shadow-sm ${
                index === currentBanner ? "w-8 bg-white" : "w-2.5 bg-white/60"
              }`}
            />
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
          }}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  )
}
