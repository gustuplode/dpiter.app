import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductList } from "@/components/admin/product-list"
import { notFound } from "next/navigation"

export default async function CollectionProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: collection } = await supabase.from("collections").select("*").eq("id", id).single()

  if (!collection) {
    notFound()
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      {/* Header */}
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link
          href="/admin"
          className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-lg font-bold leading-tight flex-1 text-center">
          {collection.title}
        </h1>
        <div className="size-10 shrink-0" />
      </header>

      <main className="flex-1 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#333333] dark:text-[#E5E7EB]">Products</h2>
          <Link href={`/admin/collections/${id}/products/new`}>
            <Button className="bg-[#4A90E2] hover:bg-[#4A90E2]/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <ProductList collectionId={id} initialProducts={products || []} />
      </main>
    </div>
  )
}
