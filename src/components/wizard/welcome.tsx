"use client"

import { useUser, SignIn } from '@clerk/nextjs'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type SavedProfile = {
  id: number
  profileName: string
  coffee: { origin: string; processingMethod?: string }
  equipment: { batchSize?: string }
  style: { flavorProfile?: string }
  createdAt: string
}

type RoasterType = 'professional' | 'hobby'

export default function Welcome({ onNext }: { onNext: () => void }) {
  const { isSignedIn, isLoaded, user } = useUser()
  const [roasterType, setRoasterType] = useState<RoasterType | null | undefined>(undefined)
  const [profiles, setProfiles] = useState<SavedProfile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [view, setView] = useState<'home' | 'profiles'>('home')
  const [saving, setSaving] = useState(false)

  // Fetch user profile from CMS to check roasterType
  useEffect(() => {
    if (!isSignedIn) return
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.roasterType) {
          setRoasterType(data.roasterType)
        } else {
          setRoasterType(null) // needs to pick
        }
      })
      .catch(() => setRoasterType(null))
  }, [isSignedIn])

  // Fetch profiles when viewing them
  const loadProfiles = useCallback(() => {
    setLoadingProfiles(true)
    fetch('/api/my-profiles')
      .then(r => r.json())
      .then(data => setProfiles(data.profiles || []))
      .catch(() => setProfiles([]))
      .finally(() => setLoadingProfiles(false))
  }, [])

  const handlePickRoasterType = async (type: RoasterType) => {
    setSaving(true)
    try {
      await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roasterType: type }),
      })
      setRoasterType(type)
    } catch {
      // still set locally
      setRoasterType(type)
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (!isLoaded || (isSignedIn && roasterType === undefined)) {
    return (
      <div className="px-4 py-12 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse text-grey-40 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  // Not signed in → welcome + Clerk
  if (!isSignedIn) {
    return (
      <div className="px-4 py-12 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-xs font-medium text-accent bg-forest px-3 py-1 rounded-full uppercase tracking-wider">
              Free Tool
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl text-charcoal uppercase tracking-wide mb-4">
            AI-Powered Roast Profiles<br />for ROEST
          </h1>

          <p className="text-grey-50 text-lg mb-8 max-w-xl mx-auto">
            Describe your coffee, choose a flavor target, and let AI build an optimized
            roast curve for your ROEST sample roaster.
          </p>

          <SignIn
            routing="hash"
            fallbackRedirectUrl="/"
            appearance={{
              elements: { rootBox: 'mx-auto', card: 'shadow-none' },
            }}
          />

          <div className="mt-12 grid grid-cols-3 gap-6 text-left">
            <div>
              <div className="font-heading text-xl text-charcoal uppercase mb-1">Describe</div>
              <p className="text-grey-50 text-sm">Enter your coffee&apos;s origin, processing, and flavor target.</p>
            </div>
            <div>
              <div className="font-heading text-xl text-charcoal uppercase mb-1">Generate</div>
              <p className="text-grey-50 text-sm">AI builds an optimized 9-point roast curve with settings.</p>
            </div>
            <div>
              <div className="font-heading text-xl text-charcoal uppercase mb-1">Roast</div>
              <p className="text-grey-50 text-sm">Export to ROEST, follow the checklist, log your results.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Signed in but no roasterType → quick picker
  if (roasterType === null) {
    return (
      <div className="px-4 py-12 sm:px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-heading text-3xl text-charcoal uppercase tracking-wide mb-2">
            Welcome, {user?.firstName || 'Roaster'}
          </h2>
          <p className="text-grey-50 text-sm mb-8">
            One quick question before we start.
          </p>

          <p className="text-charcoal font-medium mb-4">Are you a...</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handlePickRoasterType('professional')}
              disabled={saving}
              className="p-6 rounded-2xl border-2 border-grey-20 hover:border-accent hover:bg-accent/5 transition-colors text-center disabled:opacity-50"
            >
              <div className="font-heading text-2xl text-charcoal uppercase mb-1">Professional</div>
              <p className="text-grey-50 text-xs">Roasting commercially or at a roastery</p>
            </button>
            <button
              onClick={() => handlePickRoasterType('hobby')}
              disabled={saving}
              className="p-6 rounded-2xl border-2 border-grey-20 hover:border-accent hover:bg-accent/5 transition-colors text-center disabled:opacity-50"
            >
              <div className="font-heading text-2xl text-charcoal uppercase mb-1">Hobby</div>
              <p className="text-grey-50 text-xs">Roasting at home or learning</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // My Profiles view
  if (view === 'profiles') {
    return (
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl text-charcoal uppercase tracking-wide">
              My Profiles
            </h2>
            <button
              onClick={() => setView('home')}
              className="text-sm text-grey-50 hover:text-charcoal transition-colors"
            >
              Back
            </button>
          </div>

          {loadingProfiles ? (
            <p className="text-grey-50 text-sm text-center py-12">Loading profiles...</p>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-grey-50 text-sm mb-4">No saved profiles yet.</p>
              <button
                onClick={() => { setView('home') }}
                className="text-accent underline text-sm hover:text-accent-dark"
              >
                Design your first profile
              </button>
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
                    {p.coffee?.origin}
                    {p.coffee?.processingMethod && <> &middot; {p.coffee.processingMethod}</>}
                    {p.equipment?.batchSize && <> &middot; {p.equipment.batchSize}g</>}
                    {p.style?.flavorProfile && <> &middot; {p.style.flavorProfile}</>}
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

  // Home screen — signed in + roasterType set
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-grey-50 text-sm mb-2">
          Welcome back, {user?.firstName || 'Roaster'}
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl text-charcoal uppercase tracking-wide mb-8">
          Seedlot Roaster
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={onNext}
            className="p-8 rounded-2xl bg-accent text-forest hover:bg-accent-dark transition-colors text-center"
          >
            <div className="font-heading text-2xl uppercase mb-1">Design Profile</div>
            <p className="text-forest/70 text-sm">Create a new roast profile with AI</p>
          </button>

          <button
            onClick={() => { setView('profiles'); loadProfiles() }}
            className="p-8 rounded-2xl border-2 border-grey-20 hover:border-grey-30 transition-colors text-center"
          >
            <div className="font-heading text-2xl text-charcoal uppercase mb-1">My Profiles</div>
            <p className="text-grey-50 text-sm">View your saved profiles</p>
          </button>
        </div>

        <p className="mt-12 text-xs text-grey-40">
          Powered by Seedlot &middot; AI roast profiles for ROEST sample roasters
        </p>
      </div>
    </div>
  )
}
