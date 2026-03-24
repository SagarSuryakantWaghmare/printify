"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type WizardStep = "country" | "capture" | "processing" | "preview"

interface WizardContextType {
  currentStep: WizardStep
  selectedCountry: string | null
  photoData: {
    original: string | null
    processed: string | null
  }
  goToStep: (step: WizardStep) => void
  selectCountry: (country: string) => void
  setPhotoData: (data: { original?: string | null; processed?: string | null }) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

const steps: WizardStep[] = ["country", "capture", "processing", "preview"]

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("country")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [photoData, setPhotoDataState] = useState<{ original: string | null; processed: string | null }>({ original: null, processed: null })

  const goToStep = (step: WizardStep) => setCurrentStep(step)

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    // Auto-advance to next step after selection
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
    setCurrentStep("country")
    setSelectedCountry(null)
    setPhotoDataState({ original: null, processed: null })
  }

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        selectedCountry,
        photoData,
        goToStep,
        selectCountry,
        setPhotoData,
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
