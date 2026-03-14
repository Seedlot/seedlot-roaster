import { NextRequest } from 'next/server'
import { cmsFetch } from '@/lib/cms-fetch'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const apiKey = process.env.CMS_API_KEY
  if (!apiKey) return Response.json({ error: 'Server misconfigured' }, { status: 503 })

  const res = await cmsFetch(`${CMS_URL}/api/roaster/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
