import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function GET() {
  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const res = await fetch(`${CMS_URL}/api/roaster/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(req: NextRequest) {
  const { getToken } = await auth()
  const token = await getToken()
  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const body = await req.json()
  const res = await fetch(`${CMS_URL}/api/roaster/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
