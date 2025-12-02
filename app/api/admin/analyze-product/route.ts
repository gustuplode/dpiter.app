import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeProductImage } from "@/lib/ai-product-analyzer"

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["ai_model", "ai_api_key"])

    if (settingsError) {
      throw new Error("Failed to fetch AI settings")
    }

    const settingsMap: Record<string, string> = {}
    settings?.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    const model = settingsMap.ai_model || "gemini-1.5-flash"
    const apiKey = settingsMap.ai_api_key || ""

    if (!apiKey) {
      return NextResponse.json({ error: "No API key configured. Please set it in Admin Settings." }, { status: 400 })
    }

    const result = await analyzeProductImage(imageUrl, model, apiKey)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI could not analyze the image. Please try again." },
      { status: 500 },
    )
  }
}
