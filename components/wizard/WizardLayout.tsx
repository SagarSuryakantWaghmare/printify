"use client"

import { ReactNode, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepProgressBar } from "@/components/wizard/StepProgressBar"
import { useWizard } from "@/lib/hooks"
import { ChevronLeft } from "lucide-react"

interface WizardLayoutProps {
  children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { currentStep, prevStep } = useWizard()

  // Warn before accidental back-navigation / tab close mid-wizard
  useEffect(() => {
    if (currentStep === "capture") return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [currentStep])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && currentStep !== "capture") {
      prevStep()
    }
  }, [currentStep, prevStep])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-[100svh] bg-white">
      {/* Subtle gradient bg matching landing */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_-10%,rgba(255,90,54,0.06),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(29,158,117,0.05),transparent_28%)]" />

      {/* Sticky header - safe area aware */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/95 backdrop-blur-xl shadow-sm safe-top"
      >
        <div className="px-3 sm:px-6 md:px-8 max-w-5xl mx-auto py-3 sm:py-4 md:py-5 safe-x">
          <StepProgressBar />
        </div>
      </motion.div>

      {/* Main content - mobile optimized padding */}
      <div className="px-3 sm:px-6 md:px-8 max-w-5xl mx-auto py-5 sm:py-8 md:py-12 pb-28 sm:pb-32 md:pb-16 safe-x">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom back button - safe area aware */}
      {currentStep !== "capture" && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[#E5E5E5] bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-bottom safe-x"
        >
          <div className="p-3 sm:p-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="w-full h-12 px-4 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] font-semibold hover:bg-[#F7F7F8] active:bg-slate-100 transition-all flex items-center justify-center gap-2 touch-target"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Desktop back button */}
      {currentStep !== "capture" && (
        <div className="hidden md:flex px-4 sm:px-6 md:px-8 max-w-5xl mx-auto pb-10">
          <motion.button
            whileHover={{ scale: 1.02, x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="px-6 py-2.5 rounded-xl border border-[#E5E5E5] text-[#1a1a1a] text-sm font-semibold hover:bg-[#F7F7F8] hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-2 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>
          <span className="ml-4 text-xs text-slate-400 self-center">(Press Esc to go back)</span>
        </div>
      )}
    </div>
  )
}
