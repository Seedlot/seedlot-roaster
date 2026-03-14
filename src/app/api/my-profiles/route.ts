import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { cmsFetch } from '@/lib/cms-fetch'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ profiles: [] })
  }

  // First find the CMS user by clerkId, then query profiles by userId relationship
  const userRes = await cmsFetch(
    `${CMS_URL}/api/users?where[clerkId][equals]=${encodeURIComponent(userId)}&limit=1&depth=0`,
  )

  if (!userRes.ok) {
    return NextResponse.json({ profiles: [] })
  }

  const userData = await userRes.json()
  const cmsUserId = userData.docs?.[0]?.id
  if (!cmsUserId) {
    return NextResponse.json({ profiles: [] })
  }

  const res = await cmsFetch(
    `${CMS_URL}/api/roast-profiles?where[userId][equals]=${cmsUserId}&sort=-createdAt&limit=50&depth=0`,
  )

  if (!res.ok) {
    return NextResponse.json({ profiles: [] })
  }

  const data = await res.json()
  return NextResponse.json({ profiles: data.docs || [] })
}
