"use client"

import { useState } from 'react'
import { FLAVOR_PROFILES, COMMON_NOTES } from '@/lib/constants'
import type { FlavorProfile } from '@/lib/types'

export default function DefineStyle({
  flavorProfile,
  targetNotes,
  avoidNotes,
  onFlavorProfileChange,
  onTargetNotesChange,
  onAvoidNotesChange,
}: {
  flavorProfile: FlavorProfile | null
  targetNotes: string
  avoidNotes: string
  onFlavorProfileChange: (v: FlavorProfile) => void
  onTargetNotesChange: (v: string) => void
  onAvoidNotesChange: (v: string) => void
}) {
  const [showTargetPicker, setShowTargetPicker] = useState(false)
  const [showAvoidPicker, setShowAvoidPicker] = useState(false)

  const addNote = (current: string, note: string, onChange: (v: string) => void) => {
    const notes = current ? current.split(', ') : []
    if (!notes.includes(note)) {
      onChange([...notes, note].join(', '))
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Define the Style
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          What flavors are you aiming for?
        </p>

        {/* Flavor Profile Cards */}
        <div className="space-y-3 mb-6">
          {FLAVOR_PROFILES.map(fp => (
            <button
              key={fp.id}
              onClick={() => onFlavorProfileChange(fp.id as FlavorProfile)}
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

        {/* Target notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-grey-70 mb-1">
            Specific notes to target <span className="text-grey-40">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={targetNotes}
              onChange={(e) => onTargetNotesChange(e.target.value)}
              onFocus={() => setShowTargetPicker(true)}
              onBlur={() => setTimeout(() => setShowTargetPicker(false), 200)}
              placeholder="e.g. Blueberry, Jasmine, Honey"
              className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {showTargetPicker && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-grey-20 rounded-xl shadow-lg p-3 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_NOTES.map(note => (
                    <button
                      key={note}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addNote(targetNotes, note, onTargetNotesChange)}
                      className="px-2.5 py-1 text-xs rounded-full border border-grey-20 hover:border-accent hover:bg-accent/5 transition-colors"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avoid notes */}
        <div>
          <label className="block text-sm font-medium text-grey-70 mb-1">
            Notes to avoid <span className="text-grey-40">(optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={avoidNotes}
              onChange={(e) => onAvoidNotesChange(e.target.value)}
              onFocus={() => setShowAvoidPicker(true)}
              onBlur={() => setTimeout(() => setShowAvoidPicker(false), 200)}
              placeholder="e.g. Smoky, Burnt, Astringent"
              className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {showAvoidPicker && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-grey-20 rounded-xl shadow-lg p-3 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5">
                  {['Smoky', 'Burnt', 'Astringent', 'Bitter', 'Sour', 'Baked', 'Flat', 'Rubbery', 'Fermented', 'Grassy', 'Papery', 'Woody'].map(note => (
                    <button
                      key={note}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addNote(avoidNotes, note, onAvoidNotesChange)}
                      className="px-2.5 py-1 text-xs rounded-full border border-grey-20 hover:border-terracotta hover:bg-terracotta/5 transition-colors"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
