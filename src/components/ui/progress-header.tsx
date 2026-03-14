"use client"

import { TOTAL_STEPS } from '@/lib/constants'

const PHASE_LABELS: Record<number, string> = {
  1: "Welcome",
  2: "Photo",
  3: "Coffee",
  4: "Style",
  5: "Equipment",
  6: "API Key",
  7: "Profile",
  8: "Feedback",
}

export default function ProgressHeader({ step }: { step: number }) {
  if (step === 1) return null

  const phase = PHASE_LABELS[step]

  return (
    <div className="bg-white border-b border-grey-10 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <span className="text-xs font-medium text-grey-50 uppercase tracking-wider">
          {phase}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS - 1 }, (_, i) => i + 2).map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step ? "bg-accent" : s < step ? "bg-forest" : "bg-grey-20"
              }`}
            />
          ))}
          <span className="text-xs text-grey-40 ml-2">
            {step - 1}/{TOTAL_STEPS - 1}
          </span>
        </div>
      </div>
    </div>
  )
}
