import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 pb-3 justify-between sticky top-0 z-10 border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin" className="text-[#333333] dark:text-[#E5E7EB] flex size-10 shrink-0 items-center justify-center">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-[#333333] dark:text-[#E5E7EB] text-xl font-bold">Category Products</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-4">
        <Tabs defaultValue="fashion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fashion">Fashion ({fashionProducts?.length || 0})</TabsTrigger>
            <TabsTrigger value="gadgets">Gadgets ({gadgetsProducts?.length || 0})</TabsTrigger>
            <TabsTrigger value="gaming">Gaming ({gamingProducts?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="fashion" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Fashion Products</h2>
              <Link href="/admin/categories/new?category=fashion">
                <Button className="bg-[#4A90E2]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fashion Product
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fashionProducts?.map((product) => (
                <Link key={product.id} href={`/admin/categories/${product.id}/edit`}>
                  <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-3 shadow-sm">
                    <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-40 object-cover rounded mb-2" />
                    <h3 className="font-semibold text-sm">{product.brand}</h3>
                    <p className="text-xs text-slate-500">{product.title}</p>
                    <p className="text-sm font-bold mt-1">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gadgets" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gadgets</h2>
              <Link href="/admin/categories/new?category=gadgets">
                <Button className="bg-[#4A90E2]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gadget
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gadgetsProducts?.map((product) => (
                <Link key={product.id} href={`/admin/categories/${product.id}/edit`}>
                  <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-3 shadow-sm">
                    <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-40 object-cover rounded mb-2" />
                    <h3 className="font-semibold text-sm">{product.brand}</h3>
                    <p className="text-xs text-slate-500">{product.title}</p>
                    <p className="text-sm font-bold mt-1">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gaming" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gaming Products</h2>
              <Link href="/admin/categories/new?category=gaming">
                <Button className="bg-[#4A90E2]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gaming Product
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gamingProducts?.map((product) => (
                <Link key={product.id} href={`/admin/categories/${product.id}/edit`}>
                  <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-3 shadow-sm">
                    <img src={product.image_url || "/placeholder.svg"} alt={product.title} className="w-full h-40 object-cover rounded mb-2" />
                    <h3 className="font-semibold text-sm">{product.brand}</h3>
                    <p className="text-xs text-slate-500">{product.title}</p>
                    <p className="text-sm font-bold mt-1">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
