import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryProductCard } from "@/components/admin/category-product-card"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: fashionProducts, error: fashionError } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "fashion")
    .order("created_at", { ascending: false })

  const { data: gadgetsProducts, error: gadgetsError } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "gadgets")
    .order("created_at", { ascending: false })

  const { data: gamingProducts, error: gamingError } = await supabase
    .from("category_products")
    .select("*")
    .eq("category", "gaming")
    .order("created_at", { ascending: false })

  // Check if table doesn't exist
  const tableNotExists = fashionError?.code === '42P01' || gadgetsError?.code === '42P01' || gamingError?.code === '42P01'

  if (tableNotExists) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
        <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
          <Link href="/admin" className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-[#333333] dark:text-[#E5E7EB] text-xl font-bold">Category Products</h1>
          <div className="w-10" />
        </header>
        <main className="flex-1 px-4 py-8">
          <div className="max-w-2xl mx-auto bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2">Database Setup Required</h2>
            <p className="text-sm mb-4">The category_products table needs to be created. Please run the SQL script:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
              <li>Go to the Scripts section in v0</li>
              <li>Find and run: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">009_create_category_products.sql</code></li>
              <li>Refresh this page after the script completes</li>
            </ol>
            <p className="text-xs text-slate-600 dark:text-slate-400">This will create the table for Fashion, Gadgets, and Gaming products.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-3 md:p-4 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin" className="text-[#333333] dark:text-[#E5E7EB] flex size-8 md:size-10 shrink-0 items-center justify-center">
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-lg md:text-xl font-bold truncate px-2">Category Products</h1>
        <div className="w-8 md:w-10 shrink-0" />
      </header>

      <main className="flex-1 px-3 md:px-4 py-4">
        <Tabs defaultValue="fashion" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="fashion" className="text-xs md:text-sm py-2">Fashion ({fashionProducts?.length || 0})</TabsTrigger>
            <TabsTrigger value="gadgets" className="text-xs md:text-sm py-2">Gadgets ({gadgetsProducts?.length || 0})</TabsTrigger>
            <TabsTrigger value="gaming" className="text-xs md:text-sm py-2">Gaming ({gamingProducts?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="fashion" className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-lg md:text-xl font-bold truncate">Fashion Products</h2>
              <Link href="/admin/categories/new?category=fashion">
                <Button className="bg-[#4A90E2] text-sm md:text-base w-full sm:w-auto">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {fashionProducts?.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gadgets" className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-lg md:text-xl font-bold truncate">Gadgets</h2>
              <Link href="/admin/categories/new?category=gadgets">
                <Button className="bg-[#4A90E2] text-sm md:text-base w-full sm:w-auto">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Gadget
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {gadgetsProducts?.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gaming" className="mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-lg md:text-xl font-bold truncate">Gaming Products</h2>
              <Link href="/admin/categories/new?category=gaming">
                <Button className="bg-[#4A90E2] text-sm md:text-base w-full sm:w-auto">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {gamingProducts?.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
