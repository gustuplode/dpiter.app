// AI Product Analyzer - Supports multiple AI providers and models

export interface ProductAnalysisResult {
  title: string
  brand: string
  description: string
  keywords: string[]
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

function getProviderFromModel(model: string): string {
  if (model.startsWith("gemini")) return "gemini"
  if (model.startsWith("gpt-")) return "openai"
  if (model.startsWith("deepseek")) return "deepseek"
  if (model.startsWith("grok")) return "grok"
  if (model.startsWith("qwen")) return "qwen"
  if (model.includes("/")) return "openrouter"
  return "gemini"
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

  let jsonStr = text.trim()

  // Remove markdown code blocks if present
  if (jsonStr.startsWith("```json")) jsonStr = jsonStr.slice(7)
  else if (jsonStr.startsWith("```")) jsonStr = jsonStr.slice(3)
  if (jsonStr.endsWith("```")) jsonStr = jsonStr.slice(0, -3)
  jsonStr = jsonStr.trim()

  // Try to find JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) jsonStr = jsonMatch[0]

  try {
    const parsed = JSON.parse(jsonStr)
    return {
      title: parsed.title || "Untitled Product",
      brand: "Dpiter",
      description: parsed.description || "",
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    }
  } catch (e) {
    console.error("Failed to parse AI response:", text)
    throw new Error("Failed to parse AI response. Please try again.")
  }
}

export async function analyzeProductImage(
  imageUrl: string,
  model: string,
  apiKey: string,
): Promise<ProductAnalysisResult> {
  if (!imageUrl) throw new Error("Image URL is required")
  if (!apiKey) throw new Error("API key is required. Please configure it in Admin Settings.")

  const provider = getProviderFromModel(model)
  const base64Image = await fetchImageAsBase64(imageUrl)

  let response: Response
  let text: string

  switch (provider) {
    case "gemini": {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: PRODUCT_ANALYSIS_PROMPT },
                  { inline_data: { mime_type: "image/jpeg", data: base64Image } },
                ],
              },
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
          }),
        },
      )
      if (!response.ok) throw new Error(`Gemini API error: ${await response.text()}`)
      const data = await response.json()
      text = data.candidates?.[0]?.content?.parts?.[0]?.text
      break
    }

    case "openai": {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
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
        }),
      })
      if (!response.ok) throw new Error(`OpenAI API error: ${await response.text()}`)
      const data = await response.json()
      text = data.choices?.[0]?.message?.content
      break
    }

    case "deepseek": {
      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
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
        }),
      })
      if (!response.ok) throw new Error(`DeepSeek API error: ${await response.text()}`)
      const data = await response.json()
      text = data.choices?.[0]?.message?.content
      break
    }

    case "grok": {
      response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
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
        }),
      })
      if (!response.ok) throw new Error(`Grok API error: ${await response.text()}`)
      const data = await response.json()
      text = data.choices?.[0]?.message?.content
      break
    }

    case "qwen": {
      response = await fetch("https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          input: {
            messages: [
              {
                role: "user",
                content: [{ text: PRODUCT_ANALYSIS_PROMPT }, { image: `data:image/jpeg;base64,${base64Image}` }],
              },
            ],
          },
        }),
      })
      if (!response.ok) throw new Error(`Qwen API error: ${await response.text()}`)
      const data = await response.json()
      text = data.output?.choices?.[0]?.message?.content
      break
    }

    case "openrouter":
    default: {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://dpiter.shop",
          "X-Title": "Dpiter",
        },
        body: JSON.stringify({
          model,
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
        }),
      })
      if (!response.ok) throw new Error(`OpenRouter API error: ${await response.text()}`)
      const data = await response.json()
      text = data.choices?.[0]?.message?.content
      break
    }
  }

  return parseAIResponse(text)
}
