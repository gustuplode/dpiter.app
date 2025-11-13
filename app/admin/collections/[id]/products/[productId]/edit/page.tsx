import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string; productId: string }> }) {
  const { id, productId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: product } = await supabase.from("products").select("*").eq("id", productId).single()

  if (!product) {
    notFound()
  }

  return <ProductForm collectionId={id} product={product} />
}
