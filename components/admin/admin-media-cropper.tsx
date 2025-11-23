"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Check, X, RotateCw } from "lucide-react"
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [uploading, setUploading] = useState(false)
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
    try {
      if (mediaType === "video") {
        console.log("[v0] Uploading video directly to Blob:", file.name, "Size:", file.size)

        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload-blob",
        })

        console.log("[v0] Video upload successful:", blob.url)
        onComplete(blob.url)
      } else {
        const croppedImage = await getCroppedImg(mediaSrc, croppedAreaPixels)
        console.log("[v0] Image cropped successfully, size:", croppedImage.size)

        const croppedFile = new File([croppedImage], file.name, {
          type: "image/jpeg",
        })

        console.log("[v0] Uploading cropped image to Blob:", file.name)

        const blob = await upload(file.name, croppedFile, {
          access: "public",
          handleUploadUrl: "/api/upload-blob",
        })

        console.log("[v0] Image upload successful:", blob.url)
        onComplete(blob.url)
      }
    } catch (error) {
      console.error("[v0] Error uploading:", error)
      alert(`Failed to upload ${mediaType}: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-text-primary-light dark:text-text-primary-dark font-semibold">
          {mediaType === "image" ? "Adjust Image - 16:7 Crop" : "Upload Video"}
        </h2>
        <Button onClick={onCancel} variant="ghost" size="icon">
          <X className="h-5 w-5" />
        </Button>
      </div>

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
            aspect={16 / 7}
            onCropChange={setCrop}
            onZoomChange={setZoom}
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
      </div>

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
            />
            <ZoomIn className="h-5 w-5 text-text-primary-light dark:text-text-primary-dark flex-shrink-0" />
            <Button onClick={() => setZoom(1)} variant="outline" size="sm" className="flex items-center gap-1">
              <RotateCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark">
            Output: 1920×840 (16:7 aspect ratio) • Drag to reposition • Use slider to zoom
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex gap-3 border-t border-gray-200 dark:border-gray-800">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleDone} disabled={uploading} className="flex-1 bg-primary hover:bg-primary/90">
          {uploading ? "Uploading..." : mediaType === "image" ? "Crop & Upload" : "Upload Video"}
          <Check className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const outputWidth = 1920
  const outputHeight = 840

  canvas.width = outputWidth
  canvas.height = outputHeight

  if (ctx && pixelCrop) {
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight)
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob!)
      },
      "image/jpeg",
      0.95,
    )
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = url
  })
}
