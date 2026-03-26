"use client"

import { motion } from "framer-motion"
import { useWizard } from "@/lib/hooks"
import { Aperture } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { key: "capture", label: "Upload", emoji: "📷" },
  { key: "processing", label: "AI Magic", emoji: "✨" },
  { key: "preview", label: "Download", emoji: "🎯" },
] as const

export function StepProgressBar() {
  const { currentStep } = useWizard()
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A36] shadow-[0_6px_16px_rgba(255,90,54,0.3)]">
          <Aperture className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-display text-base font-bold text-[#111827] hidden sm:block">PrintfY</span>
      </Link>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIndex
          const isActive = idx === currentIndex

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="relative flex items-center justify-center">
                  {/* Glow ring on active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "rgba(255, 90, 54, 0.2)",
                        width: 36,
                        height: 36,
                        top: -6,
                        left: -6,
                      }}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0.3, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isComplete
                        ? "bg-[#1D9E75] text-white"
                        : isActive
                          ? "bg-[#FF5A36] text-white shadow-[0_4px_12px_rgba(255,90,54,0.4)]"
                          : "bg-[#E5E5E5] text-[#9ca3af]"
                      }`}
                  >
                    {isComplete ? "✓" : idx + 1}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? "text-[#FF5A36]" : isComplete ? "text-[#1D9E75]" : "text-[#9ca3af]"
                    }`}
                >
                  <span className="hidden sm:inline">{step.emoji} </span>{step.label}
                </span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div className="mx-3 sm:mx-5 h-px w-12 sm:w-20 bg-[#E5E5E5] overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#1D9E75] to-[#1D9E75]"
                    animate={{ width: isComplete || (isActive && idx === 0) ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
