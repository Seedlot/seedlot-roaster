import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  const { apiKey } = await req.json()

  if (!apiKey) {
    return Response.json({ valid: false, error: 'No key provided' }, { status: 400 })
  }

  try {
    const client = new Anthropic({ apiKey })

    // Lightweight call to validate the key works
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "ok"' }],
    })

    return Response.json({ valid: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid key'
    return Response.json({ valid: false, error: message }, { status: 401 })
  }
}
