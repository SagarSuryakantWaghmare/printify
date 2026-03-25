"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const PROCESSING_STEPS = [
  {
    label: "Detecting face",
    detail: "Aligning eye-line and framing for compliant composition.",
  },
  {
    label: "Removing background",
    detail: "Separating subject edges for a clean, neutral backdrop.",
  },
  {
    label: "Enhancing quality",
    detail: "Balancing exposure and sharpness for print-ready output.",
  },
  {
    label: "Cropping to spec",
    detail: "Applying Indian passport dimensions and safe margins.",
  },
  {
    label: "Validating standards",
    detail: "Running final compliance checks before export.",
  },
]

const STEP_TIMINGS_MS = [900, 1250, 1000, 1150, 900]

function ProcessingStepItem({
  step,
  detail,
  index,
  currentStep,
}: {
  step: string
  detail: string
  index: number
  currentStep: number
}) {
  const isComplete = index < currentStep
  const isActive = index === currentStep

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4"
    >
      <div className="shrink-0 mt-1">
        {isComplete ? (
          <motion.div
            className="w-6 h-6 rounded-full bg-[#1D9E75] flex items-center justify-center"
            animate={{ scale: [0.8, 1] }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </motion.div>
        ) : isActive ? (
          <div className="relative w-6 h-6 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border border-[#FF5A36]/50"
              animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-[#FF5A36]"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#E5E5E5] flex items-center justify-center">
            <span className="text-xs font-600 text-[#6b7280]">
              {index + 1}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p
          className={`font-600 transition-colors ${
            isActive || isComplete
              ? "text-[#1a1a1a]"
              : "text-[#6b7280]"
          }`}
        >
          {step}
        </p>
        {isActive && (
          <p className="text-sm text-[#6b7280] mt-1">{detail}</p>
        )}
        {isComplete && (
          <p className="text-sm text-[#1D9E75] mt-1">Complete</p>
        )}
      </div>
    </motion.div>
  )
}

export function ProcessingStep() {
  const { photoData, nextStep } = useWizard()
  const [currentStep, setCurrentStep] = useState(0)
  const activeStep = PROCESSING_STEPS[Math.min(currentStep, PROCESSING_STEPS.length - 1)]

  useEffect(() => {
    // Auto-advance through processing steps
    if (currentStep < PROCESSING_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, STEP_TIMINGS_MS[currentStep])
      return () => clearTimeout(timer)
    } else {
      // When all steps complete, advance to next wizard step
      const timer = setTimeout(() => {
        nextStep()
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [currentStep, nextStep])

  const progress =
    (Math.min(currentStep, PROCESSING_STEPS.length) / PROCESSING_STEPS.length) * 100
  const remainingMs = STEP_TIMINGS_MS.slice(currentStep).reduce((sum, ms) => sum + ms, 0)

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Creating Your Perfect Photo
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          {currentStep < PROCESSING_STEPS.length
            ? `${activeStep.label}...`
            : "Finalizing your export..."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Photo preview - Desktop only */}
        <div className="hidden md:flex items-center justify-center">
          {photoData.original && (
            <div className="relative rounded-2xl overflow-hidden bg-[#F7F7F8] w-full max-w-xs aspect-square">
              <Image
                src={photoData.original}
                alt="Processing"
                fill
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            </div>
          )}
        </div>

        {/* Processing steps */}
        <div className="md:col-span-2 space-y-6">
          {/* Steps list */}
          <div className="space-y-4">
            {PROCESSING_STEPS.map((step, idx) => (
              <ProcessingStepItem
                key={idx}
                step={step.label}
                detail={step.detail}
                index={idx}
                currentStep={currentStep}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2 pt-4">
            <div className="relative w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF5A36]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
              {currentStep < PROCESSING_STEPS.length && (
                <motion.div
                  className="absolute inset-y-0 w-14 bg-linear-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ["-40%", "120%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            <p className="text-sm text-[#6b7280]">
              ~{Math.max(1, Math.ceil(remainingMs / 1000))} sec remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
