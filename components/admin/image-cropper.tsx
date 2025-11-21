"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface ImageCropperProps {
  imageUrl: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob) => void
  onCancel: () => void
  cropWidth?: number
  cropHeight?: number
}

interface Point {
  x: number
  y: number
}

interface Area {
  x: number
  y: number
  width: number
  height: number
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth = 1080,
  outputHeight = 1080,
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  canvas.width = outputWidth
  canvas.height = outputHeight

  // Fill with white background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, outputWidth, outputHeight)

  // Draw the cropped image
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas is empty"))
        }
      },
      "image/jpeg",
      0.95,
    )
  })
}

export function ImageCropper({
  imageUrl,
  aspectRatio = 1,
  onCropComplete,
  onCancel,
  cropWidth = 1080,
  cropHeight = 1080,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (location: Point) => {
    setCrop(location)
  }

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  const onCropAreaChange = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, cropWidth, cropHeight)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1))
  }

  const handleReset = () => {
    setZoom(1)
    setCrop({ x: 0, y: 0 })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Adjust & Crop Image</h2>
        <button
          onClick={handleApplyCrop}
          className="px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        >
          Done
        </button>
      </div>

      {/* Crop Area with checkerboard background */}
      <div className="flex-1 relative bg-gray-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "repeating-conic-gradient(#2d2d2d 0% 25%, #1a1a1a 0% 50%)",
            backgroundPosition: "0 0, 12px 12px",
            backgroundSize: "24px 24px",
          }}
        >
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
            objectFit="contain"
            showGrid={true}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
              },
              cropAreaStyle: {
                border: "2px solid rgba(59, 130, 246, 0.7)",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              },
            }}
          />
        </div>

        {/* Info badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg backdrop-blur-sm">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Output: {cropWidth}×{cropHeight} • Zoom: {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1 max-w-md">
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
