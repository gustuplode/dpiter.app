import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { CategoryProductForm } from "@/components/admin/category-product-form"

export default async function EditCategoryProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: product } = await supabase
    .from("category_products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link
          href="/admin/categories"
          className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-xl font-bold">
          Edit Product
        </h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-6">
        <CategoryProductForm product={product} category={product.category} />
      </main>
    </div>
  )
}
