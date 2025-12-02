"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, Save, Sparkles, Check, Key } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type AIProvider = "gemini" | "openai" | "deepseek" | "openrouter"

const providers: { value: AIProvider; label: string; description: string }[] = [
  { value: "gemini", label: "Google Gemini", description: "Gemini 1.5 Flash - Fast & accurate" },
  { value: "openai", label: "OpenAI / ChatGPT", description: "GPT-4o Mini - High quality" },
  { value: "deepseek", label: "DeepSeek", description: "DeepSeek Vision - Cost effective" },
  { value: "openrouter", label: "OpenRouter", description: "Multiple models - Flexible" },
]

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [activeProvider, setActiveProvider] = useState<AIProvider>("gemini")
  const [geminiKey, setGeminiKey] = useState("")
  const [openaiKey, setOpenaiKey] = useState("")
  const [deepseekKey, setDeepseekKey] = useState("")
  const [openrouterKey, setOpenrouterKey] = useState("")

  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({
    gemini: false,
    openai: false,
    deepseek: false,
    openrouter: false,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/ai-settings")
      if (res.ok) {
        const data = await res.json()
        setActiveProvider((data.ai_provider as AIProvider) || "gemini")
        setGeminiKey(data.gemini_api_key || "")
        setOpenaiKey(data.openai_api_key || "")
        setDeepseekKey(data.deepseek_api_key || "")
        setOpenrouterKey(data.openrouter_api_key || "")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_provider: activeProvider,
          gemini_api_key: geminiKey,
          openai_api_key: openaiKey,
          deepseek_api_key: deepseekKey,
          openrouter_api_key: openrouterKey,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      alert("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const toggleShowKey = (provider: AIProvider) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  const getKeyValue = (provider: AIProvider) => {
    switch (provider) {
      case "gemini":
        return geminiKey
      case "openai":
        return openaiKey
      case "deepseek":
        return deepseekKey
      case "openrouter":
        return openrouterKey
    }
  }

  const setKeyValue = (provider: AIProvider, value: string) => {
    switch (provider) {
      case "gemini":
        setGeminiKey(value)
        break
      case "openai":
        setOpenaiKey(value)
        break
      case "deepseek":
        setDeepseekKey(value)
        break
      case "openrouter":
        setOpenrouterKey(value)
        break
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center bg-white dark:bg-gray-900 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">AI Settings</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Active Provider Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Active AI Provider
          </h2>
          <p className="text-sm text-gray-500 mb-4">Select which AI provider to use for automatic product analysis</p>

          <div className="grid gap-3">
            {providers.map((provider) => (
              <button
                key={provider.value}
                onClick={() => setActiveProvider(provider.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  activeProvider === provider.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">{provider.label}</p>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                  </div>
                  {activeProvider === provider.value && (
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-3 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Keys
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter your API keys below. Only the active provider's key will be used.
          </p>

          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.value}>
                <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
                  {provider.label} API Key
                  {activeProvider === provider.value && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Active</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showKeys[provider.value] ? "text" : "password"}
                    value={getKeyValue(provider.value)}
                    onChange={(e) => setKeyValue(provider.value, e.target.value)}
                    placeholder={`Enter your ${provider.label} API key...`}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(provider.value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKeys[provider.value] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            How to get API Keys:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li>
              <strong>Gemini:</strong>{" "}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google AI Studio
              </a>
            </li>
            <li>
              <strong>OpenAI:</strong>{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                OpenAI Platform
              </a>
            </li>
            <li>
              <strong>DeepSeek:</strong>{" "}
              <a
                href="https://platform.deepseek.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                DeepSeek Platform
              </a>
            </li>
            <li>
              <strong>OpenRouter:</strong>{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                OpenRouter Keys
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
        >
          {saving ? (
            "Saving..."
          ) : saved ? (
            <span className="flex items-center gap-2">
              <Check className="h-5 w-5" /> Saved Successfully
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-5 w-5" /> Save Settings
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
