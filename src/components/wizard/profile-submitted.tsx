"use client"

import { useState, useEffect } from 'react'
import type { WizardState } from '@/lib/types'
import { FLAVOR_PROFILES } from '@/lib/constants'

export default function ProfileSubmitted({
  state,
  sessionId,
}: {
  state: WizardState
  sessionId: string
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const flavorInfo = FLAVOR_PROFILES.find(f => f.id === state.flavorProfile)

  // Auto-submit on mount
  useEffect(() => {
    if (saved || saving) return

    async function submit() {
      setSaving(true)
      setError(null)
      try {
        const profileName = [
          'SEEDLOT:AI',
          state.origin,
          state.processingMethod,
          flavorInfo?.label,
          state.batchSize ? `${state.batchSize}g` : '',
        ].filter(Boolean).join(' ')

        const res = await fetch('/api/save-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            profileName,
            coffee: {
              origin: state.origin,
              region: state.region || undefined,
              altitude: state.altitude ? Number(state.altitude) : undefined,
              processingMethod: state.processingMethod || undefined,
              moisture: state.moisture ? Number(state.moisture) : undefined,
              variety: state.variety || undefined,
            },
            style: {
              flavorProfile: state.flavorProfile || undefined,
              targetNotes: state.targetNotes.join(', ') || undefined,
              avoidNotes: state.avoidNotes.join(', ') || undefined,
            },
            equipment: { roaster: 'roest', batchSize: state.batchSize },
            visionAnalysis: state.visionAnalysis || undefined,
            flavorWheelSelections: {
              target: state.targetNotes,
              avoided: state.avoidNotes,
            },
            source: 'roaster',
          }),
        })
        if (!res.ok) throw new Error('Failed to save')
        setSaved(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit profile')
      } finally {
        setSaving(false)
      }
    }

    submit()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {saving && (
          <div className="text-center py-12">
            <div className="animate-pulse text-grey-50 text-sm">Submitting your roast preferences...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <h2 className="font-heading text-2xl text-charcoal uppercase tracking-wide mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => { setSaved(false); setError(null) }}
              className="px-6 py-3 rounded-xl bg-forest text-white font-medium text-sm hover:bg-deep-green transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {saved && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide mb-2">
                Profile Submitted
              </h2>
              <p className="text-grey-50 text-sm max-w-md mx-auto">
                The Seedlot bot is generating your roast profile — we&apos;ll email you when it&apos;s ready.
              </p>
            </div>

            {/* Summary of what was submitted */}
            <div className="space-y-3 mb-8">
              <div className="bg-white p-4 rounded-xl border border-grey-10">
                <h3 className="font-medium text-sm text-charcoal mb-3">Your Coffee</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-grey-50">Origin</div>
                  <div className="text-charcoal font-medium">{state.origin}{state.region ? ` — ${state.region}` : ''}</div>
                  {state.altitude && (
                    <>
                      <div className="text-grey-50">Altitude</div>
                      <div className="text-charcoal">{state.altitude} MASL</div>
                    </>
                  )}
                  {state.processingMethod && (
                    <>
                      <div className="text-grey-50">Processing</div>
                      <div className="text-charcoal capitalize">{state.processingMethod}</div>
                    </>
                  )}
                  {state.moisture && (
                    <>
                      <div className="text-grey-50">Moisture</div>
                      <div className="text-charcoal">{state.moisture}%</div>
                    </>
                  )}
                  {state.variety && (
                    <>
                      <div className="text-grey-50">Variety</div>
                      <div className="text-charcoal">{state.variety}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-grey-10">
                <h3 className="font-medium text-sm text-charcoal mb-3">Roast Target</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-grey-50">Flavor Profile</div>
                  <div className="text-charcoal font-medium">{flavorInfo?.label || state.flavorProfile}</div>
                  <div className="text-grey-50">DTR Range</div>
                  <div className="text-charcoal">{flavorInfo?.dtr || '-'}</div>
                  <div className="text-grey-50">Batch Size</div>
                  <div className="text-charcoal">{state.batchSize}g</div>
                  {state.batchSize === '200' && (
                    <>
                      <div className="text-grey-50">Profile Type</div>
                      <div className="text-charcoal">Inlet Temperature</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/"
                className="inline-block px-6 py-3 rounded-xl bg-forest text-white font-bold text-sm uppercase tracking-wider hover:bg-deep-green transition-colors"
              >
                View My Profiles
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
