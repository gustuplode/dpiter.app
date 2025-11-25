import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "0")
  const limit = 6

  const supabase = await createClient()

  const from = page * limit
  const to = from + limit - 1

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    products: products || [],
    hasMore: products && products.length === limit,
  })
}
