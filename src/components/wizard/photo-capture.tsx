"use client"

import { useState, useRef, useCallback } from 'react'
import type { VisionAnalysis } from '@seedlot/roast-ui'

type PhotoCaptureProps = {
  onAnalysisComplete: (analysis: VisionAnalysis, apiKey: string) => void
  onSkip: () => void
  savedApiKey: string
}

export default function PhotoCapture({ onAnalysisComplete, onSkip }: PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('Photo must be under 10 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!photo) return

    setAnalyzing(true)
    setError(null)

    try {
      const res = await fetch('/api/analyze-green', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const analysis: VisionAnalysis = await res.json()
      onAnalysisComplete(analysis, '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze photo')
    } finally {
      setAnalyzing(false)
    }
  }, [photo, onAnalysisComplete])

  const handleRetake = useCallback(() => {
    setPhoto(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Coffee Label Photo
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          Take a photo of your green coffee label or bag for AI analysis, or skip to enter details manually.
        </p>

        {!photo ? (
          <div className="space-y-4">
            {/* Camera capture button */}
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-grey-20 rounded-2xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-grey-40 mb-3">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="text-sm font-medium text-grey-50">Tap to take a photo</span>
              <span className="text-xs text-grey-40 mt-1">or choose from gallery</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={onSkip}
              className="w-full py-3 text-sm text-grey-50 hover:text-charcoal transition-colors"
              type="button"
            >
              Skip — I'll enter details manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Photo preview */}
            <div className="relative rounded-2xl overflow-hidden bg-grey-5">
              <img
                src={photo}
                alt="Coffee label"
                className="w-full h-56 object-cover"
              />
              <button
                onClick={handleRetake}
                className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-white/90 rounded-lg shadow-sm hover:bg-white transition-colors"
                type="button"
              >
                Retake
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full py-3.5 rounded-xl bg-accent text-forest font-bold text-sm uppercase tracking-wider hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Reading label with Gemini...
                </span>
              ) : (
                'Analyze Label'
              )}
            </button>

            <button
              onClick={onSkip}
              className="w-full py-2 text-sm text-grey-50 hover:text-charcoal transition-colors"
              type="button"
            >
              Skip analysis — enter details manually
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
