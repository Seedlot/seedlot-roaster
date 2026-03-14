"use client"

import { useReducer, useCallback, useEffect, useRef } from 'react'
import Welcome from '@/components/wizard/welcome'
import PhotoCapture from '@/components/wizard/photo-capture'
import DescribeCoffee from '@/components/wizard/describe-coffee'
import DefineStyle from '@/components/wizard/define-style'
import SelectRoaster from '@/components/wizard/select-roaster'
import ProfileSubmitted from '@/components/wizard/profile-submitted'
import PostRoastFeedback from '@/components/wizard/post-roast-feedback'
import ProgressHeader from '@/components/ui/progress-header'
import AppMenu from '@/components/ui/app-menu'
import NavButtons from '@/components/ui/nav-buttons'
import { getSessionId } from '@/lib/session'
import { trackSession } from '@/lib/cms'
import { TOTAL_STEPS } from '@/lib/constants'
import type { WizardState, WizardAction } from '@/lib/types'
import type { VisionAnalysis, ProcessingMethod } from '@seedlot/roast-ui'

const initialState: WizardState = {
  step: 1,
  origin: null,
  region: '',
  altitude: '',
  processingMethod: null,
  moisture: '',
  variety: '',
  greenCoffeePhoto: null,
  visionAnalysis: null,
  flavorProfile: null,
  targetNotes: [],
  avoidNotes: [],
  roaster: 'roest',
  batchSize: null,
  apiKey: '',
  keyValidated: false,
  generatedProfile: null,
  generating: false,
  generationError: null,
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.step }
    case 'SET_ORIGIN': return { ...state, origin: action.origin }
    case 'SET_REGION': return { ...state, region: action.region }
    case 'SET_ALTITUDE': return { ...state, altitude: action.altitude }
    case 'SET_PROCESSING': return { ...state, processingMethod: action.method }
    case 'SET_MOISTURE': return { ...state, moisture: action.moisture }
    case 'SET_VARIETY': return { ...state, variety: action.variety }
    case 'SET_GREEN_PHOTO': return { ...state, greenCoffeePhoto: action.photo }
    case 'SET_VISION_ANALYSIS': return { ...state, visionAnalysis: action.analysis }
    case 'SET_FLAVOR_PROFILE': return { ...state, flavorProfile: action.profile }
    case 'SET_WHEEL_NOTES': return { ...state, targetNotes: action.selected, avoidNotes: action.avoided }
    case 'SET_BATCH_SIZE': return { ...state, batchSize: action.size }
    case 'SET_API_KEY': return { ...state, apiKey: action.key }
    case 'SET_KEY_VALIDATED': return { ...state, keyValidated: action.validated }
    case 'SET_GENERATED_PROFILE': return { ...state, generatedProfile: action.profile, generating: false, generationError: null }
    case 'SET_GENERATING': return { ...state, generating: action.generating }
    case 'SET_GENERATION_ERROR': return { ...state, generationError: action.error, generating: false }
    case 'NEXT': return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) }
    case 'BACK': return { ...state, step: Math.max(state.step - 1, 1) }
    default: return state
  }
}

