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

  const { products } = await request.json()

  if (!Array.isArray(products)) {
    return NextResponse.json({ error: "Invalid products array" }, { status: 400 })
  }

  // Update each product's pin_position
  for (const product of products) {
    const { error } = await supabase
      .from("category_products")
      .update({ pin_position: product.pin_position })
      .eq("id", product.id)

    if (error) {
      console.error("[v0] Failed to update pin_position:", error)
    }
  }

  return NextResponse.json({ success: true })
}
