import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, type, media_url, ad_code, position, is_active } = body

  const { data, error } = await supabase
    .from("banners")
    .insert({
      title,
      type,
      media_url,
      ad_code: ad_code || null,
      position,
      is_active,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Banner insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("banners").select("*").order("position", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
