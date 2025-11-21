"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"

interface ImageCropperProps {
  imageUrl: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  cropWidth?: number
  cropHeight?: number
}

export function ImageCropper({
  imageUrl,
  aspectRatio = 1,
  onCropComplete,
  onCancel,
  cropWidth = 1080,
  cropHeight = 1080,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 })

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      // Calculate initial zoom to fit image in container
      const scale = Math.max(containerSize.width / img.width, containerSize.height / img.height)
      setZoom(scale)
    }
    img.src = imageUrl
  }, [imageUrl, containerSize])

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 500)
        setContainerSize({ width: size, height: size })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !image) return
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1 || !image) return
    e.preventDefault()
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleApplyCrop = () => {
    if (!image) return

    const canvas = document.createElement("canvas")
    canvas.width = cropWidth
    canvas.height = cropHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cropWidth, cropHeight)

    // Calculate scaling factor from display to output
    const scale = cropWidth / containerSize.width

    // Calculate image dimensions and position in output canvas
    const imgWidth = image.width * zoom * scale
    const imgHeight = image.height * zoom * scale
    const imgX = cropWidth / 2 + position.x * scale - imgWidth / 2
    const imgY = cropHeight / 2 + position.y * scale - imgHeight / 2

    ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
      },
      "image/jpeg",
      0.95,
    )
  }

  const previewStyle = image
    ? {
        width: `${image.width * zoom}px`,
        height: `${image.height * zoom}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }
    : {}

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
        >
          Cancel
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Adjust Image</h2>
        <button onClick={handleApplyCrop} className="text-primary hover:text-primary/80 font-medium">
          Done
        </button>
      </div>

      {/* Crop Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800">
        <div
          ref={containerRef}
          className="relative bg-white dark:bg-gray-900 overflow-hidden shadow-2xl"
          style={{
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
            aspectRatio: "1/1",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center cursor-move">
            {image && (
              <img
                ref={imageRef}
                src={imageUrl || "/placeholder.svg"}
                alt="Crop preview"
                className="absolute pointer-events-none select-none"
                style={previewStyle}
                draggable={false}
              />
            )}
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-2 border-primary/50">
              <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-primary/20" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview label */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">Preview (1080×1080)</div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1 max-w-xs">
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">{Math.round(zoom * 100)}%</div>
        </div>

        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
