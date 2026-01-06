import { createClient } from "@/lib/supabase/server"
import { CategoryPageLayout } from "@/components/category-page-layout"

export const metadata = {
  title: "Skincare Products - Dpiter",
  description: "Shop premium skincare products - moisturizers, serums, face wash and beauty essentials",
}

export default async function SkinPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "skin")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(0, 7)

  return <CategoryPageLayout title="Skin" products={products || []} error={error} />
}
