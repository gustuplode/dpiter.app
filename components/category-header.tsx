"use client"

import { useState } from "react"
import { LogoModal } from "./logo-modal"

interface CategoryHeaderProps {
  fashionCount?: number
  gadgetsCount?: number
  gamingCount?: number
  allProductsCount?: number
}

export function CategoryHeader({
  fashionCount = 0,
  gadgetsCount = 0,
  gamingCount = 0,
  allProductsCount = 0,
}: CategoryHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <LogoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
