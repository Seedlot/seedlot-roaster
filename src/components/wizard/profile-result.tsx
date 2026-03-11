"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import type { WizardState, RoastProfile } from '@/lib/types'
import { parseProfile } from '@/lib/profile-parser'
import { toRoestJSON, profileToClipboard } from '@/lib/roest-export'
import TemperatureCurve from '@/components/profile/temperature-curve'
import MachineSettings from '@/components/profile/machine-settings'
import RoastChecklist from '@/components/profile/roast-checklist'

export default function ProfileResult({
  state,
  onProfileGenerated,
  onError,
}: {
  state: WizardState
  onProfileGenerated: (profile: RoastProfile) => void
  onError: (error: string) => void
}) {
  const [streamText, setStreamText] = useState('')
  const [done, setDone] = useState(false)
  const [profile, setProfile] = useState<RoastProfile | null>(state.generatedProfile)
  const [copied, setCopied] = useState(false)
  const generatingRef = useRef(false)

  const generate = useCallback(async () => {
    if (generatingRef.current) return
    generatingRef.current = true

    setStreamText('')
    setDone(false)
    setProfile(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: state.apiKey, wizardState: state }),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done: readerDone, value } = await reader.read()
        if (readerDone) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.error) {
            onError(data.error)
            return
          }

          if (data.text) {
            fullText += data.text
            setStreamText(fullText)
          }

          if (data.done) {
            try {
              const parsed = parseProfile(fullText)
              setProfile(parsed)
              onProfileGenerated(parsed)
            } catch (e) {
              onError(`Failed to parse profile: ${e instanceof Error ? e.message : 'Unknown error'}`)
            }
          }
        }
      }

      setDone(true)
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      generatingRef.current = false
    }
  }, [state, onProfileGenerated, onError])

  useEffect(() => {
    if (!state.generatedProfile) {
      generate()
    } else {
      setProfile(state.generatedProfile)
      setDone(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportJSON = () => {
    if (!profile) return
    const json = toRoestJSON(profile, state.batchSize || '50')
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!profile) return
    await navigator.clipboard.writeText(profileToClipboard(profile))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()

  const handleRegenerate = () => {
    generatingRef.current = false
    generate()
  }

  // Streaming state
  if (!profile && !done) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
            Building Your Profile
          </h2>
          <p className="text-grey-50 text-sm text-center mb-6">
            Claude is analyzing your coffee and generating an optimized roast curve...
          </p>

          <div className="bg-grey-90 text-green-400 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">
            {streamText || 'Connecting...'}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          {profile.name}
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          {state.batchSize === '200' ? 'Inlet temperature' : 'Air temperature'} profile for {state.batchSize}g batch
        </p>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Charge', value: `${profile.chargeTemp}°C` },
            { label: 'FC', value: profile.predictedFirstCrack },
            { label: 'End', value: `${profile.endTemp}°C` },
            { label: 'DTR', value: `${profile.predictedDTR}%` },
          ].map(m => (
            <div key={m.label} className="bg-white p-3 rounded-xl border border-grey-10 text-center">
              <div className="text-xs text-grey-50">{m.label}</div>
              <div className="font-heading text-lg text-charcoal">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Temperature Curve Chart */}
        <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
          <TemperatureCurve curve={profile.curve} />
        </div>

        {/* Curve Data Table */}
        <div className="bg-white rounded-xl border border-grey-10 mb-4 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-grey-5 border-b border-grey-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Temp (°C)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Phase</th>
              </tr>
            </thead>
            <tbody>
              {profile.curve.map((p, i) => (
                <tr key={i} className="border-b border-grey-10 last:border-0">
                  <td className="px-4 py-2 font-mono">{p.time}</td>
                  <td className="px-4 py-2 font-mono">{p.tempC}°C</td>
                  <td className="px-4 py-2 text-grey-60">{p.phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Machine Settings */}
        <MachineSettings
          settings={profile.settings}
          totalTime={profile.predictedTotalTime}
        />

        {/* Checklist */}
        <RoastChecklist checklist={profile.checklist} />

        {/* Notes */}
        {profile.notes.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
            <h3 className="font-medium text-sm text-charcoal mb-2">Development Notes</h3>
            <ul className="space-y-1">
              {profile.notes.map((n, i) => (
                <li key={i} className="text-sm text-grey-60 flex gap-2">
                  <span className="text-grey-30">-</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 no-print">
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 rounded-lg border border-grey-20 text-sm text-grey-60 hover:bg-grey-5 transition-colors"
          >
            Regenerate
          </button>
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-lg border border-grey-20 text-sm text-grey-60 hover:bg-grey-5 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg border border-grey-20 text-sm text-grey-60 hover:bg-grey-5 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg border border-grey-20 text-sm text-grey-60 hover:bg-grey-5 transition-colors"
          >
            Print View
          </button>
        </div>
      </div>
    </div>
  )
}
