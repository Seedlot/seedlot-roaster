import { NextRequest } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const authHeader = req.headers.get('authorization')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authHeader) {
    headers['Authorization'] = authHeader
  } else {
    const apiKey = process.env.CMS_API_KEY
    if (!apiKey) return Response.json({ error: 'Server misconfigured' }, { status: 503 })
    headers['x-api-key'] = apiKey
  }

  const res = await fetch(`${CMS_URL}/api/roaster/save-profile`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
