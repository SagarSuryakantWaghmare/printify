"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { motion } from "framer-motion"
import { CheckCircle2, Loader } from "lucide-react"

const PROCESSING_STEPS = [
  "Detecting face",
  "Removing background",
  "Enhancing quality",
  "Cropping to spec",
  "Validating standards",
]

function ProcessingStepItem({
  step,
  index,
  currentStep,
}: {
  step: string
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
          <motion.div
            className="w-6 h-6 rounded-full bg-[#FF5A36] flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Loader className="w-4 h-4 text-white" />
          </motion.div>
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
          <p className="text-sm text-[#6b7280] mt-1">Processing...</p>
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

  useEffect(() => {
    // Auto-advance through processing steps
    if (currentStep < PROCESSING_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1200)
      return () => clearTimeout(timer)
    } else {
      // When all steps complete, advance to next wizard step
      const timer = setTimeout(() => {
        nextStep()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [currentStep, nextStep])

  const progress = ((currentStep + 1) / PROCESSING_STEPS.length) * 100

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Creating Your Perfect Photo
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          AI is processing your image...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Photo preview - Desktop only */}
        <div className="hidden md:flex items-center justify-center">
          {photoData.original && (
            <div className="rounded-2xl overflow-hidden bg-[#F7F7F8] w-full max-w-xs aspect-square">
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
                step={step}
                index={idx}
                currentStep={currentStep}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2 pt-4">
            <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF5A36]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-[#6b7280]">
              ~{Math.ceil((PROCESSING_STEPS.length - currentStep) * 1.2)} sec remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
