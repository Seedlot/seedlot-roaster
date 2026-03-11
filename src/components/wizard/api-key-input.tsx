"use client"

import { useState } from 'react'

export default function ApiKeyInput({
  apiKey,
  keyValidated,
  onApiKeyChange,
  onKeyValidated,
}: {
  apiKey: string
  keyValidated: boolean
  onApiKeyChange: (v: string) => void
  onKeyValidated: (v: boolean) => void
}) {
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = async () => {
    if (!apiKey.startsWith('sk-ant-')) {
      setError('Key should start with sk-ant-')
      return
    }

    setValidating(true)
    setError(null)

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })
      const data = await res.json()
      if (data.valid) {
        onKeyValidated(true)
      } else {
        setError(data.error || 'Invalid key')
        onKeyValidated(false)
      }
    } catch {
      setError('Failed to validate key')
      onKeyValidated(false)
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Anthropic API Key
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          Your key is used to call Claude directly and is never stored.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grey-70 mb-1">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  onApiKeyChange(e.target.value)
                  onKeyValidated(false)
                  setError(null)
                }}
                placeholder="sk-ant-..."
                className="flex-1 px-4 py-3 rounded-xl border border-grey-20 bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={validate}
                disabled={!apiKey || validating}
                className="px-5 py-3 rounded-xl bg-forest text-white font-medium text-sm hover:bg-deep-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {validating ? 'Checking...' : keyValidated ? 'Valid' : 'Validate'}
              </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            {keyValidated && <p className="text-sm text-green-600 mt-1">Key validated successfully</p>}
          </div>

          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-accent underline hover:text-accent-dark"
          >
            Get an API key from console.anthropic.com
          </a>

          <div className="p-4 bg-grey-5 rounded-xl border border-grey-10">
            <h3 className="font-medium text-sm text-charcoal mb-2">Privacy</h3>
            <ul className="text-xs text-grey-50 space-y-1">
              <li>Your API key goes directly to Anthropic&apos;s API — it never touches our servers</li>
              <li>Keys are not stored, logged, or cached — they exist only during the request</li>
              <li>This tool is free — you only pay Anthropic for the API usage (typically ~$0.01 per profile)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
