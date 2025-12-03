import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { id } = await params

  const updateData: Record<string, any> = {}

  if (body.brand !== undefined) updateData.brand = body.brand
  if (body.title !== undefined) updateData.title = body.title
  if (body.price !== undefined) updateData.price = body.price
  if (body.image_url !== undefined) updateData.image_url = body.image_url
  if (body.affiliate_link !== undefined) updateData.affiliate_link = body.affiliate_link
  if (body.is_visible !== undefined) updateData.is_visible = body.is_visible
  if (body.category !== undefined) updateData.category = body.category
  if (body.pin_position !== undefined) updateData.pin_position = body.pin_position
  if (body.description !== undefined) updateData.description = body.description
  if (body.keywords !== undefined) updateData.keywords = body.keywords
  if (body.image_aspect_ratio !== undefined) updateData.image_aspect_ratio = body.image_aspect_ratio
  if (body.image_width !== undefined) updateData.image_width = body.image_width
  if (body.image_height !== undefined) updateData.image_height = body.image_height

  const { error, data } = await supabase.from("category_products").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Product update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase.from("category_products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Product delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { id } = await params

  const { data, error } = await supabase.from("category_products").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
