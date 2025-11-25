import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { format_type, ad_code, is_active, position } = body

    const { data, error } = await supabase
      .from("ad_formats")
      .insert({
        format_type,
        ad_code,
        is_active,
        position,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating ad format:", error)
    return NextResponse.json({ error: "Failed to create ad format" }, { status: 500 })
  }
}
