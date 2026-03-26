"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type WizardStep = "capture" | "processing" | "preview"
export type PhotoSizePreset = "passport" | "stamp" | "custom"
export type PhotoCount = 6 | 8 | 12

export interface PhotoSpec {
  preset: PhotoSizePreset
  customWidthMm: number
  customHeightMm: number
  count: PhotoCount
}

export interface WizardContextType {
  currentStep: WizardStep
  selectedCountry: string | null
  photoData: {
    original: string | null
    processed: string | null
  }
  photoSpec: PhotoSpec
  goToStep: (step: WizardStep) => void
  selectCountry: (country: string) => void
  setPhotoData: (data: { original?: string | null; processed?: string | null }) => void
  setPhotoSpec: (data: Partial<PhotoSpec>) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

const steps: WizardStep[] = ["capture", "processing", "preview"]

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("capture")
  const [selectedCountry, setSelectedCountry] = useState<string | null>("india")
  const [photoData, setPhotoDataState] = useState<{ original: string | null; processed: string | null }>({ original: null, processed: null })
  const [photoSpec, setPhotoSpecState] = useState<PhotoSpec>({
    preset: "passport",
    customWidthMm: 35,
    customHeightMm: 45,
    count: 6,
  })

  const goToStep = (step: WizardStep) => setCurrentStep(step)

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const setPhotoData = (data: { original?: string | null; processed?: string | null }) => {
    setPhotoDataState((prev) => ({
      original: data.original ?? prev.original,
      processed: data.processed ?? prev.processed,
    }))
  }

  const setPhotoSpec = (data: Partial<PhotoSpec>) => {
    setPhotoSpecState((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const reset = () => {
    setCurrentStep("capture")
    setSelectedCountry("india")
    setPhotoDataState({ original: null, processed: null })
    setPhotoSpecState({
      preset: "passport",
      customWidthMm: 35,
      customHeightMm: 45,
      count: 6,
    })
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        selectedCountry,
        photoData,
        photoSpec,
        goToStep,
        selectCountry,
        setPhotoData,
        setPhotoSpec,
        nextStep,
        prevStep,
        reset,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard(): WizardContextType {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}
