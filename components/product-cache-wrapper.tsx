"use client"

import type React from "react"

import { useEffect } from "react"
import { cacheProduct } from "@/lib/offline-cache"

interface ProductCacheWrapperProps {
  product: any
  children: React.ReactNode
}

export function ProductCacheWrapper({ product, children }: ProductCacheWrapperProps) {
  useEffect(() => {
    // Cache product data when page loads
    if (product) {
      cacheProduct(product)
    }
  }, [product])

  return <>{children}</>
}
