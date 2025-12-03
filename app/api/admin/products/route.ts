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

  const timestamp = Date.now()
  const baseSlug = body.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const uniqueSlug = `${baseSlug}-${timestamp}`

  const { error, data } = await supabase
    .from("category_products")
    .insert({
      brand: body.brand,
      title: body.title,
      price: body.price,
      image_url: body.image_url,
      affiliate_link: body.affiliate_link,
      category: body.category,
      is_visible: body.is_visible,
      slug: uniqueSlug,
      description: body.description || null,
      keywords: body.keywords || null,
      image_aspect_ratio: body.image_aspect_ratio || "1:1 Square",
      image_width: body.image_width || 1080,
      image_height: body.image_height || 1080,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Product insert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let query = supabase.from("category_products").select("*").order("created_at", { ascending: false })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
