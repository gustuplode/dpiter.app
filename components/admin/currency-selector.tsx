"use client"

import { useState, useEffect } from "react"
import { DollarSign, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
]

export function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Load saved currency from localStorage
    const saved = localStorage.getItem("selected_currency")
    if (saved) {
      setSelectedCurrency(saved)
    }
  }, [])

  const handleCurrencyChange = async (currencyCode: string) => {
    setSelectedCurrency(currencyCode)
    localStorage.setItem("selected_currency", currencyCode)
    setIsOpen(false)

    // Optionally save to database
    try {
      await supabase
        .from("app_settings")
        .upsert({ key: "default_currency", value: currencyCode }, { onConflict: "key" })
    } catch (error) {
      console.error("Error saving currency:", error)
    }

    window.dispatchEvent(new CustomEvent("currencyChanged", { detail: { currency: currencyCode } }))
  }

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency) || currencies[0]

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 h-8 px-2 bg-white dark:bg-[#2a2a2e] border-[#E5E7EB] dark:border-[#4a4a50]"
      >
        <DollarSign className="h-4 w-4" />
        <span className="text-sm font-medium">{currentCurrency.code}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#2a2a2e] rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#4a4a50] z-20 max-h-64 overflow-y-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#333336] flex items-center gap-2 ${
                  currency.code === selectedCurrency
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <span className="font-semibold">{currency.symbol}</span>
                <div className="flex-1">
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
