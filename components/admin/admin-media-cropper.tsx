"use client"

import { useState, useCallback, useEffect } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, Check, X, RotateCw } from "lucide-react"

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
  const [videoCrop, setVideoCrop] = useState({ x: 0, y: 0 })
  const [videoZoom, setVideoZoom] = useState(1)
  const [videoCroppedArea, setVideoCroppedArea] = useState(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => setMediaSrc(reader.result as string)
    reader.readAsDataURL(file)
  }, [file])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onVideoCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setVideoCroppedArea(croppedAreaPixels)
  }, [])

  const handleDone = async () => {
    setUploading(true)
    try {
      let finalBlob: Blob

      if (mediaType === "image") {
        const croppedImage = await getCroppedImg(mediaSrc, croppedAreaPixels)
        finalBlob = croppedImage
      } else {
        const croppedVideo = await getCroppedVideo(mediaSrc, videoCroppedArea)
        finalBlob = croppedVideo
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
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col">
      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-text-primary-light dark:text-text-primary-dark font-semibold">
          Adjust {mediaType === "image" ? "Image" : "Video"}
        </h2>
        <Button onClick={onCancel} variant="ghost" size="icon">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div
        className="flex-1 relative bg-gray-50 dark:bg-gray-900"
        style={{
          backgroundImage: "repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%)",
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
          <Cropper
            video={mediaSrc}
            crop={videoCrop}
            zoom={videoZoom}
            aspect={16 / 7}
            onCropChange={setVideoCrop}
            onZoomChange={setVideoZoom}
            onCropComplete={onVideoCropComplete}
            objectFit="contain"
          />
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 px-4 py-4 space-y-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <ZoomOut className="h-5 w-5 text-text-primary-light dark:text-text-primary-dark flex-shrink-0" />
          <Slider
            value={mediaType === "image" ? [zoom] : [videoZoom]}
            onValueChange={([value]) => (mediaType === "image" ? setZoom(value) : setVideoZoom(value))}
            min={0.5}
            max={3}
            step={0.1}
            className="flex-1"
          />
          <ZoomIn className="h-5 w-5 text-text-primary-light dark:text-text-primary-dark flex-shrink-0" />
          <Button
            onClick={() => (mediaType === "image" ? setZoom(1) : setVideoZoom(1))}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {mediaType === "video" && (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => setVideoCrop((p) => ({ ...p, y: p.y - 10 }))} variant="outline" size="sm">
              Move Up
            </Button>
            <Button onClick={() => setVideoCrop((p) => ({ ...p, y: p.y + 10 }))} variant="outline" size="sm">
              Move Down
            </Button>
            <Button onClick={() => setVideoCrop((p) => ({ ...p, x: p.x - 10 }))} variant="outline" size="sm">
              Move Left
            </Button>
            <Button onClick={() => setVideoCrop((p) => ({ ...p, x: p.x + 10 }))} variant="outline" size="sm">
              Move Right
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 px-4 py-3 flex gap-3 border-t border-gray-200 dark:border-gray-800">
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

async function getCroppedVideo(videoSrc: string, pixelCrop: any): Promise<Blob> {
  const video = await createVideo(videoSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const outputWidth = 1920
  const outputHeight = 840

  canvas.width = outputWidth
  canvas.height = outputHeight

  if (ctx && pixelCrop) {
    ctx.drawImage(video, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight)
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

function createVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.addEventListener("loadeddata", () => resolve(video))
    video.addEventListener("error", (error) => reject(error))
    video.src = url
  })
}
