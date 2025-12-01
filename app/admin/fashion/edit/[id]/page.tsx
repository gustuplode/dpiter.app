import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { AdminProductForm } from "@/components/admin/admin-product-form"

export default async function EditFashionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { id } = await params

  const { data: product, error } = await supabase.from("category_products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return <AdminProductForm category={product.category} initialData={product} />
}
