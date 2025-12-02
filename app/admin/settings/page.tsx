"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, Save, Sparkles, Check, Key, Cpu, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const AI_MODELS = [
  // Gemini Models
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "gemini", description: "Fastest, latest model" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "gemini", description: "Fast & balanced" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "gemini", description: "Most capable" },
  { id: "gemini-1.0-pro-vision", name: "Gemini 1.0 Pro Vision", provider: "gemini", description: "Vision optimized" },

  // OpenAI/ChatGPT Models
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", description: "Most capable GPT" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai", description: "Fast & affordable" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai", description: "High quality" },
  { id: "gpt-4-vision-preview", name: "GPT-4 Vision", provider: "openai", description: "Vision enabled" },

  // DeepSeek Models
  { id: "deepseek-vision", name: "DeepSeek Vision", provider: "deepseek", description: "Vision analysis" },
  { id: "deepseek-chat", name: "DeepSeek Chat", provider: "deepseek", description: "General purpose" },

  // Grok Models (xAI)
  { id: "grok-2-vision", name: "Grok 2 Vision", provider: "grok", description: "xAI vision model" },
  { id: "grok-2", name: "Grok 2", provider: "grok", description: "Latest Grok" },
  { id: "grok-beta", name: "Grok Beta", provider: "grok", description: "Experimental" },

  // Qwen Models
  { id: "qwen-vl-max", name: "Qwen VL Max", provider: "qwen", description: "Best vision quality" },
  { id: "qwen-vl-plus", name: "Qwen VL Plus", provider: "qwen", description: "Balanced performance" },
  { id: "qwen2.5-72b", name: "Qwen 2.5 72B", provider: "qwen", description: "Large model" },
  { id: "qwen3-235b", name: "Qwen 3 235B", provider: "qwen", description: "Largest Qwen" },

  // Free/Open Models (OpenRouter)
  {
    id: "arcee-ai/arcee-trinity-mini",
    name: "Arcee Trinity Mini (Free)",
    provider: "openrouter",
    description: "Free tier",
  },
  { id: "google/gemma-2-9b-it", name: "Gemma 2 9B", provider: "openrouter", description: "Google open model" },
  {
    id: "meta-llama/llama-3.2-90b-vision",
    name: "Llama 3.2 90B Vision",
    provider: "openrouter",
    description: "Meta vision",
  },
  { id: "mistralai/pixtral-12b", name: "Pixtral 12B", provider: "openrouter", description: "Mistral vision" },

  // Gamma/Other
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "openrouter",
    description: "Anthropic best",
  },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "openrouter", description: "Fast Claude" },
]

const PROVIDER_INFO: Record<string, { name: string; color: string; docUrl: string }> = {
  gemini: { name: "Google Gemini", color: "bg-blue-500", docUrl: "https://makersuite.google.com/app/apikey" },
  openai: { name: "OpenAI", color: "bg-green-500", docUrl: "https://platform.openai.com/api-keys" },
  deepseek: { name: "DeepSeek", color: "bg-purple-500", docUrl: "https://platform.deepseek.com/" },
  grok: { name: "xAI Grok", color: "bg-orange-500", docUrl: "https://console.x.ai/" },
  qwen: { name: "Alibaba Qwen", color: "bg-cyan-500", docUrl: "https://dashscope.console.aliyun.com/" },
  openrouter: { name: "OpenRouter", color: "bg-pink-500", docUrl: "https://openrouter.ai/keys" },
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testingAI, setTestingAI] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/ai-settings")
      if (res.ok) {
        const data = await res.json()
        setSelectedModel(data.ai_model || "gemini-1.5-flash")
        setApiKey(data.ai_api_key || "")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/admin/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_model: selectedModel,
          ai_api_key: apiKey,
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

  const testAIConnection = async () => {
    if (!apiKey) {
      setTestResult({ success: false, message: "Please enter an API key first" })
      return
    }

    setTestingAI(true)
    setTestResult(null)

    try {
      const res = await fetch("/api/admin/test-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel, apiKey }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setTestResult({ success: true, message: "AI connection successful!" })
      } else {
        setTestResult({ success: false, message: data.error || "Connection failed" })
      }
    } catch (error) {
      setTestResult({ success: false, message: "Failed to test connection" })
    } finally {
      setTestingAI(false)
    }
  }

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel)
  const currentProvider = currentModel ? PROVIDER_INFO[currentModel.provider] : null

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center bg-white dark:bg-gray-800 px-4 py-3 gap-3 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Settings</h1>
            <p className="text-xs text-gray-500">Configure AI product analyzer</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Model Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-purple-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Select AI Model</h2>
          </div>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <optgroup label="Google Gemini">
              {AI_MODELS.filter((m) => m.provider === "gemini").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="OpenAI / ChatGPT">
              {AI_MODELS.filter((m) => m.provider === "openai").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="DeepSeek">
              {AI_MODELS.filter((m) => m.provider === "deepseek").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="xAI Grok">
              {AI_MODELS.filter((m) => m.provider === "grok").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="Alibaba Qwen">
              {AI_MODELS.filter((m) => m.provider === "qwen").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="OpenRouter (Multi-provider)">
              {AI_MODELS.filter((m) => m.provider === "openrouter").map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.description}
                </option>
              ))}
            </optgroup>
          </select>

          {/* Current Selection Info */}
          {currentModel && currentProvider && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className={`h-2 w-2 rounded-full ${currentProvider.color}`}></span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Provider: <strong>{currentProvider.name}</strong>
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href={currentProvider.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-500 hover:underline"
              >
                Get API Key
              </a>
            </div>
          )}
        </div>

        {/* API Key Input */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">API Key</h2>
          </div>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">Your API key is stored securely and never shared.</p>
        </div>

        {/* Test Connection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-green-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Test Connection</h2>
          </div>

          <Button
            onClick={testAIConnection}
            disabled={testingAI || !apiKey}
            variant="outline"
            className="w-full h-11 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-transparent"
          >
            {testingAI ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                Testing...
              </span>
            ) : (
              "Test AI Connection"
            )}
          </Button>

          {testResult && (
            <div
              className={`mt-3 p-3 rounded-xl text-sm ${
                testResult.success
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}
            >
              {testResult.success ? "✓" : "✕"} {testResult.message}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Quick Tips</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
            <li>
              • <strong>Gemini 1.5 Flash</strong> - Best for fast product analysis
            </li>
            <li>
              • <strong>GPT-4o Mini</strong> - Great balance of speed & quality
            </li>
            <li>
              • <strong>Arcee Trinity Mini</strong> - Free tier available
            </li>
            <li>
              • <strong>OpenRouter</strong> - Use one key for multiple models
            </li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
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
