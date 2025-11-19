"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface ImageCropperProps {
  imageUrl: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  cropWidth?: number
  cropHeight?: number
  roundCrop?: boolean
}

export function ImageCropper({
  imageUrl,
  aspectRatio = 1,
  onCropComplete,
  onCancel,
  cropWidth = 400,
  cropHeight = 400,
  roundCrop = false,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayCanvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      const minDimension = Math.min(img.width, img.height)
      const initialScale = cropWidth / minDimension
      setScale(initialScale)
      setPosition({ x: 0, y: 0 })
    }
    img.src = imageUrl
  }, [imageUrl, cropWidth, cropHeight])

  useEffect(() => {
    if (!image || !displayCanvasRef.current) return

    const canvas = displayCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const maxDisplaySize = Math.min(window.innerWidth * 0.9, 500)
    let displayWidth, displayHeight
    
    if (aspectRatio >= 1) {
      displayWidth = maxDisplaySize
      displayHeight = maxDisplaySize / aspectRatio
    } else {
      displayHeight = maxDisplaySize
      displayWidth = maxDisplaySize * aspectRatio
    }

    canvas.width = displayWidth
    canvas.height = displayHeight

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (roundCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
    }

    const imgWidth = image.width * scale
    const imgHeight = image.height * scale
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    ctx.drawImage(image, centerX - imgWidth / 2 + position.x, centerY - imgHeight / 2 + position.y, imgWidth, imgHeight)
    
    if (roundCrop) {
      ctx.restore()
    }
  }, [image, scale, position, aspectRatio, roundCrop])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      setLastTouchDistance(getTouchDistance(e.touches))
      setIsDragging(false)
    } else if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance) {
      e.preventDefault()
      const distance = getTouchDistance(e.touches)
      const delta = distance - lastTouchDistance
      const newScale = Math.max(0.5, Math.min(5, scale + delta * 0.01))
      setScale(newScale)
      setLastTouchDistance(distance)
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault()
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    }
  }

  const handleTouchEnd = () => {
    setLastTouchDistance(null)
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = -e.deltaY * 0.002
    const newScale = Math.max(0.1, Math.min(8, scale + delta))
    setScale(newScale)
  }

  const handleReset = () => {
    if (!image) return
    const minDimension = Math.min(image.width, image.height)
    const initialScale = cropWidth / minDimension
    setScale(initialScale)
    setPosition({ x: 0, y: 0 })
  }

  const handleCrop = () => {
    if (!image || !displayCanvasRef.current) return

    const outputCanvas = document.createElement("canvas")
    outputCanvas.width = cropWidth
    outputCanvas.height = cropHeight
    const ctx = outputCanvas.getContext("2d", { alpha: false })
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, cropWidth, cropHeight)

    const imgWidth = image.width * scale
    const imgHeight = image.height * scale
    const centerX = cropWidth / 2
    const centerY = cropHeight / 2

    ctx.drawImage(image, centerX - imgWidth / 2 + position.x, centerY - imgHeight / 2 + position.y, imgWidth, imgHeight)

    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob)
        }
      },
      "image/jpeg",
      0.95,
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background-light dark:bg-background-dark">
      <div className="flex items-center bg-background-light dark:bg-background-dark px-3 py-2.5 justify-between border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={onCancel}
          className="flex size-8 shrink-0 items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-lg"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-text-primary-light dark:text-text-primary-dark text-sm font-semibold flex-1 text-center">
          {roundCrop ? 'Crop Profile Picture' : 'Crop Image'}
        </h2>
        <button
          onClick={handleReset}
          className="flex size-8 shrink-0 items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-lg"
          aria-label="Reset"
        >
          ↻
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-4 px-3">
        <div className="relative" style={{ aspectRatio: aspectRatio }}>
          <canvas
            ref={displayCanvasRef}
            className={`w-full h-full cursor-move touch-none ${roundCrop ? 'rounded-full' : 'rounded-lg'} shadow-lg`}
            style={{ maxWidth: '400px', maxHeight: '400px' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          />

          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 pointer-events-none">
            <div className={`relative w-full h-full border-2 border-primary ${roundCrop ? 'rounded-full' : 'rounded-lg'}`}>
              <div className="absolute -top-0.5 -left-0.5 size-2 bg-primary rounded-full"></div>
              <div className="absolute -top-0.5 -right-0.5 size-2 bg-primary rounded-full"></div>
              <div className="absolute -bottom-0.5 -left-0.5 size-2 bg-primary rounded-full"></div>
              <div className="absolute -bottom-0.5 -right-0.5 size-2 bg-primary rounded-full"></div>
            </div>
          </div>

          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
              <span>🤏</span>
              <span>Pinch to zoom, drag to move</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-3 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={onCancel}
          className="flex-1 h-10 rounded-md bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCrop}
          className="flex-1 h-10 rounded-md bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
        >
          Apply Crop
        </button>
      </div>
    </div>
  )
}
