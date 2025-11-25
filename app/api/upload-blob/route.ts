import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            // Images
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "image/avif",
            // Videos
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-msvideo",
            "video/x-matroska",
            // Documents (for future use)
            "application/pdf",
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB max for large videos
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Log successful uploads for debugging
        console.log("[v0] Blob upload completed:", blob.url, "Size:", blob.size)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Blob upload error:", error)
    return NextResponse.json({ error: (error as Error).message || "Upload failed" }, { status: 400 })
  }
}
