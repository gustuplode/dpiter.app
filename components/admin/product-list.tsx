"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Package, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

type Product = {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  affiliate_link: string | null
  is_visible: boolean
}

export function ProductList({
  collectionId,
  initialProducts,
}: {
  collectionId: string
  initialProducts: Product[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    console.log("[v0] Deleting product:", id)
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("[v0] Delete error:", error)
      alert("Error deleting product: " + error.message)
      return
    }

    console.log("[v0] Product deleted successfully")
    setProducts(products.filter((p) => p.id !== id))
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-[#E5E7EB] dark:bg-[#4a4a50] flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-[#333333]/30 dark:text-[#E5E7EB]/30" />
        </div>
        <h3 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB]">No Products Yet</h3>
        <p className="text-[#333333]/70 dark:text-[#E5E7EB]/70 mt-2 max-w-xs">
          Add your first product to this collection.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white dark:bg-[#2a2a2e] rounded-lg shadow-sm overflow-hidden">
          <div className="relative">
            <div
              className="w-full aspect-[3/4] bg-center bg-cover"
              style={{ backgroundImage: `url('${product.image_url}')` }}
            />
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-white dark:bg-[#2a2a2e] rounded-full p-1.5 shadow-md">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/admin/collections/${collectionId}/products/${product.id}/edit`}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="p-3">
            <p className="text-[#333333] dark:text-[#E5E7EB] text-sm font-bold uppercase">{product.brand}</p>
            <p className="text-[#333333]/70 dark:text-[#E5E7EB]/70 text-sm truncate">{product.title}</p>
            <p className="text-[#333333] dark:text-[#E5E7EB] text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
            {!product.is_visible && (
              <span className="inline-block mt-1 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Hidden</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
