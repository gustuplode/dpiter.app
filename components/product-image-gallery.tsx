"use client"

import type React from "react"

import { useState } from "react"

interface ProductImageGalleryProps {
  images: string[]
  title: string
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 w-16">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
              selectedImage === idx
                ? "border-primary shadow-md"
                : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
            }`}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`${title} view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="flex-1 relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-contain transition-transform"
          style={
            isZoomed
              ? {
                  transform: "scale(2)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Wishlist & Share buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">share</span>
          </button>
        </div>

        {/* Zoom hint */}
        {!isZoomed && (
          <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded">
            Hover to zoom
          </div>
        )}
      </div>
    </div>
  )
}
