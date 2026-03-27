"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type WizardStep = "capture" | "processing" | "crop" | "preview"
export type PhotoSizePreset = "passport" | "professional" | "custom"
export type PhotoCount = 6 | 8 | 12
export type BgColor = "white" | "black" | "red"

export interface PhotoSpec {
  preset: PhotoSizePreset
  customWidthMm: number
  customHeightMm: number
  count: PhotoCount
  bgColor: BgColor
}

export interface WizardContextType {
  currentStep: WizardStep
  photoData: {
    original: string | null
    transparent: string | null   // after BG removal
    processed: string | null     // after crop + BG color applied
    enhanced: string | null      // after AI enhancement
  }
  photoSpec: PhotoSpec
  goToStep: (step: WizardStep) => void
  setPhotoData: (data: {
    original?: string | null
    transparent?: string | null
    processed?: string | null
    enhanced?: string | null
  }) => void
  setPhotoSpec: (data: Partial<PhotoSpec>) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

const steps: WizardStep[] = ["capture", "processing", "crop", "preview"]

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("capture")
  const [photoData, setPhotoDataState] = useState<WizardContextType["photoData"]>({
    original: null, transparent: null, processed: null, enhanced: null,
  })
  const [photoSpec, setPhotoSpecState] = useState<PhotoSpec>({
    preset: "passport", customWidthMm: 35, customHeightMm: 45, count: 6, bgColor: "white",
  })

  const goToStep = (step: WizardStep) => setCurrentStep(step)

  const setPhotoData = (data: Partial<WizardContextType["photoData"]>) => {
    setPhotoDataState((prev) => ({
      original: data.original !== undefined ? data.original : prev.original,
      transparent: data.transparent !== undefined ? data.transparent : prev.transparent,
      processed: data.processed !== undefined ? data.processed : prev.processed,
      enhanced: data.enhanced !== undefined ? data.enhanced : prev.enhanced,
    }))
  }

  const setPhotoSpec = (data: Partial<PhotoSpec>) =>
    setPhotoSpecState((prev) => ({ ...prev, ...data }))

  const nextStep = () => {
    const i = steps.indexOf(currentStep)
    if (i < steps.length - 1) setCurrentStep(steps[i + 1])
  }

  const prevStep = () => {
    const i = steps.indexOf(currentStep)
    if (i > 0) setCurrentStep(steps[i - 1])
  }

  const reset = () => {
    setCurrentStep("capture")
    setPhotoDataState({ original: null, transparent: null, processed: null, enhanced: null })
    setPhotoSpecState({ preset: "passport", customWidthMm: 35, customHeightMm: 45, count: 6, bgColor: "white" })
  }

  return (
    <WizardContext.Provider value={{
      currentStep, photoData, photoSpec,
      goToStep, setPhotoData, setPhotoSpec, nextStep, prevStep, reset,
    }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard(): WizardContextType {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error("useWizard must be used within WizardProvider")
  return ctx
}
