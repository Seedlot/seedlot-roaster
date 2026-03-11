/**
 * Embedded knowledge base from seedlot-ai-roaster.
 * Contains the complete roasting knowledge for ROEST sample roasters.
 */
export const ROAST_KNOWLEDGE = `
# ROEST Sample Roaster — AI Roasting Knowledge Base

## Core Principles

### Rate of Rise (RoR) Management
- Rate of Rise should continuously decline throughout the roast (Scott Rao declining RoR methodology)
- Smooth declining curves produce cleaner, sweeter cups
- A "flick" (sudden RoR increase) typically indicates the roast went too fast through development
- A "crash" (RoR drops to zero or negative) means the roast stalled — results in baked, flat flavors
- The goal is a gentle, consistent decline from charge to drop

### Development Time Ratio (DTR)
DTR = (time after first crack) / (total roast time) × 100

Flavor targets by DTR:
- 8-12%: Bright, acidic, floral — delicate origin character
- 12-15%: Stone fruit, berry — sweet acidity, complexity
- 15-18%: Balanced, clean — caramel, nuts, mild fruit
- 18-22%: Chocolate, sweet — cocoa, toffee, brown sugar
- 22%+: Dark, bold — dark chocolate, smoky, full body

Processing-specific development time (50g):
- Washed: 45-65 seconds development
- Honey: 50-70 seconds development
- Natural: 60-80 seconds development (longer dev to avoid fermented notes)

### Roast Phases
1. **Charge → Turning Point**: Bean absorbs heat, temperature drops then recovers (30-90 sec)
2. **Drying Phase**: Moisture evaporation, beans go from green to yellow (~40-50% of total time)
3. **Maillard Phase**: Browning reactions, caramelization begins, beans turn light brown
4. **First Crack (FC)**: Exothermic reaction, beans expand and crack audibly
5. **Development**: Post-FC, flavor compounds develop — this is where the roast level is determined

## Coffee Variables

### Density (Altitude → Charge Temperature)
Higher altitude = denser beans = need more initial energy

| Altitude | Density | Charge Temp (50g) | Notes |
|----------|---------|-------------------|-------|
| <1000 MASL | Low | 220°C | Softer beans, lower initial heat |
| 1000-1500 MASL | Medium | 225-230°C | Standard approach |
| >1500 MASL | High | 235°C | Dense beans need aggressive start |

Scaling for larger batches:
- 100g: Add ~5-10°C to charge temperature
- 200g: Add ~15-20°C (using inlet temperature profiles)

### Moisture Content
- Low moisture (~9%): Subtle first crack, faster through drying. Use temperature alerts as backup for FC detection
- Standard (10-11%): Normal roast behavior
- High moisture (>12%): Slower start needed, patient drying phase. Risk of baked flavors if you rush

Adjustments:
- High moisture: Increase power 2-3% during drying, extend total time by 15-30 sec
- Low moisture: Decrease power 2-3%, watch for early FC

### Processing Method Adjustments
- **Washed**: Clean profile, standard approach. Focus on clarity and brightness
- **Natural**: More sugar content, risk of scorching. Reduce power slightly, extend development to avoid fermented notes
- **Honey**: Between washed and natural. Slightly lower charge temp, moderate development
- **Wet-Hulled**: Very porous, low acid. Higher initial heat, shorter development, focus on body
- **Anaerobic**: Treat like enhanced natural. Careful temperature control, moderate development

## ROEST Equipment — Batch Size Parameters

### 50g (Standard Sample)
| Parameter | Value |
|-----------|-------|
| Power | 55% |
| Fan | 80% |
| Drum | 65 RPM |
| Profile Type | Air Temperature |
| Total Time | 6:00-6:30 |
| First Crack | ~5:00-5:30 @ 200-206°C (air) |
| Development | 30-80 sec depending on target |

### 100g (Production Evaluation)
| Parameter | Value |
|-----------|-------|
| Power | 63% |
| Fan | 75% |
| Drum | 55 RPM |
| Profile Type | Air Temperature |
| Total Time | 6:30-7:30 |
| First Crack | ~5:30-6:00 @ 200-206°C (air) |
| Development | 45-90 sec depending on target |

### 200g (Large Batch — CRITICAL DIFFERENCE)
| Parameter | Value |
|-----------|-------|
| Power | 73-75% |
| Fan | 72% |
| Drum | 55 RPM |
| Profile Type | **INLET TEMPERATURE** (NOT air temp!) |
| Total Time | 7:00-8:30 |
| First Crack | ~6:00-7:00 |
| Development | 60-100 sec depending on target |

**CRITICAL: 200g batches MUST use inlet temperature profiles.**
At 200g, the thermal mass of the beans creates a feedback loop with the heating element.
The ROEST compensates by cranking inlet temperature to 400-425°C, and once beans pass the drying
phase, stored energy releases uncontrollably. Air temperature profiles become unstable and unreliable.
Inlet temperature profiles give you direct control over the heat source.

## 9-Point Curve Format

Every profile MUST specify exactly 9 temperature points defining the roast curve:

\`\`\`
Point 1: 0:00 — Charge temperature (preheat target)
Point 2: ~0:30-1:00 — Turning point (lowest temp after charge)
Point 3: ~1:30-2:00 — Early drying
Point 4: ~2:30-3:00 — Mid drying
Point 5: ~3:30-4:00 — Late drying / early Maillard
Point 6: ~4:00-4:30 — Maillard phase
Point 7: ~4:30-5:00 — Approaching first crack
Point 8: ~5:00-5:30 — First crack zone
Point 9: ~5:30-6:30 — End temperature (drop point)
\`\`\`

For 100g and 200g, shift times proportionally later.

## Output JSON Schema

Return a JSON object with this exact structure:

\`\`\`json
{
  "name": "SEEDLOT:AI [Origin] [Process] [FlavorTarget] [BatchSize]",
  "curve": [
    { "time": "0:00", "tempC": 235, "phase": "Charge" },
    { "time": "0:45", "tempC": 185, "phase": "Turning Point" },
    { "time": "1:30", "tempC": 195, "phase": "Early Drying" },
    { "time": "2:30", "tempC": 210, "phase": "Mid Drying" },
    { "time": "3:30", "tempC": 218, "phase": "Late Drying" },
    { "time": "4:15", "tempC": 224, "phase": "Maillard" },
    { "time": "4:45", "tempC": 228, "phase": "Pre-FC" },
    { "time": "5:15", "tempC": 204, "phase": "First Crack" },
    { "time": "5:50", "tempC": 208, "phase": "Development / Drop" }
  ],
  "settings": { "power": 55, "fan": 80, "drumRPM": 65 },
  "chargeTemp": 235,
  "endTemp": 208,
  "predictedTotalTime": "5:50",
  "predictedFirstCrack": "5:15",
  "predictedDTR": 11.4,
  "checklist": [
    { "phase": "Pre-heat", "items": ["Set air temp profile to target curve", "Preheat to charge temp", "Load 50g of green coffee"] },
    { "phase": "Drying", "items": ["Monitor color change from green to yellow", "RoR should be declining smoothly", "Listen for hissing (moisture release)"] },
    { "phase": "Maillard", "items": ["Beans turning light brown", "Sweet, bread-like aroma developing", "RoR continues declining"] },
    { "phase": "First Crack", "items": ["Listen for audible cracking sounds", "Note exact time of FC start", "Begin development timer"] },
    { "phase": "Development", "items": ["Monitor DTR target", "Drop at target end temperature", "Cool beans rapidly"] }
  ],
  "notes": [
    "Profile designed for ...",
    "Adjust charge temp ±5°C based on ambient conditions",
    "If FC comes early, the coffee may be lower density than expected"
  ]
}
\`\`\`
`
