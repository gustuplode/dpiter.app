"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Loader2, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CategoryProduct {
  id: string
  title: string
  brand: string
  price: number
  image_url: string
  category: string
}

interface CategoryProductCardProps {
  product: CategoryProduct
}

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from("category_products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-3 shadow-sm relative">
      <img 
        src={product.image_url || "/placeholder.svg"} 
        alt={product.title} 
        className="w-full h-40 object-cover rounded mb-2" 
      />
      <h3 className="font-semibold text-sm">{product.brand}</h3>
      <p className="text-xs text-slate-500 line-clamp-2">{product.title}</p>
      <p className="text-sm font-bold mt-1">₹{product.price}</p>
      
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${product.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
