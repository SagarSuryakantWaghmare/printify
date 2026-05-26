"use client"

import { ReactNode, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StepProgressBar } from "@/components/wizard/StepProgressBar"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface WizardLayoutProps {
  children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const { currentStep, prevStep } = useWizard()
  const isFirst = currentStep === "capture"

  // Warn before accidental back-navigation / tab close mid-wizard
  useEffect(() => {
    if (isFirst) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isFirst])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "Escape" && !isFirst) prevStep()
    },
    [isFirst, prevStep]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-[100svh] bg-background">
      {/* Subtle gradient bg matching landing */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_-10%,rgba(255,90,54,0.06),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(29,158,117,0.05),transparent_28%)]" />

      {/* Sticky header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl safe-top">
        <div className="px-3 sm:px-6 md:px-8 max-w-5xl mx-auto py-3 sm:py-4 safe-x">
          <StepProgressBar />
        </div>
      </div>

      {/* Main content. Bottom padding leaves room for mobile back bar (64px + safe area). */}
      <div className="px-3 sm:px-6 md:px-8 max-w-5xl mx-auto py-5 sm:py-8 md:py-12 pb-32 md:pb-16 safe-x">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {/* Desktop back button */}
        {!isFirst && (
          <div className="hidden md:flex items-center gap-3 pt-10">
            <Button variant="outline" size="lg" onClick={prevStep} className="group">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </Button>
            <span className="text-xs text-muted-foreground">Press Esc to go back</span>
          </div>
        )}
      </div>

      {/* Mobile bottom back bar */}
      {!isFirst && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border bg-background/95 backdrop-blur-xl shadow-[0_-4px_18px_rgba(0,0,0,0.06)] safe-bottom safe-x z-30">
          <div className="p-3">
            <Button variant="outline" size="xl" onClick={prevStep} className="w-full">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
