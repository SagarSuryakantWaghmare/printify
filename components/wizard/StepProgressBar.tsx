"use client"

import { useWizard } from "@/lib/hooks"
import { motion } from "framer-motion"

export function StepProgressBar() {
  const { currentStep } = useWizard()

  const steps = [
    { id: "country", label: "Country", order: 1 },
    { id: "capture", label: "Capture", order: 2 },
    { id: "processing", label: "Processing", order: 3 },
    { id: "preview", label: "Preview", order: 4 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep) + 1

  return (
    <div className="w-full">
      {/* Mobile: Text pill only */}
      <div className="md:hidden text-center py-4">
        <span className="inline-block px-4 py-2 rounded-full bg-[#F7F7F8] text-sm font-600 text-[#1a1a1a]">
          Step {currentStepIndex} of 4
        </span>
      </div>

      {/* Tablet+: Full progress bar */}
      <div className="hidden md:flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step circle */}
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-600 text-sm transition-all flex-shrink-0 ${
                currentStepIndex > step.order
                  ? "bg-[#1D9E75] text-white"
                  : currentStepIndex === step.order
                    ? "bg-[#FF5A36] text-white"
                    : "bg-[#E5E5E5] text-[#6b7280]"
              }`}
              animate={{
                scale: currentStepIndex === step.order ? 1.1 : 1,
              }}
            >
              {currentStepIndex > step.order ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.order
              )}
            </motion.div>

            {/* Step label */}
            <div className="ml-3">
              <p
                className={`text-sm font-600 ${
                  currentStepIndex >= step.order
                    ? "text-[#1a1a1a]"
                    : "text-[#6b7280]"
                }`}
              >
                {step.label}
              </p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <motion.div
                className="flex-1 h-1 bg-[#E5E5E5] mx-4"
                animate={{
                  backgroundColor:
                    currentStepIndex > step.order ? "#1D9E75" : "#E5E5E5",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
