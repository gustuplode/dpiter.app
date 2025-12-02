import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeProductImage, type AIProvider } from "@/lib/ai-product-analyzer"

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Get AI settings from database
    const supabase = await createClient()
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["ai_provider", "gemini_api_key", "openai_api_key", "deepseek_api_key", "openrouter_api_key"])

    if (settingsError) {
      throw new Error("Failed to fetch AI settings")
    }

    const settingsMap: Record<string, string> = {}
    settings?.forEach((s) => {
      settingsMap[s.key] = s.value
    })

    const provider = (settingsMap.ai_provider || "gemini") as AIProvider
    const apiKeyMap: Record<AIProvider, string> = {
      gemini: settingsMap.gemini_api_key || "",
      openai: settingsMap.openai_api_key || "",
      deepseek: settingsMap.deepseek_api_key || "",
      openrouter: settingsMap.openrouter_api_key || "",
    }

    const apiKey = apiKeyMap[provider]

    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured for ${provider}. Please set it in Admin Settings.` },
        { status: 400 },
      )
    }

    const result = await analyzeProductImage({
      imageUrl,
      apiProvider: provider,
      apiKey,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI could not analyze the image. Please try again." },
      { status: 500 },
    )
  }
}
