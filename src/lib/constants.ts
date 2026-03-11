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

export const FLAVOR_PROFILES = [
  {
    id: 'light-bright',
    label: 'Light & Bright',
    description: 'Floral, citrus, tea-like',
    dtr: '10-13%',
    color: 'bg-yellow-50 border-yellow-200',
    activeColor: 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-400',
  },
  {
    id: 'stone-fruit',
    label: 'Stone Fruit',
    description: 'Peach, plum, berries',
    dtr: '12-15%',
    color: 'bg-orange-50 border-orange-200',
    activeColor: 'bg-orange-100 border-orange-400 ring-2 ring-orange-400',
  },
  {
    id: 'balanced-clean',
    label: 'Balanced & Clean',
    description: 'Caramel, nuts, mild fruit',
    dtr: '15-18%',
    color: 'bg-amber-50 border-amber-200',
    activeColor: 'bg-amber-100 border-amber-400 ring-2 ring-amber-400',
  },
  {
    id: 'chocolate-sweet',
    label: 'Chocolate & Sweet',
    description: 'Cocoa, toffee, brown sugar',
    dtr: '18-22%',
    color: 'bg-yellow-900/5 border-yellow-800/20',
    activeColor: 'bg-yellow-900/10 border-yellow-800/40 ring-2 ring-yellow-800/40',
  },
  {
    id: 'dark-bold',
    label: 'Dark & Bold',
    description: 'Dark chocolate, smoky, full body',
    dtr: '22%+',
    color: 'bg-stone-100 border-stone-300',
    activeColor: 'bg-stone-200 border-stone-500 ring-2 ring-stone-500',
  },
] as const

export const BATCH_SIZES = [
  { id: '50', label: '50g', description: 'Standard sample size' },
  { id: '100', label: '100g', description: 'Production evaluation' },
  { id: '200', label: '200g', description: 'Large batch (uses inlet temperature)' },
] as const

export const COMMON_NOTES = [
  'Floral', 'Jasmine', 'Bergamot', 'Citrus', 'Lemon', 'Orange',
  'Berry', 'Blueberry', 'Strawberry', 'Peach', 'Plum', 'Apple',
  'Caramel', 'Honey', 'Toffee', 'Brown Sugar', 'Maple',
  'Chocolate', 'Cocoa', 'Dark Chocolate',
  'Nuts', 'Almond', 'Hazelnut', 'Walnut',
  'Spice', 'Cinnamon', 'Clove',
  'Tea-like', 'Winey', 'Tropical',
]

export const TOTAL_STEPS = 7
export const PROMPT_VERSION = 'v1.0.0'
