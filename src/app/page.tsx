"use client"

import { useReducer, useCallback, useEffect, useRef } from 'react'
import { useUser, SignIn } from '@clerk/nextjs'
import Welcome from '@/components/wizard/welcome'
import DescribeCoffee from '@/components/wizard/describe-coffee'
import DefineStyle from '@/components/wizard/define-style'
import SelectRoaster from '@/components/wizard/select-roaster'
import ApiKeyInput from '@/components/wizard/api-key-input'
import ProfileResult from '@/components/wizard/profile-result'
import PostRoastFeedback from '@/components/wizard/post-roast-feedback'
import ProgressHeader from '@/components/ui/progress-header'
import NavButtons from '@/components/ui/nav-buttons'
import { getSessionId } from '@/lib/session'
import { trackSession } from '@/lib/cms'
import { TOTAL_STEPS } from '@/lib/constants'
import type { WizardState, WizardAction, RoastProfile } from '@/lib/types'

const initialState: WizardState = {
  step: 1,
  origin: null,
  region: '',
  altitude: '',
  processingMethod: null,
  moisture: '',
  variety: '',
  flavorProfile: null,
  targetNotes: '',
  avoidNotes: '',
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
    case 'SET_FLAVOR_PROFILE': return { ...state, flavorProfile: action.profile }
    case 'SET_TARGET_NOTES': return { ...state, targetNotes: action.notes }
    case 'SET_AVOID_NOTES': return { ...state, avoidNotes: action.notes }
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
    case 1: return true
    case 2: return state.origin !== null && state.origin.length > 0
    case 3: return state.flavorProfile !== null
    case 4: return state.batchSize !== null
    case 5: return state.keyValidated
    case 6: return state.generatedProfile !== null
    default: return false
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { isSignedIn } = useUser()
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

  const handleNext = useCallback(() => {
    if (state.step === 5) {
      // Moving to generation step — clear previous profile
      dispatch({ type: 'SET_GENERATED_PROFILE', profile: null as unknown as RoastProfile })
    }
    dispatch({ type: 'NEXT' })
  }, [state.step])

  const handleBack = useCallback(() => dispatch({ type: 'BACK' }), [])

  const handleProfileGenerated = useCallback((profile: RoastProfile) => {
    dispatch({ type: 'SET_GENERATED_PROFILE', profile })
    trackSession(sessionIdRef.current, {
      profileGenerated: true,
      generationCount: 1,
    })
  }, [])

  const handleGenerationError = useCallback((error: string) => {
    dispatch({ type: 'SET_GENERATION_ERROR', error })
  }, [])

  const handleSaveProfile = useCallback(async () => {
    if (!state.generatedProfile) return

    try {
      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          profileName: state.generatedProfile.name,
          coffee: {
            origin: state.origin,
            region: state.region || undefined,
            altitude: state.altitude ? Number(state.altitude) : undefined,
            processingMethod: state.processingMethod || undefined,
            moisture: state.moisture ? Number(state.moisture) : undefined,
            variety: state.variety || undefined,
          },
          style: {
            flavorProfile: state.flavorProfile || undefined,
            targetNotes: state.targetNotes || undefined,
            avoidNotes: state.avoidNotes || undefined,
          },
          equipment: { roaster: 'roest', batchSize: state.batchSize },
          generatedProfile: state.generatedProfile,
          curveData: state.generatedProfile.curve,
          machineSettings: {
            power: state.generatedProfile.settings.power,
            fan: state.generatedProfile.settings.fan,
            drumRPM: state.generatedProfile.settings.drumRPM,
            chargeTemp: state.generatedProfile.chargeTemp,
            endTemp: state.generatedProfile.endTemp,
            predictedTotalTime: state.generatedProfile.predictedTotalTime,
            predictedDTR: state.generatedProfile.predictedDTR,
          },
          aiModel: 'claude-sonnet-4-6',
          promptVersion: 'v1.0.0',
        }),
      })
      if (res.ok) {
        trackSession(sessionIdRef.current, { profileSaved: true })
      }
    } catch {
      // best-effort
    }
  }, [state])

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

  const showNav = state.step >= 2 && state.step <= 5

  return (
    <div className="wizard-shell bg-off-white">
      <ProgressHeader step={state.step} />

      <div className="wizard-content">
        {state.step === 1 && (
          <Welcome onNext={() => dispatch({ type: 'NEXT' })} />
        )}
        {state.step === 2 && (
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
        {state.step === 3 && (
          <DefineStyle
            flavorProfile={state.flavorProfile}
            targetNotes={state.targetNotes}
            avoidNotes={state.avoidNotes}
            onFlavorProfileChange={(v) => dispatch({ type: 'SET_FLAVOR_PROFILE', profile: v })}
            onTargetNotesChange={(v) => dispatch({ type: 'SET_TARGET_NOTES', notes: v })}
            onAvoidNotesChange={(v) => dispatch({ type: 'SET_AVOID_NOTES', notes: v })}
          />
        )}
        {state.step === 4 && (
          <SelectRoaster
            batchSize={state.batchSize}
            onBatchSizeChange={(v) => dispatch({ type: 'SET_BATCH_SIZE', size: v })}
          />
        )}
        {state.step === 5 && (
          <ApiKeyInput
            apiKey={state.apiKey}
            keyValidated={state.keyValidated}
            onApiKeyChange={(v) => dispatch({ type: 'SET_API_KEY', key: v })}
            onKeyValidated={(v) => dispatch({ type: 'SET_KEY_VALIDATED', validated: v })}
          />
        )}
        {state.step === 6 && (
          <>
            <ProfileResult
              state={state}
              onProfileGenerated={handleProfileGenerated}
              onError={handleGenerationError}
            />
            {state.generatedProfile && (
              <div className="px-4 pb-6 sm:px-6 no-print">
                <div className="max-w-2xl mx-auto">
                  {state.generationError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4 text-sm text-red-700">
                      {state.generationError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {isSignedIn ? (
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 py-3 rounded-xl bg-forest text-white font-bold text-sm uppercase tracking-wider hover:bg-deep-green transition-colors"
                      >
                        Save Profile
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-3 text-sm text-grey-50">
                        <SignIn
                          routing="hash"
                          fallbackRedirectUrl="/"
                          appearance={{
                            elements: { rootBox: 'mx-auto', card: 'shadow-none' },
                          }}
                        />
                        <p className="mt-2">Sign in to save profiles and track results</p>
                      </div>
                    )}
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 rounded-xl border border-grey-20 text-grey-60 font-medium text-sm hover:bg-grey-5 transition-colors"
                    >
                      Log Roast Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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
          nextLabel={state.step === 5 ? 'Generate Profile' : 'Next'}
        />
      )}
    </div>
  )
}
