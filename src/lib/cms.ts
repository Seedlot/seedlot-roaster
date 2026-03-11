import type { WizardState, RoastProfile, CuppingScores } from './types'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.seedlot.io'

export async function saveProfile(
  state: WizardState,
  profile: RoastProfile,
  sessionId: string,
  generationTimeMs: number,
  authToken?: string,
): Promise<{ profileId: number }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  } else {
    headers['x-api-key'] = process.env.CMS_API_KEY || ''
  }

  const res = await fetch(`${CMS_URL}/api/roaster/save-profile`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      sessionId,
      profileName: profile.name,
      coffee: {
        origin: state.origin,
        region: state.region || undefined,
        altitude: state.altitude ? Number(state.altitude) : undefined,
        processingMethod: state.processingMethod || undefined,
        moisture: state.moisture ? Number(state.moisture) : undefined,
        variety: state.variety || undefined,
      },
      style: {
        flavorProfile: state.flavorProfile || undefined,
        targetNotes: state.targetNotes || undefined,
        avoidNotes: state.avoidNotes || undefined,
      },
      equipment: {
        roaster: 'roest',
        batchSize: state.batchSize || undefined,
      },
      generatedProfile: profile,
      curveData: profile.curve,
      machineSettings: {
        power: profile.settings.power,
        fan: profile.settings.fan,
        drumRPM: profile.settings.drumRPM,
        chargeTemp: profile.chargeTemp,
        endTemp: profile.endTemp,
        predictedTotalTime: profile.predictedTotalTime,
        predictedDTR: profile.predictedDTR,
      },
      aiModel: 'claude-sonnet-4-6',
      promptVersion: 'v1.0.0',
      generationTimeMs,
    }),
  })

  if (!res.ok) throw new Error('Failed to save profile')
  return res.json()
}

export async function saveResult(
  profileId: number,
  sessionId: string,
  actuals: { firstCrackTime?: string; endTemp?: number; totalTime?: string; actualDTR?: number },
  cupping: CuppingScores,
  feedback: { overallImpression?: string; wouldUseAgain?: boolean; modifications?: string },
  authToken?: string,
): Promise<{ resultId: number }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  } else {
    headers['x-api-key'] = process.env.CMS_API_KEY || ''
  }

  const totalScore = Object.values(cupping).reduce((sum, v) => sum + (v || 0), 0)

  const res = await fetch(`${CMS_URL}/api/roaster/save-result`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      profileId,
      sessionId,
      actuals,
      cupping: { ...cupping, totalScore },
      ...feedback,
    }),
  })

  if (!res.ok) throw new Error('Failed to save result')
  return res.json()
}

export async function trackSession(
  sessionId: string,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...data }),
    })
  } catch {
    // Analytics tracking is best-effort
  }
}
