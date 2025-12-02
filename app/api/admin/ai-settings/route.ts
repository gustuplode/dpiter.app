import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["ai_provider", "gemini_api_key", "openai_api_key", "deepseek_api_key", "openrouter_api_key"])

    if (error) throw error

    const result: Record<string, string> = {}
    settings?.forEach((s) => {
      result[s.key] = s.value
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching AI settings:", error)
    return NextResponse.json({ error: "Failed to fetch AI settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const body = await req.json()

    const { ai_provider, gemini_api_key, openai_api_key, deepseek_api_key, openrouter_api_key } = body

    const settings = [
      { key: "ai_provider", value: ai_provider || "gemini" },
      { key: "gemini_api_key", value: gemini_api_key || "" },
      { key: "openai_api_key", value: openai_api_key || "" },
      { key: "deepseek_api_key", value: deepseek_api_key || "" },
      { key: "openrouter_api_key", value: openrouter_api_key || "" },
    ]

    for (const setting of settings) {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving AI settings:", error)
    return NextResponse.json({ error: "Failed to save AI settings" }, { status: 500 })
  }
}
