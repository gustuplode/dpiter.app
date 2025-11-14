"use client"

import { useEffect, useState } from "react"

export function CurrencyDisplay({ price }: { price: number }) {
  const [currency, setCurrency] = useState("$")

  useEffect(() => {
    const updateCurrency = () => {
      const selected = localStorage.getItem("selected_currency") || "USD"
      const symbols: Record<string, string> = {
        USD: "$",
        INR: "₹",
        EUR: "€",
        GBP: "£",
        JPY: "¥",
        AUD: "A$",
        CAD: "C$",
      }
      setCurrency(symbols[selected] || "$")
    }

    updateCurrency()

    const handleCurrencyChange = () => {
      updateCurrency()
    }

    window.addEventListener("currencychange", handleCurrencyChange)
    return () => window.removeEventListener("currencychange", handleCurrencyChange)
  }, [])

  return (
    <span>
      {currency}
      {price.toFixed(2)}
    </span>
  )
}
