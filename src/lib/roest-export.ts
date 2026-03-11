import type { RoastProfile } from './types'

/**
 * Convert a RoastProfile to a ROEST-compatible JSON format
 * that can be manually entered into the ROEST web interface.
 */
export function toRoestJSON(profile: RoastProfile, batchSize: string): object {
  return {
    name: profile.name,
    batchSize: `${batchSize}g`,
    profileType: batchSize === '200' ? 'inlet' : 'air',
    power: profile.settings.power,
    fan: profile.settings.fan,
    drumSpeed: profile.settings.drumRPM,
    curve: profile.curve.map(p => ({
      time: p.time,
      temperature: p.tempC,
      label: p.phase,
    })),
    metadata: {
      generator: 'Seedlot Roaster AI',
      chargeTemp: profile.chargeTemp,
      endTemp: profile.endTemp,
      predictedTotalTime: profile.predictedTotalTime,
      predictedFirstCrack: profile.predictedFirstCrack,
      predictedDTR: profile.predictedDTR,
    },
  }
}

export function profileToClipboard(profile: RoastProfile): string {
  const lines = [
    `Profile: ${profile.name}`,
    `Settings: Power ${profile.settings.power}% | Fan ${profile.settings.fan}% | Drum ${profile.settings.drumRPM} RPM`,
    `Charge: ${profile.chargeTemp}°C | End: ${profile.endTemp}°C`,
    `Predicted: FC @ ${profile.predictedFirstCrack} | Total ${profile.predictedTotalTime} | DTR ${profile.predictedDTR}%`,
    '',
    'Curve:',
    ...profile.curve.map(p => `  ${p.time} — ${p.tempC}°C (${p.phase})`),
    '',
    'Checklist:',
    ...profile.checklist.flatMap(c => [
      `  ${c.phase}:`,
      ...c.items.map(i => `    - ${i}`),
    ]),
    '',
    'Notes:',
    ...profile.notes.map(n => `  - ${n}`),
  ]
  return lines.join('\n')
}
