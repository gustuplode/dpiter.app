"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { ZoomIn, ZoomOut, RotateCcw, ChevronDown } from "lucide-react"

const ASPECT_RATIOS = [
  { label: "1:1 Square", value: 1, width: 1080, height: 1080 },
  { label: "4:5 Portrait", value: 4 / 5, width: 1080, height: 1350 },
  { label: "3:4 Portrait", value: 3 / 4, width: 1080, height: 1440 },
  { label: "2:3 Portrait", value: 2 / 3, width: 1080, height: 1620 },
  { label: "16:9 Wide", value: 16 / 9, width: 1920, height: 1080 },
  { label: "9:16 Story", value: 9 / 16, width: 1080, height: 1920 },
  { label: "4:3 Standard", value: 4 / 3, width: 1440, height: 1080 },
  { label: "Custom", value: "custom", width: 1080, height: 1080 },
]

interface ImageCropperProps {
  imageUrl: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob, aspectRatio: string, width: number, height: number) => void
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

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, outputWidth, outputHeight)

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
  aspectRatio: initialAspectRatio = 1,
  onCropComplete,
  onCancel,
  cropWidth: initialWidth = 1080,
  cropHeight: initialHeight = 1080,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const [showAspectDropdown, setShowAspectDropdown] = useState(false)
  const [selectedAspect, setSelectedAspect] = useState(ASPECT_RATIOS[0])
  const [customWidth, setCustomWidth] = useState(1080)
  const [customHeight, setCustomHeight] = useState(1080)

  const currentAspectRatio =
    selectedAspect.value === "custom" ? customWidth / customHeight : (selectedAspect.value as number)

  const currentWidth = selectedAspect.value === "custom" ? customWidth : selectedAspect.width
  const currentHeight = selectedAspect.value === "custom" ? customHeight : selectedAspect.height

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
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels, currentWidth, currentHeight)
      onCropComplete(croppedImage, selectedAspect.label, currentWidth, currentHeight)
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

  const handleAspectSelect = (aspect: (typeof ASPECT_RATIOS)[0]) => {
    setSelectedAspect(aspect)
    setShowAspectDropdown(false)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-transparent">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Crop Image</h2>
        <button
          onClick={handleApplyCrop}
          className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-sm active:scale-95"
        >
          Done
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aspect Ratio:</span>
          <div className="relative flex-1">
            <button
              onClick={() => setShowAspectDropdown(!showAspectDropdown)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-between text-sm font-medium"
            >
              <span>{selectedAspect.label}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAspectDropdown ? "rotate-180" : ""}`} />
            </button>

            {showAspectDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                {ASPECT_RATIOS.map((aspect) => (
                  <button
                    key={aspect.label}
                    onClick={() => handleAspectSelect(aspect)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                      selectedAspect.label === aspect.label
                        ? "bg-primary/10 text-primary"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    <span className="font-medium">{aspect.label}</span>
                    <span className="text-xs text-gray-500">
                      {aspect.value === "custom" ? "Custom size" : `${aspect.width}×${aspect.height}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedAspect.value === "custom" && (
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(100, Number.parseInt(e.target.value) || 100))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                min="100"
                max="4000"
              />
            </div>
            <span className="text-gray-400 mt-5">×</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(100, Number.parseInt(e.target.value) || 100))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                min="100"
                max="4000"
              />
            </div>
          </div>
        )}
      </div>

      {/* Crop Area */}
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
            aspect={currentAspectRatio}
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
                border: "2px solid rgba(136, 50, 35, 0.8)",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              },
            }}
          />
        </div>

        {/* Info badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/95 dark:bg-gray-900/95 rounded-full shadow-lg backdrop-blur-sm">
          <span className="text-xs font-semibold text-gray-900 dark:text-white">
            {selectedAspect.label} • {currentWidth}×{currentHeight}px • Zoom: {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1 max-w-xs">
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
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
