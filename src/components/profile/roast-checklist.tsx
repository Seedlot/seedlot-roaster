"use client"

import { useState } from 'react'

export default function RoastChecklist({
  checklist,
}: {
  checklist: { phase: string; items: string[] }[]
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
      <h3 className="font-medium text-sm text-charcoal mb-3">During-Roast Checklist</h3>
      <div className="space-y-3">
        {checklist.map((phase) => (
          <div key={phase.phase}>
            <div className="text-xs font-medium text-grey-50 uppercase tracking-wider mb-1.5">
              {phase.phase}
            </div>
            <div className="space-y-1">
              {phase.items.map((item, i) => {
                const key = `${phase.phase}-${i}`
                return (
                  <label key={key} className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked.has(key)}
                      onChange={() => toggle(key)}
                      className="accent-accent w-4 h-4 mt-0.5 shrink-0"
                    />
                    <span className={`text-sm ${checked.has(key) ? 'text-grey-40 line-through' : 'text-grey-60'} group-hover:text-charcoal transition-colors`}>
                      {item}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
