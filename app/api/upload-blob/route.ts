import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Allow uploads without auth check for admin panel
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB max for videos
        }
      },
      onUploadCompleted: async () => {
        // Optional: you can process the uploaded file here
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Blob upload error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
