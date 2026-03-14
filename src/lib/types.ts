export type { FlavorProfile, ProcessingMethod, BatchSize, CurvePoint, RoastProfile, CuppingScores, VisionAnalysis } from '@seedlot/roast-ui'
import type { FlavorProfile, ProcessingMethod, BatchSize, RoastProfile, VisionAnalysis } from '@seedlot/roast-ui'

export type WizardState = {
  step: number
  // Step 2: Coffee details (or pre-filled from photo analysis)
  origin: string | null
  region: string
  altitude: string
  processingMethod: ProcessingMethod | null
  moisture: string
  variety: string
  // Photo analysis
  greenCoffeePhoto: string | null
  visionAnalysis: VisionAnalysis | null
  // Step 3: Style
  flavorProfile: FlavorProfile | null
  targetNotes: string[]
  avoidNotes: string[]
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

export type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ORIGIN'; origin: string }
  | { type: 'SET_REGION'; region: string }
  | { type: 'SET_ALTITUDE'; altitude: string }
  | { type: 'SET_PROCESSING'; method: ProcessingMethod }
  | { type: 'SET_MOISTURE'; moisture: string }
  | { type: 'SET_VARIETY'; variety: string }
  | { type: 'SET_GREEN_PHOTO'; photo: string | null }
  | { type: 'SET_VISION_ANALYSIS'; analysis: VisionAnalysis }
  | { type: 'SET_FLAVOR_PROFILE'; profile: FlavorProfile }
  | { type: 'SET_WHEEL_NOTES'; selected: string[]; avoided: string[] }
  | { type: 'SET_BATCH_SIZE'; size: BatchSize }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'SET_KEY_VALIDATED'; validated: boolean }
  | { type: 'SET_GENERATED_PROFILE'; profile: RoastProfile }
  | { type: 'SET_GENERATING'; generating: boolean }
  | { type: 'SET_GENERATION_ERROR'; error: string | null }
  | { type: 'NEXT' }
  | { type: 'BACK' }
