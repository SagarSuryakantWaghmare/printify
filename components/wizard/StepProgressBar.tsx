"use client"

import { motion } from "framer-motion"
import { useWizard } from "@/lib/hooks"
import { Aperture } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { key: "capture", label: "Upload", emoji: "📷" },
  { key: "processing", label: "Remove BG", emoji: "✨" },
  { key: "crop", label: "Crop", emoji: "✂️" },
  { key: "preview", label: "Download", emoji: "🎯" },
] as const

export function StepProgressBar() {
  const { currentStep } = useWizard()
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A36] shadow-[0_6px_16px_rgba(255,90,54,0.3)]">
          <Aperture className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-display text-sm font-bold text-[#111827] hidden sm:block">PrintfY</span>
      </Link>

      {/* Steps row */}
      <div className="flex flex-1 items-center justify-between">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIndex
          const isActive = idx === currentIndex

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-0.5 relative">
                {/* Glow on active */}
                {isActive && (
                  <motion.div
                    className="absolute rounded-full bg-[#FF5A36]/20"
                    style={{ width: 32, height: 32, top: -6, left: -6 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <div className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isComplete ? "bg-[#1D9E75] text-white"
                    : isActive ? "bg-[#FF5A36] text-white shadow-[0_4px_12px_rgba(255,90,54,0.45)]"
                      : "bg-[#E5E5E5] text-[#9ca3af]"
                  }`}>
                  {isComplete ? "✓" : idx + 1}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors mt-0.5 ${isActive ? "text-[#FF5A36]"
                    : isComplete ? "text-[#1D9E75]"
                      : "text-[#9ca3af]"
                  }`}>
                  <span className="hidden sm:inline">{step.emoji} </span>{step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 h-px bg-[#E5E5E5] overflow-hidden rounded-full">
                  <motion.div
                    className="h-full bg-[#1D9E75]"
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
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
