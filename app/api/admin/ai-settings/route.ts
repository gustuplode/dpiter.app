import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey)
}

export async function GET() {
  try {
    const supabase = getServiceClient()

    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("key, value")
      .in("key", ["ai_model", "ai_api_key"])

    if (error) {
      console.error("GET Error:", error)
      return NextResponse.json({ ai_model: "gemini-1.5-flash", ai_api_key: "" })
    }

    const result: Record<string, string> = {
      ai_model: "gemini-1.5-flash",
      ai_api_key: "",
    }
    settings?.forEach((s) => {
      result[s.key] = s.value
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching AI settings:", error)
    return NextResponse.json({ ai_model: "gemini-1.5-flash", ai_api_key: "" })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServiceClient()
    const body = await req.json()

    const { ai_model, ai_api_key } = body

    const settings = [
      { key: "ai_model", value: ai_model || "gemini-1.5-flash" },
      { key: "ai_api_key", value: ai_api_key || "" },
    ]

    for (const setting of settings) {
      // Check if key exists
      const { data: existing } = await supabase.from("app_settings").select("id").eq("key", setting.key).maybeSingle()

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from("app_settings")
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq("key", setting.key)

        if (updateError) {
          console.error("Update error:", updateError)
          throw updateError
        }
      } else {
        // Insert new with explicit ID
        const { error: insertError } = await supabase.from("app_settings").insert({
          key: setting.key,
          value: setting.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          console.error("Insert error:", insertError)
          throw insertError
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving AI settings:", error)
    return NextResponse.json({ error: "Failed to save AI settings" }, { status: 500 })
  }
}
