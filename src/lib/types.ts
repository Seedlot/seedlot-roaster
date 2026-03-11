export type FlavorProfile =
  | 'light-bright'
  | 'stone-fruit'
  | 'balanced-clean'
  | 'chocolate-sweet'
  | 'dark-bold'

export type ProcessingMethod = 'washed' | 'natural' | 'honey' | 'wet-hulled' | 'anaerobic'

export type BatchSize = '50' | '100' | '200'

export type WizardState = {
  step: number
  // Step 2: Coffee details
  origin: string | null
  region: string
  altitude: string
  processingMethod: ProcessingMethod | null
  moisture: string
  variety: string
  // Step 3: Style
  flavorProfile: FlavorProfile | null
  targetNotes: string
  avoidNotes: string
  // Step 4: Equipment
  roaster: 'roest'
  batchSize: BatchSize | null
  // Step 5: API key
  apiKey: string
  keyValidated: boolean
  // Step 6: Generated profile
  generatedProfile: RoastProfile | null
  generating: boolean
  generationError: string | null
}

export type CurvePoint = {
  time: string
  tempC: number
  phase: string
}

export type RoastProfile = {
  name: string
  curve: CurvePoint[]
  settings: {
    power: number
    fan: number
    drumRPM: number
  }
  chargeTemp: number
  endTemp: number
  predictedTotalTime: string
  predictedFirstCrack: string
  predictedDTR: number
  checklist: { phase: string; items: string[] }[]
  notes: string[]
}

export type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ORIGIN'; origin: string }
  | { type: 'SET_REGION'; region: string }
  | { type: 'SET_ALTITUDE'; altitude: string }
  | { type: 'SET_PROCESSING'; method: ProcessingMethod }
  | { type: 'SET_MOISTURE'; moisture: string }
  | { type: 'SET_VARIETY'; variety: string }
  | { type: 'SET_FLAVOR_PROFILE'; profile: FlavorProfile }
  | { type: 'SET_TARGET_NOTES'; notes: string }
  | { type: 'SET_AVOID_NOTES'; notes: string }
  | { type: 'SET_BATCH_SIZE'; size: BatchSize }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'SET_KEY_VALIDATED'; validated: boolean }
  | { type: 'SET_GENERATED_PROFILE'; profile: RoastProfile }
  | { type: 'SET_GENERATING'; generating: boolean }
  | { type: 'SET_GENERATION_ERROR'; error: string | null }
  | { type: 'NEXT' }
  | { type: 'BACK' }

export type CuppingScores = {
  fragrance: number
  flavor: number
  aftertaste: number
  acidity: number
  body: number
  balance: number
  uniformity: number
  sweetness: number
}
