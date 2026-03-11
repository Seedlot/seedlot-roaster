import type { RoastProfile } from './types'

export function parseProfile(text: string): RoastProfile {
  // Extract JSON from response — handle markdown code blocks
  let jsonStr = text.trim()

  // Remove markdown code fences if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }

  const parsed = JSON.parse(jsonStr)

  // Validate required fields
  if (!parsed.name || !Array.isArray(parsed.curve) || parsed.curve.length !== 9) {
    throw new Error('Invalid profile: must have a name and exactly 9 curve points')
  }

  if (!parsed.settings?.power || !parsed.settings?.fan || !parsed.settings?.drumRPM) {
    throw new Error('Invalid profile: missing machine settings')
  }

  return {
    name: parsed.name,
    curve: parsed.curve.map((p: { time: string; tempC: number; phase: string }) => ({
      time: p.time,
      tempC: p.tempC,
      phase: p.phase,
    })),
    settings: {
      power: parsed.settings.power,
      fan: parsed.settings.fan,
      drumRPM: parsed.settings.drumRPM,
    },
    chargeTemp: parsed.chargeTemp,
    endTemp: parsed.endTemp,
    predictedTotalTime: parsed.predictedTotalTime,
    predictedFirstCrack: parsed.predictedFirstCrack,
    predictedDTR: parsed.predictedDTR,
    checklist: parsed.checklist || [],
    notes: parsed.notes || [],
  }
}
