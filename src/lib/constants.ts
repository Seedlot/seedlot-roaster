// Re-export shared constants from @seedlot/roast-ui
export { FLAVOR_PROFILES, COMMON_NOTES, AVOID_NOTES } from '@seedlot/roast-ui'

// Roaster-specific constants
export const ORIGINS = [
  'Ethiopia', 'Colombia', 'Kenya', 'Guatemala', 'Indonesia', 'Brazil',
  'Costa Rica', 'Honduras', 'Peru', 'Rwanda', 'Burundi', 'Panama',
  'El Salvador', 'Nicaragua', 'Mexico', 'Yemen', 'India', 'Papua New Guinea',
  'Tanzania', 'Uganda', 'Myanmar', 'Thailand', 'Vietnam', 'Laos',
  'Democratic Republic of Congo', 'Malawi', 'Zambia', 'Bolivia', 'Ecuador',
]

export const PROCESSING_METHODS = [
  { id: 'washed', label: 'Washed', description: 'Clean, bright, clarity of origin character' },
  { id: 'natural', label: 'Natural', description: 'Fruity, heavy body, fermented sweetness' },
  { id: 'honey', label: 'Honey', description: 'Balanced sweetness, smooth body' },
  { id: 'wet-hulled', label: 'Wet-Hulled', description: 'Earthy, full body, low acidity (Sumatran/Sulawesi)' },
  { id: 'anaerobic', label: 'Anaerobic', description: 'Intense, unique, experimental flavors' },
] as const

export const VARIETIES = [
  'Typica', 'Bourbon', 'Gesha / Geisha', 'SL28', 'SL34',
  'Catuai', 'Caturra', 'Castillo', 'Catimor', 'Mundo Novo',
  'Pacamara', 'Maragogype', 'Heirloom (Ethiopian)', 'Kent', 'Java',
  'Tim Tim', 'Ateng', 'Jember', 'Sigararutang',
]

export const BATCH_SIZES = [
  { id: '50', label: '50g', description: 'Standard sample size' },
  { id: '100', label: '100g', description: 'Production evaluation' },
  { id: '200', label: '200g', description: 'Large batch (uses inlet temperature)' },
] as const

export const TOTAL_STEPS = 8
export const PROMPT_VERSION = 'v1.1.0'
