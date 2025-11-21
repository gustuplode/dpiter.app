"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Check, X } from "lucide-react"

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

  useState(() => {
    const reader = new FileReader()
    reader.onload = () => setMediaSrc(reader.result as string)
    reader.readAsDataURL(file)
  })

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDone = async () => {
    setUploading(true)
    try {
      let finalBlob: Blob

      if (mediaType === "image") {
        const croppedImage = await getCroppedImg(mediaSrc, croppedAreaPixels)
        finalBlob = croppedImage
      } else {
        finalBlob = file
      }

      const formData = new FormData()
      formData.append("file", finalBlob)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        onComplete(data.url)
      }
    } catch (error) {
      console.error("Error uploading:", error)
      alert("Failed to upload media")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
        <h2 className="text-white font-semibold">Adjust {mediaType === "image" ? "Image" : "Video"}</h2>
        <Button onClick={onCancel} variant="ghost" size="icon" className="text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 relative bg-black">
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
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={mediaSrc}
              controls
              className="max-w-full max-h-full object-contain"
              style={{ aspectRatio: "16/7" }}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-900 px-4 py-4 space-y-4">
        <div className="flex items-center gap-4">
          <ZoomOut className="h-5 w-5 text-white flex-shrink-0" />
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={1}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="h-5 w-5 text-white flex-shrink-0" />
        </div>
      </div>

      <div className="bg-gray-900 px-4 py-3 flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleDone} disabled={uploading} className="flex-1 bg-primary hover:bg-primary/90">
          {uploading ? "Uploading..." : "Done"}
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
