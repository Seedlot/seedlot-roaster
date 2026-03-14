import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompt-builder'
import { cmsFetch } from '@/lib/cms-fetch'
import type { WizardState } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { apiKey, wizardState } = await req.json() as {
    apiKey?: string
    wizardState: WizardState
  }

  const { system, user } = buildPrompt(wizardState)

  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL
  const cmsApiKey = process.env.CMS_API_KEY
  const hasServerKey = process.env.NEXT_PUBLIC_HAS_SERVER_KEY === 'true'

  // Try server-side generation via CMS → claude-max-proxy
  if (hasServerKey && cmsUrl && cmsApiKey) {
    try {
      const cmsRes = await cmsFetch(`${cmsUrl}/api/roaster/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cmsApiKey,
        },
        body: JSON.stringify({ system, user }),
      })

      if (cmsRes.ok && cmsRes.body) {
        return new Response(cmsRes.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        })
      }
      // Fall through to BYOK if CMS call fails
    } catch {
      // Fall through to BYOK
    }
  }

  // BYOK fallback — requires user-provided API key
  if (!apiKey) {
    return Response.json({ error: 'API key is required' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey })

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }],
  })

  // Stream the response as text/event-stream
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
          }
        }

        const finalMessage = await stream.finalMessage()
        const usage = {
          inputTokens: finalMessage.usage.input_tokens,
          outputTokens: finalMessage.usage.output_tokens,
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, usage })}\n\n`))
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Generation failed'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
