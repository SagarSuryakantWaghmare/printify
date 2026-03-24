"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepProgressBar } from "@/components/wizard/StepProgressBar"
import { useWizard, WizardProvider } from "@/lib/hooks"

interface WizardLayoutProps {
  children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { currentStep, prevStep } = useWizard()

  return (
    <div className="min-h-screen bg-white">
      {/* Header with progress bar */}
      <div className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white">
        <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-4 md:py-6">
          <StepProgressBar />
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Fixed bottom navigation button */}
      {currentStep !== "country" && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[#E5E5E5] bg-white p-4">
          <button
            onClick={prevStep}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] font-600 hover:bg-[#F7F7F8] transition-colors"
          >
            ← Go Back
          </button>
        </div>
      )}

      {/* Tablet+: Side-by-side navigation */}
      {currentStep !== "country" && (
        <div className="hidden md:flex justify-between items-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 gap-4">
          <button
            onClick={prevStep}
            className="px-6 py-3 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] font-600 hover:bg-[#F7F7F8] transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
