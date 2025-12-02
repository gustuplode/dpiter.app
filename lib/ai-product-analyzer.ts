// AI Product Analyzer - Reusable function to analyze product images
// Supports Gemini, OpenAI, DeepSeek, and OpenRouter

export type AIProvider = "gemini" | "openai" | "deepseek" | "openrouter"

export interface ProductAnalysisResult {
  title: string
  brand: string
  description: string
  keywords: string[]
}

export interface AnalyzeProductImageOptions {
  imageUrl: string
  apiProvider: AIProvider
  apiKey: string
}

const PRODUCT_ANALYSIS_PROMPT = `You are an expert e-commerce product analyst. Analyze this product image and provide SEO-optimized product information.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "title": "SEO optimized ecommerce title (10-16 words, include product type, key features, target audience)",
  "brand": "Dpiter",
  "description": "40-70 word SEO friendly product description highlighting key features, benefits, materials, and use cases",
  "keywords": ["8-12 relevant SEO keywords as an array"]
}

Important:
- Title should be compelling and include main product attributes
- Brand must always be "Dpiter"
- Description should be detailed but concise, highlighting USPs
- Keywords should include product type, category, features, materials, style, and trending terms
- Make content suitable for Indian e-commerce market
- Include terms like "online shopping", "best price", "2025", etc. in keywords`

async function analyzeWithGemini(imageUrl: string, apiKey: string): Promise<ProductAnalysisResult> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PRODUCT_ANALYSIS_PROMPT },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: await fetchImageAsBase64(imageUrl),
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      }),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  return parseAIResponse(text)
}

async function analyzeWithOpenAI(imageUrl: string, apiKey: string): Promise<ProductAnalysisResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PRODUCT_ANALYSIS_PROMPT },
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  return parseAIResponse(text)
}

async function analyzeWithDeepSeek(imageUrl: string, apiKey: string): Promise<ProductAnalysisResult> {
  const base64Image = await fetchImageAsBase64(imageUrl)

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-vision",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PRODUCT_ANALYSIS_PROMPT },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${error}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  return parseAIResponse(text)
}

async function analyzeWithOpenRouter(imageUrl: string, apiKey: string): Promise<ProductAnalysisResult> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://dpiter.shop",
      "X-Title": "Dpiter Product Analyzer",
    },
    body: JSON.stringify({
      model: "google/gemini-flash-1.5",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PRODUCT_ANALYSIS_PROMPT },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${error}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  return parseAIResponse(text)
}

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")
  return base64
}

function parseAIResponse(text: string): ProductAnalysisResult {
  if (!text) {
    throw new Error("Empty response from AI")
  }

  // Try to extract JSON from the response
  let jsonStr = text.trim()

  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7)
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3)
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3)
  }
  jsonStr = jsonStr.trim()

  // Try to find JSON object in the text
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  }

  try {
    const parsed = JSON.parse(jsonStr)

    return {
      title: parsed.title || "Untitled Product",
      brand: "Dpiter", // Always set to Dpiter
      description: parsed.description || "",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    }
  } catch (e) {
    console.error("Failed to parse AI response:", text)
    throw new Error("Failed to parse AI response. Please try again.")
  }
}

export async function analyzeProductImage({
  imageUrl,
  apiProvider,
  apiKey,
}: AnalyzeProductImageOptions): Promise<ProductAnalysisResult> {
  if (!imageUrl) {
    throw new Error("Image URL is required")
  }
  if (!apiKey) {
    throw new Error("API key is required. Please configure it in Admin Settings.")
  }

  switch (apiProvider) {
    case "gemini":
      return analyzeWithGemini(imageUrl, apiKey)
    case "openai":
      return analyzeWithOpenAI(imageUrl, apiKey)
    case "deepseek":
      return analyzeWithDeepSeek(imageUrl, apiKey)
    case "openrouter":
      return analyzeWithOpenRouter(imageUrl, apiKey)
    default:
      throw new Error(`Unsupported AI provider: ${apiProvider}`)
  }
}