function canAdvance(state: WizardState): boolean {
  switch (state.step) {
    case 1: return true // Welcome
    case 2: return true // Photo capture (can skip)
    case 3: return state.origin !== null && state.origin.length > 0
    case 4: return state.flavorProfile !== null
    case 5: return state.batchSize !== null
    default: return false
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const sessionIdRef = useRef<string>('')
  const stepStartRef = useRef<number>(Date.now())

  useEffect(() => {
    sessionIdRef.current = getSessionId()
    trackSession(sessionIdRef.current, {
      stepsCompleted: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    })
  }, [])

  // Track step timing
  useEffect(() => {
    const now = Date.now()
    if (state.step > 1 && stepStartRef.current) {
      trackSession(sessionIdRef.current, {
        stepsCompleted: state.step - 1,
      })
    }
    stepStartRef.current = now
  }, [state.step])

  const handleNext = useCallback(() => dispatch({ type: 'NEXT' }), [])
  const handleBack = useCallback(() => dispatch({ type: 'BACK' }), [])

  const handleVisionAnalysis = useCallback((analysis: VisionAnalysis) => {
    dispatch({ type: 'SET_VISION_ANALYSIS', analysis })
    if (analysis.estimatedOrigin) {
      dispatch({ type: 'SET_ORIGIN', origin: analysis.estimatedOrigin })
    }
    if (analysis.processingMethod) {
      const method = analysis.processingMethod.toLowerCase() as ProcessingMethod
      if (['washed', 'natural', 'honey', 'wet-hulled', 'anaerobic'].includes(method)) {
        dispatch({ type: 'SET_PROCESSING', method })
      }
    }
    if (analysis.variety) {
      dispatch({ type: 'SET_VARIETY', variety: analysis.variety })
    }
    if (analysis.moistureEstimate) {
      const moistureMatch = analysis.moistureEstimate.match(/(\d+\.?\d*)/)
      if (moistureMatch) {
        dispatch({ type: 'SET_MOISTURE', moisture: moistureMatch[1] })
      }
    }
    dispatch({ type: 'NEXT' })
  }, [])

  const handleFeedbackSubmit = useCallback(async (data: Parameters<typeof import('@/components/wizard/post-roast-feedback').default>[0]['onSubmit'] extends (data: infer D) => void ? D : never) => {
    try {
      await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          ...data,
        }),
      })
      trackSession(sessionIdRef.current, { resultLogged: true })
    } catch {
      // best-effort
    }
  }, [])

  // Steps: 1=Welcome, 2=Photo, 3=Describe, 4=Style, 5=Roaster, 6=Submitted, 7=Feedback
  const showNav = state.step >= 3 && state.step <= 5

  return (
    <div className="wizard-shell bg-off-white">
      <AppMenu onHome={() => dispatch({ type: 'SET_STEP', step: 1 })} />
      <ProgressHeader step={state.step} />

      <div className="wizard-content">
        {state.step === 1 && (
          <Welcome onNext={() => dispatch({ type: 'NEXT' })} />
        )}
        {state.step === 2 && (
          <PhotoCapture
            savedApiKey=""
            onAnalysisComplete={handleVisionAnalysis}
            onSkip={() => dispatch({ type: 'NEXT' })}
          />
        )}
        {state.step === 3 && (
          <DescribeCoffee
            origin={state.origin}
            region={state.region}
            altitude={state.altitude}
            processingMethod={state.processingMethod}
            moisture={state.moisture}
            variety={state.variety}
            onOriginChange={(v) => dispatch({ type: 'SET_ORIGIN', origin: v })}
            onRegionChange={(v) => dispatch({ type: 'SET_REGION', region: v })}
            onAltitudeChange={(v) => dispatch({ type: 'SET_ALTITUDE', altitude: v })}
            onProcessingChange={(v) => dispatch({ type: 'SET_PROCESSING', method: v })}
            onMoistureChange={(v) => dispatch({ type: 'SET_MOISTURE', moisture: v })}
            onVarietyChange={(v) => dispatch({ type: 'SET_VARIETY', variety: v })}
          />
        )}
        {state.step === 4 && (
          <DefineStyle
            flavorProfile={state.flavorProfile}
            selectedNotes={state.targetNotes}
            avoidedNotes={state.avoidNotes}
            onFlavorProfileChange={(v) => dispatch({ type: 'SET_FLAVOR_PROFILE', profile: v })}
            onSelectionChange={(selected, avoided) => dispatch({ type: 'SET_WHEEL_NOTES', selected, avoided })}
          />
        )}
        {state.step === 5 && (
          <SelectRoaster
            batchSize={state.batchSize}
            onBatchSizeChange={(v) => dispatch({ type: 'SET_BATCH_SIZE', size: v })}
          />
        )}
        {state.step === 6 && (
          <ProfileSubmitted
            state={state}
            sessionId={sessionIdRef.current}
          />
        )}
        {state.step === 7 && (
          <PostRoastFeedback onSubmit={handleFeedbackSubmit} />
        )}
      </div>

      {showNav && (
        <NavButtons
          onBack={handleBack}
          onNext={handleNext}
          canAdvance={canAdvance(state)}
          nextLabel={state.step === 5 ? 'Submit Profile' : 'Next'}
        />
      )}
    </div>
  )
}
