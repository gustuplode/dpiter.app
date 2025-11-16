"use client"

import { useEffect, useState } from "react"

export function CurrencyDisplay({ price }: { price: number }) {
  // Validate price
  if (typeof price !== 'number' || isNaN(price)) {
    return <span>₹0.00</span>
  }

  return (
    <span>
      ₹{price.toFixed(2)}
    </span>
  )
}
