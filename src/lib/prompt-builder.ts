import type { WizardState } from './types'
import { ROAST_KNOWLEDGE } from '@seedlot/roast-ui'
import { FLAVOR_PROFILES, PROMPT_VERSION, isValidBatchSize } from './constants'
import { getNoteLabel } from '@seedlot/roast-ui'

const STRICT_BATCH_PROFILE_GUIDE = `
## Strict Batch Weight Rules

Valid batch weights are exactly 50g, 100g, 150g, and 200g. Use the requested weight exactly in
the profile name, checklist load instruction, machine settings, time range, and temperature axis.
Do not average, round, upscale, downscale, or silently change the batch size.

Batch-specific control modes:
- 50g: air-temperature profile. Do not include beanTempC. Keep tempC as air temperature under 260C.
- 100g: air-temperature profile. Do not include beanTempC. Keep tempC as air temperature under 260C.
- 150g: air-temperature profile. Do not include beanTempC. Keep tempC as air temperature under 260C.
- 200g: bean/inlet-temperature profile. Every curve point must include beanTempC. tempC is inlet temperature and may exceed 260C. endTemp remains the bean/drop target, not the final inlet temperature.

Before answering, validate your own JSON:
- curve has exactly 9 points
- curve times increase from first point to final drop
- predictedTotalTime matches the last curve point
- predictedFirstCrack is before predictedTotalTime
- predictedDTR roughly matches (total time - first crack time) / total time
- settings match the selected batch-weight band
- checklist says to load the selected gram weight, not another weight

Use these as structural anchors, adapting only modestly for origin, moisture, processing, and flavor target:

50g air-temperature example:
\`\`\`json
{
  "name": "SEEDLOT:AI Colombia Washed Light Bright 50g",
  "curve": [
    { "time": "0:00", "tempC": 232, "phase": "Charge" },
    { "time": "0:45", "tempC": 184, "phase": "Turning Point" },
    { "time": "1:30", "tempC": 194, "phase": "Early Drying" },
    { "time": "2:20", "tempC": 208, "phase": "Mid Drying" },
    { "time": "3:20", "tempC": 218, "phase": "Late Drying" },
    { "time": "4:10", "tempC": 224, "phase": "Maillard" },
    { "time": "4:55", "tempC": 231, "phase": "Pre-FC" },
    { "time": "5:20", "tempC": 238, "phase": "First Crack" },
    { "time": "6:05", "tempC": 236, "phase": "Development / Drop" }
  ],
  "settings": { "power": 55, "fan": 80, "drumRPM": 65 },
  "chargeTemp": 232,
  "endTemp": 207,
  "predictedTotalTime": "6:05",
  "predictedFirstCrack": "5:20",
  "predictedDTR": 12.3
}
\`\`\`

100g air-temperature example:
\`\`\`json
{
  "name": "SEEDLOT:AI Indonesia Honey Balanced Clean 100g",
  "curve": [
    { "time": "0:00", "tempC": 240, "phase": "Charge" },
    { "time": "0:55", "tempC": 188, "phase": "Turning Point" },
    { "time": "1:45", "tempC": 198, "phase": "Early Drying" },
    { "time": "2:45", "tempC": 212, "phase": "Mid Drying" },
    { "time": "3:50", "tempC": 222, "phase": "Late Drying" },
    { "time": "4:55", "tempC": 229, "phase": "Maillard" },
    { "time": "5:45", "tempC": 236, "phase": "Pre-FC" },
    { "time": "6:10", "tempC": 242, "phase": "First Crack" },
    { "time": "7:15", "tempC": 239, "phase": "Development / Drop" }
  ],
  "settings": { "power": 63, "fan": 75, "drumRPM": 55 },
  "chargeTemp": 240,
  "endTemp": 209,
  "predictedTotalTime": "7:15",
  "predictedFirstCrack": "6:10",
  "predictedDTR": 14.9
}
\`\`\`

150g air-temperature example:
\`\`\`json
{
  "name": "SEEDLOT:AI Guatemala Washed Chocolate Sweet 150g",
  "curve": [
    { "time": "0:00", "tempC": 246, "phase": "Charge" },
    { "time": "1:00", "tempC": 190, "phase": "Turning Point" },
    { "time": "2:00", "tempC": 201, "phase": "Early Drying" },
    { "time": "3:05", "tempC": 215, "phase": "Mid Drying" },
    { "time": "4:10", "tempC": 225, "phase": "Late Drying" },
    { "time": "5:10", "tempC": 232, "phase": "Maillard" },
    { "time": "6:00", "tempC": 239, "phase": "Pre-FC" },
    { "time": "6:35", "tempC": 245, "phase": "First Crack" },
    { "time": "7:55", "tempC": 242, "phase": "Development / Drop" }
  ],
  "settings": { "power": 68, "fan": 74, "drumRPM": 55 },
  "chargeTemp": 246,
  "endTemp": 212,
  "predictedTotalTime": "7:55",
  "predictedFirstCrack": "6:35",
  "predictedDTR": 16.8
}
\`\`\`

200g bean/inlet-temperature example:
\`\`\`json
{
  "name": "SEEDLOT:AI Indonesia Wet Hulled Balanced Clean 200g",
  "curve": [
    { "time": "1:00", "beanTempC": 71, "tempC": 296, "phase": "Drying Energy" },
    { "time": "2:00", "beanTempC": 104, "tempC": 341, "phase": "Yellowing" },
    { "time": "3:20", "beanTempC": 132, "tempC": 357, "phase": "Maillard Ramp" },
    { "time": "4:40", "beanTempC": 154, "tempC": 366, "phase": "Maillard Peak" },
    { "time": "5:50", "beanTempC": 166, "tempC": 366, "phase": "Maintain Momentum" },
    { "time": "6:40", "beanTempC": 177, "tempC": 360, "phase": "Approach First Crack" },
    { "time": "7:20", "beanTempC": 188, "tempC": 346, "phase": "First Crack Control" },
    { "time": "8:00", "beanTempC": 193, "tempC": 332, "phase": "Development Decline" },
    { "time": "8:30", "beanTempC": 199, "tempC": 316, "phase": "Drop / Coast" }
  ],
  "settings": { "power": 74, "fan": 72, "drumRPM": 55 },
  "chargeTemp": 191,
  "endTemp": 199,
  "predictedTotalTime": "8:30",
  "predictedFirstCrack": "7:20",
  "predictedDTR": 13.7
}
\`\`\`
`

