"use client"

import { motion } from "framer-motion"
import { useWizard } from "@/lib/hooks"
import { Aperture, Sparkles, Scissors, Target, Check } from "lucide-react"
import Link from "next/link"

const STEPS = [
  { key: "capture", label: "Upload", icon: Aperture },
  { key: "processing", label: "Remove BG", icon: Sparkles },
  { key: "crop", label: "Crop", icon: Scissors },
  { key: "preview", label: "Download", icon: Target },
] as const

export function StepProgressBar() {
  const { currentStep } = useWizard()
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-lg"
        aria-label="PrintfY home"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-[0_6px_14px_rgba(255,90,54,0.3)]">
          <Aperture className="h-3.5 w-3.5 text-primary-foreground" />
        </span>
        <span className="font-display text-sm font-bold text-foreground hidden sm:block">PrintfY</span>
      </Link>

      {/* Steps */}
      <ol
        role="list"
        aria-label="Wizard progress"
        className="flex flex-1 items-center justify-between gap-1"
      >
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIndex
          const isActive = idx === currentIndex
          const StepIcon = step.icon

          return (
            <li key={step.key} className="flex items-center flex-1 last:flex-none">
              <div
                className="flex flex-col items-center gap-1 relative"
                aria-current={isActive ? "step" : undefined}
              >
                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute -top-1 -left-1 h-8 w-8 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span
                  className={[
                    "relative w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors",
                    isComplete
                      ? "bg-success-500 text-white"
                      : isActive
                      ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(255,90,54,0.4)]"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                <span
                  className={[
                    "text-[10px] sm:text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors",
                    isActive ? "text-primary" : isComplete ? "text-success-500" : "text-muted-foreground",
                  ].join(" ")}
                >
                  <StepIcon className="h-3 w-3 hidden sm:inline" />
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-2 h-px bg-border overflow-hidden rounded-full mb-4" aria-hidden>
                  <motion.div
                    className="h-full bg-success-500"
                    initial={false}
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
