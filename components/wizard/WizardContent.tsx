"use client"

import { useWizard } from "@/lib/hooks"
import { PhotoCaptureStep } from "@/components/wizard/PhotoCaptureStep"
import { ProcessingStep } from "@/components/wizard/ProcessingStep"
import { CropStep } from "@/components/wizard/CropStep"
import { PreviewStep } from "@/components/wizard/PreviewStep"

export function WizardContent() {
  const { currentStep } = useWizard()

  return (
    <>
      {currentStep === "capture" && <PhotoCaptureStep />}
      {currentStep === "processing" && <ProcessingStep />}
      {currentStep === "crop" && <CropStep />}
      {currentStep === "preview" && <PreviewStep />}
    </>
  )
}
