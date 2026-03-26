"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepProgressBar } from "@/components/wizard/StepProgressBar"
import { useWizard } from "@/lib/hooks"

interface WizardLayoutProps {
  children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { currentStep, prevStep } = useWizard()

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle gradient bg matching landing */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_-10%,rgba(255,90,54,0.06),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(29,158,117,0.05),transparent_28%)]" />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md">
        <div className="px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-4 md:py-5">
          <StepProgressBar />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 md:px-8 max-w-5xl mx-auto py-8 md:py-12 pb-32 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom back button */}
      {currentStep !== "capture" && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[#E5E5E5] bg-white/95 backdrop-blur-sm p-4">
          <button
            onClick={prevStep}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] font-semibold hover:bg-[#F7F7F8] transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Desktop back button */}
      {currentStep !== "capture" && (
        <div className="hidden md:flex px-4 sm:px-6 md:px-8 max-w-5xl mx-auto pb-10">
          <button
            onClick={prevStep}
            className="px-6 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] text-sm font-semibold hover:bg-[#F7F7F8] transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
