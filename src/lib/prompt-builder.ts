import type { WizardState } from './types'
import { ROAST_KNOWLEDGE } from './roast-knowledge'
import { FLAVOR_PROFILES, PROMPT_VERSION } from './constants'

export function buildPrompt(state: WizardState): { system: string; user: string } {
  const flavorInfo = FLAVOR_PROFILES.find(f => f.id === state.flavorProfile)

  const system = `You are an expert coffee roaster specializing in ROEST sample roasters. You build precise roast profiles based on coffee characteristics and flavor targets.

${ROAST_KNOWLEDGE}

## Instructions
- Respond with ONLY a valid JSON object matching the Output JSON Schema above
- No markdown, no explanations outside the JSON
- Profile name format: "SEEDLOT:AI [Origin] [Process] [FlavorTarget] [BatchSize]g"
- All temperatures in Celsius
- Curve must have exactly 9 points
- For 200g batches, use inlet temperature values (NOT air temperature)
- Checklist should be practical and actionable
- Notes should explain key decisions and adjustments

Prompt version: ${PROMPT_VERSION}`

  const user = `Build a roast profile for this coffee:

**Coffee:**
- Origin: ${state.origin}${state.region ? ` — ${state.region}` : ''}
- Altitude: ${state.altitude ? `${state.altitude} MASL` : 'Unknown'}
- Processing: ${state.processingMethod || 'Unknown'}
- Moisture: ${state.moisture ? `${state.moisture}%` : 'Unknown (assume ~10.5%)'}
- Variety: ${state.variety || 'Unknown'}

**Style Target:**
- Profile: ${flavorInfo?.label || 'Balanced'} (${flavorInfo?.description || ''})
- Target DTR: ${flavorInfo?.dtr || '15-18%'}
${state.targetNotes ? `- Flavors to emphasize: ${state.targetNotes}` : ''}
${state.avoidNotes ? `- Flavors to avoid: ${state.avoidNotes}` : ''}

**Equipment:**
- Roaster: ROEST
- Batch size: ${state.batchSize}g
${state.batchSize === '200' ? '- NOTE: Use INLET TEMPERATURE profile (not air temp)' : '- Profile type: Air temperature'}`

  return { system, user }
}
