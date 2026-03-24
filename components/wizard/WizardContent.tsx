"use client"

import { useWizard } from "@/lib/hooks"
import { CountrySelectorStep } from "@/components/wizard/CountrySelectorStep"
import { PhotoCaptureStep } from "@/components/wizard/PhotoCaptureStep"
import { ProcessingStep } from "@/components/wizard/ProcessingStep"
import { PreviewStep } from "@/components/wizard/PreviewStep"

export function WizardContent() {
  const { currentStep } = useWizard()

  return (
    <>
      {currentStep === "country" && <CountrySelectorStep />}
      {currentStep === "capture" && <PhotoCaptureStep />}
      {currentStep === "processing" && <ProcessingStep />}
      {currentStep === "preview" && <PreviewStep />}
    </>
  )
}
