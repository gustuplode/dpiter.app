"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

interface Banner {
  id: string
  title: string
  type: "image" | "video" | "ad_code"
  media_url: string
  ad_code?: string
  position: number
}

export function BannerCarouselClient({ banners }: { banners: Banner[] }) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (banners[currentBanner].type === "video" && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => {
        console.log("[v0] Video autoplay failed:", err)
      })
      setIsPlaying(true)
    }
  }, [currentBanner, banners])

  useEffect(() => {
    if (banners[currentBanner].type === "image" || banners[currentBanner].type === "ad_code") {
      timerRef.current = setTimeout(() => {
        setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentBanner, banners])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handleMouseMove = () => {
    if (banners[currentBanner].type === "video") {
      setShowControls(true)
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current)
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
    }
  }

  const handleMouseLeave = () => {
    if (banners[currentBanner].type === "video") {
      setShowControls(false)
    }
  }

  const handleVideoEnd = () => {
    setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const handleBannerInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div
      className="mb-4 relative"
      onClick={handleBannerInteraction}
      onTouchStart={handleBannerInteraction}
      onTouchMove={handleBannerInteraction}
      onTouchEnd={handleBannerInteraction}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full aspect-[16/7] md:aspect-[24/7] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-2xl shadow-lg">
        {banners[currentBanner].type === "image" ? (
          <img
            src={banners[currentBanner].media_url || "/placeholder.svg"}
            alt={banners[currentBanner].title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        ) : banners[currentBanner].type === "video" ? (
          <video
            key={banners[currentBanner].id}
            ref={videoRef}
            src={banners[currentBanner].media_url}
            autoPlay
            muted={isMuted}
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          >
            <source src={banners[currentBanner].media_url} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: banners[currentBanner].ad_code || "" }}
          />
        )}
      </div>

      {banners[currentBanner].type === "video" && (
        <div
          className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all shadow-lg"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all shadow-lg"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
        </div>
      )}

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
