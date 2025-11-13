"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f8f6f5] dark:bg-[#23150f] p-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#23150f] dark:text-[#f8f6f5]">Something went wrong!</h2>
        <p className="text-slate-600 dark:text-slate-400">{error.message || "An unexpected error occurred"}</p>
        <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-white">
          Try again
        </Button>
      </div>
    </div>
  )
}
