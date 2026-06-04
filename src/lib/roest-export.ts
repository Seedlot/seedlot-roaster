import type { RoastProfile } from './types'

/**
 * Convert a RoastProfile to a ROEST-compatible JSON format
 * that can be manually entered into the ROEST web interface.
 */
export function toRoestJSON(profile: RoastProfile, batchSize: string): object {
  const isBeanInletProfile = batchSize === '200'

  return {
    name: profile.name,
    batchSize: `${batchSize}g`,
    profileType: isBeanInletProfile ? 'bean-inlet' : 'air',
    power: profile.settings.power,
    fan: profile.settings.fan,
    drumSpeed: profile.settings.drumRPM,
    curve: profile.curve.map(p => {
      const beanTempC = (p as { beanTempC?: number }).beanTempC

      return {
        time: p.time,
        ...(isBeanInletProfile ? { beanTemperature: beanTempC, inletTemperature: p.tempC } : { temperature: p.tempC }),
        label: p.phase,
      }
    }),
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

export function profileToClipboard(profile: RoastProfile, batchSize?: string): string {
  const isBeanInletProfile = batchSize === '200'
  const lines = [
    `Profile: ${profile.name}`,
    `Settings: Power ${profile.settings.power}% | Fan ${profile.settings.fan}% | Drum ${profile.settings.drumRPM} RPM`,
    `Charge: ${profile.chargeTemp}°C | End: ${profile.endTemp}°C`,
    `Predicted: FC @ ${profile.predictedFirstCrack} | Total ${profile.predictedTotalTime} | DTR ${profile.predictedDTR}%`,
    '',
    'Curve:',
    ...profile.curve.map(p => {
      const beanTempC = (p as { beanTempC?: number }).beanTempC
      const temperatureLabel = isBeanInletProfile && typeof beanTempC === 'number'
        ? `bean ${beanTempC}°C / inlet ${p.tempC}°C`
        : `${p.tempC}°C`
      return `  ${p.time} — ${temperatureLabel} (${p.phase})`
    }),
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
