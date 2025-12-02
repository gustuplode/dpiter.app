import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { model, apiKey } = await req.json()

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 })
    }

    // Determine provider from model ID
    let provider = "gemini"
    if (model.startsWith("gpt-")) provider = "openai"
    else if (model.startsWith("deepseek")) provider = "deepseek"
    else if (model.startsWith("grok")) provider = "grok"
    else if (model.startsWith("qwen")) provider = "qwen"
    else if (model.includes("/")) provider = "openrouter"

    // Test connection based on provider
    let testUrl = ""
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    let body = {}

    switch (provider) {
      case "gemini":
        testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        body = { contents: [{ parts: [{ text: "Say 'OK' only" }] }] }
        break
      case "openai":
        testUrl = "https://api.openai.com/v1/chat/completions"
        headers["Authorization"] = `Bearer ${apiKey}`
        body = { model, messages: [{ role: "user", content: "Say OK" }], max_tokens: 5 }
        break
      case "deepseek":
        testUrl = "https://api.deepseek.com/v1/chat/completions"
        headers["Authorization"] = `Bearer ${apiKey}`
        body = { model, messages: [{ role: "user", content: "Say OK" }], max_tokens: 5 }
        break
      case "grok":
        testUrl = "https://api.x.ai/v1/chat/completions"
        headers["Authorization"] = `Bearer ${apiKey}`
        body = { model, messages: [{ role: "user", content: "Say OK" }], max_tokens: 5 }
        break
      case "qwen":
        testUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
        headers["Authorization"] = `Bearer ${apiKey}`
        body = { model, input: { messages: [{ role: "user", content: "Say OK" }] } }
        break
      case "openrouter":
        testUrl = "https://openrouter.ai/api/v1/chat/completions"
        headers["Authorization"] = `Bearer ${apiKey}`
        headers["HTTP-Referer"] = "https://dpiter.shop"
        body = { model, messages: [{ role: "user", content: "Say OK" }], max_tokens: 5 }
        break
    }

    const response = await fetch(testUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      const error = await response.text()
      return NextResponse.json({ success: false, error: `API Error: ${error.slice(0, 100)}` }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Connection failed" }, { status: 500 })
  }
}