function batchSpecificRules(batchSize: string): string {
  switch (batchSize) {
    case '50':
      return '- HARD REQUIREMENT: Generate a 50g air-temperature profile. No beanTempC. Use 50g in the name and checklist. Use settings close to power 55%, fan 80%, drum 65 RPM.'
    case '100':
      return '- HARD REQUIREMENT: Generate a 100g air-temperature profile. No beanTempC. Use 100g in the name and checklist. Use settings close to power 63%, fan 75%, drum 55 RPM.'
    case '150':
      return '- HARD REQUIREMENT: Generate a 150g air-temperature profile. No beanTempC. Use 150g in the name and checklist. Use settings close to power 68%, fan 74%, drum 55 RPM.'
    case '200':
      return '- HARD REQUIREMENT: Generate a 200g bean/inlet-temperature profile. Every curve point must include beanTempC. tempC is inlet temperature and may exceed 260C. Use 200g in the name and checklist. Use settings close to power 74%, fan 72%, drum 55 RPM.'
    default:
      return ''
  }
}

export function buildPrompt(state: WizardState): { system: string; user: string } {
  if (!isValidBatchSize(state.batchSize)) {
    throw new Error('Batch size must be one of 50g, 100g, 150g, or 200g')
  }

  const batchSize = state.batchSize
  const flavorInfo = FLAVOR_PROFILES.find(f => f.id === state.flavorProfile)

  const system = `You are an expert coffee roaster specializing in ROEST sample roasters. You build precise roast profiles based on coffee characteristics and flavor targets.

${ROAST_KNOWLEDGE}

${STRICT_BATCH_PROFILE_GUIDE}

## Instructions
- Respond with ONLY a valid JSON object matching the Output JSON Schema above
- No markdown, no explanations outside the JSON
- Profile name format: "SEEDLOT:AI [Origin] [Process] [FlavorTarget] [BatchSize]g"
- All temperatures in Celsius
- Curve must have exactly 9 points
- Use the exact requested batch size only: ${batchSize}g
- For 50g, 100g, and 150g batches, use air temperature values and do not include beanTempC
- For 200g batches, use bean/inlet temperature values (NOT air temperature), include beanTempC on every point, and keep endTemp as the bean/drop temperature
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
- Batch size: ${batchSize}g
${batchSpecificRules(batchSize)}`

  return { system, user }
}
