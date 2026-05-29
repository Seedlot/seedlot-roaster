import { NextRequest } from 'next/server'
import { buildPrompt } from '@/lib/prompt-builder'
import { cmsFetch } from '@/lib/cms-fetch'
import type { WizardState } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { wizardState } = await req.json() as {
    wizardState: WizardState
  }

  const { system, user } = buildPrompt(wizardState)

  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL
  const cmsApiKey = process.env.CMS_API_KEY

  if (!cmsUrl || !cmsApiKey) {
    return Response.json({ error: 'Server configuration missing' }, { status: 503 })
  }

  // Generate via CMS proxy → OpenCode Go (minimax-m2.5)
  const cmsRes = await cmsFetch(`${cmsUrl}/api/roaster/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cmsApiKey,
    },
    body: JSON.stringify({ system, user }),
  })

  if (!cmsRes.ok) {
    const text = await cmsRes.text().catch(() => 'Unknown error')
    return Response.json({ error: `Generation failed: ${text}` }, { status: 502 })
  }

  if (!cmsRes.body) {
    return Response.json({ error: 'No response from server' }, { status: 502 })
  }

  return new Response(cmsRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
