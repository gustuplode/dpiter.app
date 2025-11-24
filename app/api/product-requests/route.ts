import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Also check for Firebase UID in body for Firebase users
    const body = await request.json()
    const { image_url, description, user_id } = body

    const userId = user?.id || user_id

    if (!userId) {
      console.error("[v0] No user ID found")
      return NextResponse.json({ error: "Unauthorized - Please sign in first" }, { status: 401 })
    }

    if (!image_url) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    console.log("[v0] Creating product request for user:", userId)

    // Insert product request
    const { data, error } = await supabase
      .from("product_requests")
      .insert({
        user_id: userId,
        image_url,
        description: description || "",
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Product request insert error:", error)
      return NextResponse.json({ error: "Failed to create product request: " + error.message }, { status: 500 })
    }

    console.log("[v0] Product request created successfully:", data)

    return NextResponse.json({
      success: true,
      request: data,
    })
  } catch (error) {
    console.error("[v0] Product request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's product requests
    const { data, error } = await supabase
      .from("product_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Product request fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch product requests" }, { status: 500 })
    }

    return NextResponse.json({ requests: data })
  } catch (error) {
    console.error("[v0] Product request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
