"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Check, X, RotateCw, Upload, AlertCircle } from "lucide-react"
import { upload } from "@vercel/blob/client"

interface AdminMediaCropperProps {
  file: File
  mediaType: "image" | "video"
  onComplete: (url: string) => void
  onCancel: () => void
}

export function AdminMediaCropper({ file, mediaType, onComplete, onCancel }: AdminMediaCropperProps) {
  const [mediaSrc, setMediaSrc] = useState<string>("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => setMediaSrc(reader.result as string)
    reader.readAsDataURL(file)
  }, [file])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDone = async () => {
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      if (mediaType === "video") {
        console.log("[v0] Uploading video to Blob:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB")

        // Simulate progress for video upload
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90))
        }, 500)

        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload-blob",
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        console.log("[v0] Video upload successful:", blob.url)
        onComplete(blob.url)
      } else {
        // Image processing
        setUploadProgress(20)
        const croppedImage = await getCroppedImg(mediaSrc, croppedAreaPixels, rotation)
        console.log("[v0] Image cropped, size:", (croppedImage.size / 1024).toFixed(2), "KB")

        setUploadProgress(50)
        const croppedFile = new File([croppedImage], `banner-${Date.now()}.jpg`, {
          type: "image/jpeg",
        })

        console.log("[v0] Uploading cropped image to Blob")

        const blob = await upload(croppedFile.name, croppedFile, {
          access: "public",
          handleUploadUrl: "/api/upload-blob",
        })

        setUploadProgress(100)
        console.log("[v0] Image upload successful:", blob.url)
        onComplete(blob.url)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.")
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-text-primary-light dark:text-text-primary-dark font-semibold">
          {mediaType === "image" ? "Adjust Image - 16:7 Banner Crop" : "Upload Video"}
        </h2>
        <Button onClick={onCancel} variant="ghost" size="icon" disabled={uploading}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cropper/Video Area */}
      <div
        className="flex-1 relative bg-gray-50 dark:bg-gray-900"
        style={{
          backgroundImage: "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
        }}
      >
        {mediaType === "image" ? (
          <Cropper
            image={mediaSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 7}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            objectFit="contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              ref={videoRef}
              src={mediaSrc}
              controls
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              style={{ maxHeight: "80%" }}
            />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Uploading {mediaType}...</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{uploadProgress}% complete</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls for Image */}
      {mediaType === "image" && (
        <div className="bg-white dark:bg-gray-900 px-4 py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <ZoomOut className="h-5 w-5 text-text-primary-light dark:text-text-primary-dark flex-shrink-0" />
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={0.5}
              max={3}
              step={0.1}
              className="flex-1"
              disabled={uploading}
            />
            <ZoomIn className="h-5 w-5 text-text-primary-light dark:text-text-primary-dark flex-shrink-0" />
            <Button
              onClick={() => {
                setZoom(1)
                setRotation(0)
                setCrop({ x: 0, y: 0 })
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={uploading}
            >
              <RotateCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
            Output: 1920x840 (16:7) | Drag to reposition | Zoom to adjust | High quality export
          </p>
        </div>
      )}

      {/* File Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          File: {file.name} | Size: {(file.size / 1024 / 1024).toFixed(2)} MB | Type: {file.type}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex gap-3 border-t border-gray-200 dark:border-gray-800">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent" disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleDone} disabled={uploading} className="flex-1 bg-primary hover:bg-primary/90">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Uploading...
            </>
          ) : (
            <>
              {mediaType === "image" ? "Crop & Upload" : "Upload Video"}
              <Check className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

async function getCroppedImg(imageSrc: string, pixelCrop: any, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const outputWidth = 1920
  const outputHeight = 840

  canvas.width = outputWidth
  canvas.height = outputHeight

  if (ctx && pixelCrop) {
    // Apply rotation if needed
    ctx.save()
    if (rotation !== 0) {
      ctx.translate(outputWidth / 2, outputHeight / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-outputWidth / 2, -outputHeight / 2)
    }

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight)
    ctx.restore()
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob!)
      },
      "image/jpeg",
      0.95, // High quality
    )
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.crossOrigin = "anonymous"
    image.src = url
  })
}
