import { Metadata } from 'next'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

type ProfileData = {
  id: number
  profileName: string
  coffee: { origin: string; region?: string; processingMethod?: string; altitude?: number; variety?: string }
  style: { flavorProfile?: string }
  equipment: { batchSize?: string }
  generatedProfile: {
    name: string
    curve: { time: string; tempC: number; phase: string }[]
    settings: { power: number; fan: number; drumRPM: number }
    chargeTemp: number
    endTemp: number
    predictedTotalTime: string
    predictedFirstCrack: string
    predictedDTR: number
    checklist: { phase: string; items: string[] }[]
    notes: string[]
  }
}

async function getProfile(id: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/roast-profiles/${id}?depth=0`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const profile = await getProfile(id)
  if (!profile) return { title: 'Profile Not Found' }

  return {
    title: `${profile.profileName} — Seedlot Roaster`,
    description: `AI-generated roast profile for ${profile.coffee?.origin || 'coffee'}`,
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile(id)

  if (!profile || !profile.generatedProfile) {
    return (
      <div className="min-h-dvh bg-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-charcoal uppercase mb-2">Profile Not Found</h1>
          <p className="text-grey-50 text-sm">This profile may have been removed or the link is invalid.</p>
        </div>
      </div>
    )
  }

  const gp = profile.generatedProfile

  return (
    <div className="min-h-dvh bg-off-white">
      <div className="bg-white border-b border-grey-10 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-2xl text-charcoal uppercase tracking-wide">
            {gp.name}
          </h1>
          <p className="text-grey-50 text-sm">
            {profile.coffee?.origin}{profile.coffee?.region ? ` — ${profile.coffee.region}` : ''} &middot; {profile.equipment?.batchSize}g
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Charge', value: `${gp.chargeTemp}°C` },
            { label: 'FC', value: gp.predictedFirstCrack },
            { label: 'End', value: `${gp.endTemp}°C` },
            { label: 'DTR', value: `${gp.predictedDTR}%` },
          ].map(m => (
            <div key={m.label} className="bg-white p-3 rounded-xl border border-grey-10 text-center">
              <div className="text-xs text-grey-50">{m.label}</div>
              <div className="font-heading text-lg text-charcoal">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Curve table */}
        <div className="bg-white rounded-xl border border-grey-10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-grey-5 border-b border-grey-10">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Temp (°C)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-grey-50">Phase</th>
              </tr>
            </thead>
            <tbody>
              {gp.curve.map((p, i) => (
                <tr key={i} className="border-b border-grey-10 last:border-0">
                  <td className="px-4 py-2 font-mono">{p.time}</td>
                  <td className="px-4 py-2 font-mono">{p.tempC}°C</td>
                  <td className="px-4 py-2 text-grey-60">{p.phase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Settings */}
        <div className="bg-white p-4 rounded-xl border border-grey-10">
          <h3 className="font-medium text-sm text-charcoal mb-3">Machine Settings</h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <div className="font-heading text-2xl text-forest">{gp.settings.power}%</div>
              <div className="text-xs text-grey-50">Power</div>
            </div>
            <div>
              <div className="font-heading text-2xl text-forest">{gp.settings.fan}%</div>
              <div className="text-xs text-grey-50">Fan</div>
            </div>
            <div>
              <div className="font-heading text-2xl text-forest">{gp.settings.drumRPM}</div>
              <div className="text-xs text-grey-50">Drum RPM</div>
            </div>
            <div>
              <div className="font-heading text-2xl text-forest">{gp.predictedTotalTime}</div>
              <div className="text-xs text-grey-50">Total Time</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {gp.notes.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-grey-10">
            <h3 className="font-medium text-sm text-charcoal mb-2">Notes</h3>
            <ul className="space-y-1">
              {gp.notes.map((n, i) => (
                <li key={i} className="text-sm text-grey-60">- {n}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-grey-40 text-center pt-4">
          Generated by <a href="https://roast.seedlot.io" className="underline">Seedlot Roaster</a> — AI-powered roast profiles for ROEST
        </p>
      </div>
    </div>
  )
}
