"use client"

import { useState, useMemo } from 'react'
import { ORIGINS, PROCESSING_METHODS, VARIETIES } from '@/lib/constants'
import type { ProcessingMethod } from '@/lib/types'

export default function DescribeCoffee({
  origin,
  region,
  altitude,
  processingMethod,
  moisture,
  variety,
  onOriginChange,
  onRegionChange,
  onAltitudeChange,
  onProcessingChange,
  onMoistureChange,
  onVarietyChange,
}: {
  origin: string | null
  region: string
  altitude: string
  processingMethod: ProcessingMethod | null
  moisture: string
  variety: string
  onOriginChange: (v: string) => void
  onRegionChange: (v: string) => void
  onAltitudeChange: (v: string) => void
  onProcessingChange: (v: ProcessingMethod) => void
  onMoistureChange: (v: string) => void
  onVarietyChange: (v: string) => void
}) {
  const [originSearch, setOriginSearch] = useState('')
  const [showOrigins, setShowOrigins] = useState(false)

  const filteredOrigins = useMemo(() => {
    if (!originSearch) return ORIGINS
    return ORIGINS.filter(o => o.toLowerCase().includes(originSearch.toLowerCase()))
  }, [originSearch])

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Describe Your Coffee
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          Tell us about the green coffee you&apos;re roasting.
        </p>

        <div className="space-y-4">
          {/* Origin */}
          <div className="relative">
            <label className="block text-sm font-medium text-grey-70 mb-1">Origin Country *</label>
            <input
              type="text"
              value={origin || originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value)
                setShowOrigins(true)
                if (origin) onOriginChange('')
              }}
              onFocus={() => setShowOrigins(true)}
              placeholder="Search countries..."
              className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {showOrigins && !origin && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-grey-20 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredOrigins.map(o => (
                  <button
                    key={o}
                    onClick={() => {
                      onOriginChange(o)
                      setOriginSearch('')
                      setShowOrigins(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-grey-5 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {o}
                  </button>
                ))}
                {filteredOrigins.length === 0 && (
                  <div className="px-4 py-2 text-sm text-grey-40">No matches — type to use custom origin</div>
                )}
              </div>
            )}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">Region / Farm Name <span className="text-grey-40">(optional)</span></label>
            <input
              type="text"
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              placeholder="e.g. Yirgacheffe, Huila, Nyeri"
              className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Altitude + Moisture side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-grey-70 mb-1">Altitude (MASL)</label>
              <input
                type="number"
                value={altitude}
                onChange={(e) => onAltitudeChange(e.target.value)}
                placeholder="e.g. 1800"
                className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <p className="text-xs text-grey-40 mt-1">Higher = denser = more heat needed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-grey-70 mb-1">Moisture %</label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => onMoistureChange(e.target.value)}
                placeholder="e.g. 10.5"
                className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <p className="text-xs text-grey-40 mt-1">Typical range: 10-12%</p>
            </div>
          </div>

          {/* Processing */}
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">Processing Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROCESSING_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => onProcessingChange(m.id as ProcessingMethod)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    processingMethod === m.id
                      ? 'border-accent bg-accent/5 ring-2 ring-accent'
                      : 'border-grey-20 bg-white hover:border-grey-30'
                  }`}
                >
                  <div className="font-semibold text-sm text-charcoal">{m.label}</div>
                  <div className="text-xs text-grey-50 mt-0.5">{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Variety */}
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">Variety <span className="text-grey-40">(optional)</span></label>
            <select
              value={variety}
              onChange={(e) => onVarietyChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">Select variety...</option>
              {VARIETIES.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
