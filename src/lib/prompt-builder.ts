import type { WizardState } from './types'
import { ROAST_KNOWLEDGE } from '@seedlot/roast-ui'
import { FLAVOR_PROFILES, PROMPT_VERSION } from './constants'
import { getNoteLabel } from '@seedlot/roast-ui'

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

  // Build target/avoid notes strings from wheel selections
  const targetNotesStr = state.targetNotes.length > 0
    ? state.targetNotes.map(id => getNoteLabel(id)).join(', ')
    : ''
  const avoidNotesStr = state.avoidNotes.length > 0
    ? state.avoidNotes.map(id => getNoteLabel(id)).join(', ')
    : ''

  let visionSection = ''
  if (state.visionAnalysis) {
    const v = state.visionAnalysis
    visionSection = `
**Visual Analysis (from photo):**
- Bean color: ${v.beanColor}
- Size uniformity: ${v.sizeUniformity}
- Silver skin: ${v.silverSkinPresence}
- Defects: ${v.defectEstimate}
- Observations: ${v.observations.join('; ')}
`
  }

  const user = `Build a roast profile for this coffee:

**Coffee:**
- Origin: ${state.origin}${state.region ? ` — ${state.region}` : ''}
- Altitude: ${state.altitude ? `${state.altitude} MASL` : 'Unknown'}
- Processing: ${state.processingMethod || 'Unknown'}
- Moisture: ${state.moisture ? `${state.moisture}%` : 'Unknown (assume ~10.5%)'}
- Variety: ${state.variety || 'Unknown'}
${visionSection}
**Style Target:**
- Profile: ${flavorInfo?.label || 'Balanced'} (${flavorInfo?.description || ''})
- Target DTR: ${flavorInfo?.dtr || '15-18%'}
${targetNotesStr ? `- Flavors to emphasize: ${targetNotesStr}` : ''}
${avoidNotesStr ? `- Flavors to avoid: ${avoidNotesStr}` : ''}

**Equipment:**
- Roaster: ROEST
- Batch size: ${state.batchSize}g
${state.batchSize === '200' ? '- NOTE: Use INLET TEMPERATURE profile (not air temp)' : '- Profile type: Air temperature'}`

  return { system, user }
}
