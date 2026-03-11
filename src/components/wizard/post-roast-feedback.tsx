"use client"

import { useState } from 'react'
import type { CuppingScores } from '@/lib/types'

const CUPPING_ATTRS: { key: keyof CuppingScores; label: string }[] = [
  { key: 'fragrance', label: 'Fragrance/Aroma' },
  { key: 'flavor', label: 'Flavor' },
  { key: 'aftertaste', label: 'Aftertaste' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'body', label: 'Body' },
  { key: 'balance', label: 'Balance' },
  { key: 'uniformity', label: 'Uniformity' },
  { key: 'sweetness', label: 'Sweetness' },
]

export default function PostRoastFeedback({
  onSubmit,
}: {
  onSubmit: (data: {
    actuals: { firstCrackTime: string; endTemp: string; totalTime: string; actualDTR: string }
    cupping: CuppingScores
    overallImpression: string
    wouldUseAgain: boolean
    modifications: string
  }) => void
}) {
  const [actuals, setActuals] = useState({ firstCrackTime: '', endTemp: '', totalTime: '', actualDTR: '' })
  const [cupping, setCupping] = useState<CuppingScores>({
    fragrance: 7, flavor: 7, aftertaste: 7, acidity: 7,
    body: 7, balance: 7, uniformity: 7, sweetness: 7,
  })
  const [overallImpression, setOverallImpression] = useState('')
  const [wouldUseAgain, setWouldUseAgain] = useState(true)
  const [modifications, setModifications] = useState('')

  const totalScore = Object.values(cupping).reduce((sum, v) => sum + v, 0)

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Post-Roast Feedback
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          How did the roast go? Your feedback improves future profiles.
        </p>

        {/* Actual metrics */}
        <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
          <h3 className="font-medium text-sm text-charcoal mb-3">Actual Roast Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-grey-50 mb-1">First Crack Time</label>
              <input
                type="text"
                value={actuals.firstCrackTime}
                onChange={(e) => setActuals(a => ({ ...a, firstCrackTime: e.target.value }))}
                placeholder="e.g. 5:15"
                className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-grey-50 mb-1">End Temperature</label>
              <input
                type="text"
                value={actuals.endTemp}
                onChange={(e) => setActuals(a => ({ ...a, endTemp: e.target.value }))}
                placeholder="e.g. 210"
                className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-grey-50 mb-1">Total Time</label>
              <input
                type="text"
                value={actuals.totalTime}
                onChange={(e) => setActuals(a => ({ ...a, totalTime: e.target.value }))}
                placeholder="e.g. 6:05"
                className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-grey-50 mb-1">Actual DTR %</label>
              <input
                type="text"
                value={actuals.actualDTR}
                onChange={(e) => setActuals(a => ({ ...a, actualDTR: e.target.value }))}
                placeholder="e.g. 13.8"
                className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Cupping scores */}
        <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm text-charcoal">SCA Cupping Scores</h3>
            <span className="font-heading text-lg text-charcoal">{totalScore}/80</span>
          </div>
          <div className="space-y-3">
            {CUPPING_ATTRS.map(attr => (
              <div key={attr.key} className="flex items-center gap-3">
                <span className="text-sm text-grey-60 w-32 shrink-0">{attr.label}</span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={cupping[attr.key]}
                  onChange={(e) => setCupping(c => ({ ...c, [attr.key]: Number(e.target.value) }))}
                  className="flex-1 accent-accent"
                />
                <span className="text-sm font-mono w-6 text-right">{cupping[attr.key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">Overall Impression</label>
            <textarea
              value={overallImpression}
              onChange={(e) => setOverallImpression(e.target.value)}
              rows={3}
              placeholder="How did it taste? What stood out?"
              className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="wouldUseAgain"
              checked={wouldUseAgain}
              onChange={(e) => setWouldUseAgain(e.target.checked)}
              className="accent-accent w-4 h-4"
            />
            <label htmlFor="wouldUseAgain" className="text-sm text-grey-60">I would use this profile again</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">Modifications for Next Time</label>
            <textarea
              value={modifications}
              onChange={(e) => setModifications(e.target.value)}
              rows={2}
              placeholder="e.g. Drop 5°C earlier, extend development by 10 sec"
              className="w-full px-3 py-2 rounded-lg border border-grey-20 text-sm resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => onSubmit({ actuals, cupping, overallImpression, wouldUseAgain, modifications })}
          className="w-full py-3 rounded-xl bg-accent text-forest font-bold text-sm uppercase tracking-wider hover:bg-accent-dark transition-colors"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  )
}
