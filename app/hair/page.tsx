import { createClient } from "@/lib/supabase/server"
import { CategoryPageLayout } from "@/components/category-page-layout"

export const metadata = {
  title: "Hair Care Products - Dpiter",
  description: "Discover the best hair care products - shampoos, conditioners, hair oils and styling products",
}

export default async function HairPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "hair")
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .range(0, 7)

  return <CategoryPageLayout title="Hair" products={products || []} error={error} />
}
