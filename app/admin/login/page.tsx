"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Network } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (data?.user) {
        // Successfully logged in
        router.push("/admin")
        router.refresh()
      } else {
        throw new Error("Login failed")
      }
    } catch (error: unknown) {
      console.error("[v0] Admin login error:", error)
      setError(error instanceof Error ? error.message : "Login failed. Please check your credentials.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Card className="border-[#E5E7EB] dark:border-[#4a4a50]">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Network className="h-8 w-8 text-[#4A90E2]" />
                <span className="text-2xl font-bold text-[#333333] dark:text-[#E5E7EB]">Dpiter</span>
              </div>
              <CardTitle className="text-2xl text-[#333333] dark:text-[#E5E7EB]">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[#333333] dark:text-[#E5E7EB]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-[#2a2a2e] border-[#E5E7EB] dark:border-[#4a4a50]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-[#333333] dark:text-[#E5E7EB]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white dark:bg-[#2a2a2e] border-[#E5E7EB] dark:border-[#4a4a50]"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
