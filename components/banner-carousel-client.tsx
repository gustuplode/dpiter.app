"use client"

import { useState } from "react"

interface Banner {
  id: string
  title: string
  type: "image" | "video"
  media_url: string
  position: number
}

export function BannerCarouselClient({ banners }: { banners: Banner[] }) {
  const [currentBanner, setCurrentBanner] = useState(0)

  return (
    <div className="mb-4 relative">
      <div className="w-full aspect-[16/7] md:aspect-[24/7] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {banners[currentBanner].type === "image" ? (
          <img
            src={banners[currentBanner].media_url || "/placeholder.svg"}
            alt={banners[currentBanner].title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : (
          <video
            src={banners[currentBanner].media_url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-4">
        <button
          onClick={() => setCurrentBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
            chevron_left
          </span>
        </button>
        <div className="flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentBanner ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  )
}
