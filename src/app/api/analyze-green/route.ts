import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const { image, apiKey } = await request.json()

    if (!image || !apiKey) {
      return NextResponse.json({ error: 'Image and API key are required' }, { status: 400 })
    }

    // Extract base64 data and media type from data URL
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    const base64Data = match[2]

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            {
              type: 'text',
              text: `You are an expert green coffee grader. Analyze this photo of green (unroasted) coffee beans and provide your assessment.

Respond with ONLY a valid JSON object (no markdown, no explanation) with these fields:

{
  "estimatedOrigin": "Best guess region/country based on visual cues (bean shape, size, color)",
  "processingMethod": "washed | natural | honey | wet-hulled | anaerobic — your best estimate",
  "variety": "Best guess variety or family (e.g., 'Bourbon', 'Typica', 'SL28', 'Catimor')",
  "moistureEstimate": "Estimated moisture range (e.g., '10-11%')",
  "beanColor": "Description of green bean color (e.g., 'Blue-green, consistent')",
  "sizeUniformity": "Assessment of size consistency (e.g., 'Uniform, screen 16-17')",
  "silverSkinPresence": "Amount of silver skin visible — indicates processing",
  "defectEstimate": "Rough defect assessment (e.g., 'Very few visible defects, <5 per 350g')",
  "observations": ["Array of 3-5 notable observations about the beans"]
}

Be specific but acknowledge uncertainty. These are visual estimates only.`,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse JSON from response
    let jsonStr = text.trim()
    const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const analysis = JSON.parse(jsonStr)

    return NextResponse.json(analysis)
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analysis failed' },
      { status: 500 },
    )
  }
}
