import type { BatchSize, RoastProfile } from './types'
import { isValidBatchSize, type ValidBatchSize } from './constants'

type BatchConstraints = {
  controlMode: 'air' | 'bean-inlet'
  tempMin: number
  tempMax: number
  beanTempMin?: number
  beanTempMax?: number
  totalMinSeconds: number
  totalMaxSeconds: number
  powerMin: number
  powerMax: number
  fanMin: number
  fanMax: number
  drumMin: number
  drumMax: number
}

const BATCH_CONSTRAINTS: Record<ValidBatchSize, BatchConstraints> = {
  '50': {
    controlMode: 'air',
    tempMin: 120,
    tempMax: 260,
    totalMinSeconds: 330,
    totalMaxSeconds: 450,
    powerMin: 45,
    powerMax: 68,
    fanMin: 65,
    fanMax: 90,
    drumMin: 50,
    drumMax: 75,
  },
  '100': {
    controlMode: 'air',
    tempMin: 120,
    tempMax: 260,
    totalMinSeconds: 360,
    totalMaxSeconds: 510,
    powerMin: 55,
    powerMax: 75,
    fanMin: 65,
    fanMax: 85,
    drumMin: 45,
    drumMax: 70,
  },
  '150': {
    controlMode: 'air',
    tempMin: 120,
    tempMax: 260,
    totalMinSeconds: 390,
    totalMaxSeconds: 570,
    powerMin: 60,
    powerMax: 78,
    fanMin: 62,
    fanMax: 84,
    drumMin: 45,
    drumMax: 70,
  },
  '200': {
    controlMode: 'bean-inlet',
    tempMin: 180,
    tempMax: 450,
    beanTempMin: 50,
    beanTempMax: 230,
    totalMinSeconds: 450,
    totalMaxSeconds: 600,
    powerMin: 68,
    powerMax: 82,
    fanMin: 60,
    fanMax: 80,
    drumMin: 45,
    drumMax: 70,
  },
}

function timeToSeconds(value: string): number {
  const parts = value.split(':').map(Number)
  if (parts.length !== 2 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid time format: ${value}`)
  }

  const [minutes, seconds] = parts
  if (minutes < 0 || seconds < 0 || seconds >= 60) {
    throw new Error(`Invalid time value: ${value}`)
  }

  return minutes * 60 + seconds
}

function assertInRange(label: string, value: number, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}`)
  }
}

export function validateRoastProfileForBatch(
  profile: RoastProfile,
  batchSize: BatchSize | null,
): void {
  if (!isValidBatchSize(batchSize)) {
    throw new Error('Batch size must be one of 50g, 100g, 150g, or 200g')
  }

  const constraints = BATCH_CONSTRAINTS[batchSize]
  const expectedNameToken = `${batchSize}g`
  if (!profile.name.toLowerCase().includes(expectedNameToken)) {
    throw new Error(`Profile name must include the selected ${expectedNameToken} batch weight`)
  }

  if (!Array.isArray(profile.curve) || profile.curve.length !== 9) {
    throw new Error('Roast curve must contain exactly 9 points')
  }

  let previousTime = -1
  let previousBeanTemp = -Infinity
  for (const point of profile.curve) {
    const seconds = timeToSeconds(point.time)
    if (seconds <= previousTime) {
      throw new Error('Curve point times must increase')
    }
    previousTime = seconds

    assertInRange(
      `Curve temperature at ${point.time}`,
      point.tempC,
      constraints.tempMin,
      constraints.tempMax,
    )

    const beanTempC = (point as { beanTempC?: unknown }).beanTempC
    if (constraints.controlMode === 'bean-inlet') {
      if (typeof beanTempC !== 'number' || !Number.isFinite(beanTempC)) {
        throw new Error('200g profiles require beanTempC on every curve point')
      }
      assertInRange(
        `Bean temperature at ${point.time}`,
        beanTempC,
        constraints.beanTempMin!,
        constraints.beanTempMax!,
      )
      if (beanTempC <= previousBeanTemp) {
        throw new Error('200g beanTempC values must increase through the curve')
      }
      previousBeanTemp = beanTempC
    } else if (beanTempC !== undefined) {
      throw new Error(`${batchSize}g profiles must use air temperature only and must not include beanTempC`)
    }
  }

  const totalSeconds = timeToSeconds(profile.predictedTotalTime)
  assertInRange(
    `${batchSize}g predicted total time`,
    totalSeconds,
    constraints.totalMinSeconds,
    constraints.totalMaxSeconds,
  )
  if (Math.abs(totalSeconds - previousTime) > 45) {
    throw new Error('predictedTotalTime must match the final curve point')
  }

  const firstCrackSeconds = timeToSeconds(profile.predictedFirstCrack)
  if (firstCrackSeconds <= 0 || firstCrackSeconds >= totalSeconds) {
    throw new Error('predictedFirstCrack must occur before predictedTotalTime')
  }

  const calculatedDTR = ((totalSeconds - firstCrackSeconds) / totalSeconds) * 100
  if (Math.abs(calculatedDTR - profile.predictedDTR) > 4.5) {
    throw new Error('predictedDTR does not match first crack and total time')
  }

  assertInRange('predictedDTR', profile.predictedDTR, 8, 26)
  assertInRange('chargeTemp', profile.chargeTemp, 150, 260)
  assertInRange('endTemp', profile.endTemp, 170, 230)
  assertInRange('settings.power', profile.settings.power, constraints.powerMin, constraints.powerMax)
  assertInRange('settings.fan', profile.settings.fan, constraints.fanMin, constraints.fanMax)
  assertInRange('settings.drumRPM', profile.settings.drumRPM, constraints.drumMin, constraints.drumMax)
}
