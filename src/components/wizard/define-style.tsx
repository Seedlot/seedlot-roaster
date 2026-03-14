"use client"

import { useState, useCallback } from 'react'
import { FlavorWheel, FLAVOR_PROFILES, getNoteLabel } from '@seedlot/roast-ui'
import type { FlavorProfile } from '@seedlot/roast-ui'

export default function DefineStyle({
  flavorProfile,
  selectedNotes,
  avoidedNotes,
  onFlavorProfileChange,
  onSelectionChange,
}: {
  flavorProfile: FlavorProfile | null
  selectedNotes: string[]
  avoidedNotes: string[]
  onFlavorProfileChange: (v: FlavorProfile) => void
  onSelectionChange: (selected: string[], avoided: string[]) => void
}) {
  const [showWheel, setShowWheel] = useState(false)

  const handleToggleWheel = useCallback(() => {
    setShowWheel(prev => !prev)
  }, [])

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Define the Style
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          Choose a flavor direction, then fine-tune with the flavor wheel.
        </p>

        {/* Flavor Profile Cards */}
        <div className="space-y-3 mb-6">
          {FLAVOR_PROFILES.map(fp => (
            <button
              key={fp.id}
              onClick={() => onFlavorProfileChange(fp.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                flavorProfile === fp.id ? fp.activeColor : fp.color
              }`}
            >
              <div>
                <div className="font-semibold text-charcoal">{fp.label}</div>
                <div className="text-sm text-grey-50">{fp.description}</div>
              </div>
              <div className="text-xs text-grey-40 font-mono whitespace-nowrap ml-4">
                DTR {fp.dtr}
              </div>
            </button>
          ))}
        </div>

        {/* Flavor Wheel Toggle */}
        <div className="mb-4">
          <button
            onClick={handleToggleWheel}
            className="w-full py-3 rounded-xl border-2 border-dashed border-grey-20 text-sm font-medium text-grey-60 hover:border-accent hover:text-charcoal transition-colors flex items-center justify-center gap-2"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-grey-40">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </svg>
            {showWheel ? 'Hide Flavor Wheel' : 'Fine-tune with Flavor Wheel'}
            {(selectedNotes.length > 0 || avoidedNotes.length > 0) && (
              <span className="text-xs text-accent ml-1">
                ({selectedNotes.length} target, {avoidedNotes.length} avoid)
              </span>
            )}
          </button>
        </div>

        {/* Flavor Wheel */}
        {showWheel && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-grey-10">
            <FlavorWheel
              selectedNotes={selectedNotes}
              avoidedNotes={avoidedNotes}
              onSelectionChange={onSelectionChange}
              maxSelections={5}
            />
          </div>
        )}

        {/* Selected notes summary (shown when wheel is hidden) */}
        {!showWheel && (selectedNotes.length > 0 || avoidedNotes.length > 0) && (
          <div className="space-y-2">
            {selectedNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-grey-50 mr-1 self-center">Target:</span>
                {selectedNotes.map(id => (
                  <span key={id} className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
                    + {getNoteLabel(id)}
                  </span>
                ))}
              </div>
            )}
            {avoidedNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-grey-50 mr-1 self-center">Avoid:</span>
                {avoidedNotes.map(id => (
                  <span key={id} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 border border-red-200">
                    - {getNoteLabel(id)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
