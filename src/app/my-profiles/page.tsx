"use client"

import { useUser, SignIn } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type SavedProfile = {
  id: number
  profileName: string
  coffee: { origin: string; processingMethod: string }
  equipment: { batchSize: string }
  style: { flavorProfile: string }
  createdAt: string
}

export default function MyProfiles() {
  const { isSignedIn, isLoaded } = useUser()
  const [profiles, setProfiles] = useState<SavedProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSignedIn) return

    async function load() {
      try {
        const res = await fetch('/api/save-profile?mine=true')
        if (res.ok) {
          const data = await res.json()
          setProfiles(data.profiles || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isSignedIn])

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className="min-h-dvh bg-off-white flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading text-3xl text-charcoal uppercase tracking-wide mb-4">
            My Profiles
          </h1>
          <p className="text-grey-50 text-sm mb-6">Sign in to view your saved roast profiles.</p>
          <SignIn routing="hash" fallbackRedirectUrl="/my-profiles" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-off-white">
      <div className="bg-white border-b border-grey-10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-2xl text-charcoal uppercase tracking-wide">
            My Profiles
          </h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-accent text-forest font-bold text-sm uppercase tracking-wider hover:bg-accent-dark transition-colors"
          >
            New Profile
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-grey-50 text-sm text-center py-12">Loading profiles...</p>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-grey-50 text-sm mb-4">No saved profiles yet.</p>
            <Link href="/" className="text-accent underline text-sm hover:text-accent-dark">
              Build your first profile
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map(p => (
              <Link
                key={p.id}
                href={`/profile/${p.id}`}
                className="block bg-white p-4 rounded-xl border border-grey-10 hover:border-grey-20 transition-colors"
              >
                <div className="font-semibold text-charcoal">{p.profileName}</div>
                <div className="text-sm text-grey-50 mt-1">
                  {p.coffee?.origin} &middot; {p.coffee?.processingMethod} &middot; {p.equipment?.batchSize}g &middot; {p.style?.flavorProfile}
                </div>
                <div className="text-xs text-grey-40 mt-1">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
