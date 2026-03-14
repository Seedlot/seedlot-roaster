import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Server misconfigured: missing GEMINI_API_KEY' }, { status: 503 })
    }

    // Extract base64 data and media type from data URL
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    const mimeType = match[1]
    const base64Data = match[2]

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const result = await model.generateContent([
      {
        inlineData: { mimeType, data: base64Data },
      },
      {
        text: `You are an expert green coffee analyst. Look at this image carefully.

If this is a **coffee label, bag, or packaging**, read all visible text and extract coffee details from it.
If this is a photo of **green (unroasted) coffee beans** without a label, analyze the beans visually.

Respond with ONLY a valid JSON object (no markdown, no explanation) with these fields:

{
  "estimatedOrigin": "Country or region from the label text, or best guess from bean appearance",
  "processingMethod": "washed | natural | honey | wet-hulled | anaerobic — from label or visual estimate",
  "variety": "Variety name from label (e.g., 'Bourbon', 'Typica', 'SL28', 'Catimor', 'Gesha')",
  "moistureEstimate": "Moisture percentage if on label (e.g., '10.5%'), or visual estimate range",
  "beanColor": "Description of bean/bag appearance",
  "sizeUniformity": "Screen size if on label, or visual assessment",
  "silverSkinPresence": "From label or visual observation",
  "defectEstimate": "Grade info from label, or visual assessment",
  "observations": ["Array of 3-5 key details extracted from the label or observed from beans"],
  "labelText": "All readable text from the label/bag (if applicable)"
}

For labels: prioritize extracting origin, farm/producer, altitude, lot name, processing, variety, and any cupping score or grade info from the printed text.
For beans: provide visual estimates with appropriate uncertainty.`,
      },
    ])

    const text = result.response.text()

    // Parse JSON from response
    let jsonStr = text.trim()
    const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const analysis = JSON.parse(jsonStr)

    return NextResponse.json(analysis)
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analysis failed' },
      { status: 500 },
    )
  }
}
