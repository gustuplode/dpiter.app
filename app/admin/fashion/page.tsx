import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminProductList } from "@/components/admin/admin-product-list"

export default async function FashionAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: products } = await supabase
    .from("category_products")
    .select("*")
    .order("pin_position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  return <AdminProductList category="fashion" initialProducts={products || []} />
}
