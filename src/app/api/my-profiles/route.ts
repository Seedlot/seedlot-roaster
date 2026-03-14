import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { cmsFetch } from '@/lib/cms-fetch'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ profiles: [] })
  }

  // roast-profiles has read: () => true, so public REST API works
  // Query by clerkId which matches the Clerk userId
  const res = await cmsFetch(
    `${CMS_URL}/api/roast-profiles?where[clerkId][equals]=${encodeURIComponent(userId)}&sort=-createdAt&limit=50&depth=0`,
  )

  if (!res.ok) {
    return NextResponse.json({ profiles: [] })
  }

  const data = await res.json()
  return NextResponse.json({ profiles: data.docs || [] })
}
