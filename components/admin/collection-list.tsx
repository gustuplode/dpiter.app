"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreVertical, Network, Pencil, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Collection = {
  id: string
  title: string
  brand: string
  image_url: string
  status: string
  product_count: number
  is_limited_time: boolean
}

export function CollectionList({ initialCollections }: { initialCollections: Collection[] }) {
  const [collections, setCollections] = useState(initialCollections)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection? This will also delete all products in it.")) {
      return
    }

    const { error } = await supabase.from("collections").delete().eq("id", id)

    if (error) {
      alert("Error deleting collection: " + error.message)
      return
    }

    setCollections(collections.filter((c) => c.id !== id))
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-[#E5E7EB] dark:bg-[#4a4a50] flex items-center justify-center mb-4">
          <Network className="h-8 w-8 text-[#333333]/30 dark:text-[#E5E7EB]/30" />
        </div>
        <h3 className="text-xl font-bold text-[#333333] dark:text-[#E5E7EB]">No Collections Found</h3>
        <p className="text-[#333333]/70 dark:text-[#E5E7EB]/70 mt-2 max-w-xs">
          Tap the '+' button to create your first product collection.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-24">
      {collections.map((collection) => (
        <div key={collection.id} className="flex gap-4 bg-white dark:bg-[#2a2a2e] p-4 rounded-lg shadow-sm">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px]"
            style={{ backgroundImage: `url('${collection.image_url}')` }}
          />
          <div className="flex flex-1 flex-col justify-center gap-0.5">
            <p className="text-[#333333] dark:text-[#E5E7EB] text-base font-semibold leading-normal">
              {collection.title}
            </p>
            <p
              className={`text-sm font-normal leading-normal ${
                collection.status === "published" ? "text-[#2ECC71]" : "text-[#F39C12]"
              }`}
            >
              Status: {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
            </p>
            <p className="text-[#333333]/70 dark:text-[#E5E7EB]/70 text-sm font-normal leading-normal">
              {collection.product_count} Products
            </p>
          </div>
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-[#333333] dark:text-[#E5E7EB] flex size-8 items-center justify-center rounded-full hover:bg-[#F4F4F7] dark:hover:bg-[#1a1a1d]">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/collections/${collection.id}/products`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/collections/${collection.id}/edit`} className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Collection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(collection.id)}
                  className="text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
