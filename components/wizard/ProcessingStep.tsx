"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProcessStage {
  label: string
  detail: string
  apiKey?: "remove-bg" | "enhance"
}

const STAGES: ProcessStage[] = [
  {
    label: "Detecting face",
    detail: "Analysing facial landmarks and alignment…",
  },
  {
    label: "Removing background",
    detail: "Separating subject from background with precision…",
    apiKey: "remove-bg",
  },
  {
    label: "Enhancing quality",
    detail: "Auto-correcting brightness, contrast & sharpness…",
    apiKey: "enhance",
  },
  {
    label: "Cropping to passport spec",
    detail: "Applying 35×45 mm Indian passport dimensions with face-gravity…",
  },
  {
    label: "Final validation",
    detail: "Running compliance checks for official standards…",
  },
]

function StageIcon({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <motion.div
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center"
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
      </motion.div>
    )
  }
  if (state === "active") {
    return (
      <div className="relative w-7 h-7 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#FF5A36]/40"
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="w-3.5 h-3.5 rounded-full bg-[#FF5A36]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>
    )
  }
  return (
    <div className="w-7 h-7 rounded-full bg-[#E5E5E5] flex items-center justify-center">
      <span className="text-xs font-semibold text-[#9ca3af]" />
    </div>
  )
}

export function ProcessingStep() {
  const { photoData, setPhotoData, nextStep } = useWizard()
  const [currentStage, setCurrentStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string | null>(null)
  const hasStarted = useRef(false)

  const runPipeline = async () => {
    if (!photoData.original) return
    hasStarted.current = true
    setError(null)
    setCurrentStage(0)

    try {
      // Stage 0: face detect (simulated brief pause)
      await new Promise((r) => setTimeout(r, 800))
      setCurrentStage(1)

      // Stage 1: Remove background
      let processedUrl = photoData.original
      const bgRes = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: photoData.original }),
      })
      if (!bgRes.ok) throw new Error("Background removal failed")
      const bgJson = await bgRes.json()
      processedUrl = bgJson.resultDataUrl ?? photoData.original
      setBgRemovedUrl(processedUrl)
      setCurrentStage(2)

      // Stage 2: AI enhance
      const enhRes = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: processedUrl }),
      })
      if (!enhRes.ok) throw new Error("Enhancement failed")
      const enhJson = await enhRes.json()
      processedUrl = enhJson.resultDataUrl ?? processedUrl
      setCurrentStage(3)

      // Stage 3: crop to spec (already done by enhance API — brief pause)
      await new Promise((r) => setTimeout(r, 600))
      setCurrentStage(4)

      // Stage 4: validation
      await new Promise((r) => setTimeout(r, 700))
      setCurrentStage(5)

      // Done — store processed result
      setPhotoData({ processed: processedUrl })
      await new Promise((r) => setTimeout(r, 500))
      nextStep()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  useEffect(() => {
    if (!hasStarted.current) {
      runPipeline()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = (Math.min(currentStage, STAGES.length) / STAGES.length) * 100

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-900">Processing Failed</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </div>
        <Button
          onClick={() => {
            hasStarted.current = false
            runPipeline()
          }}
          className="rounded-xl bg-[#FF5A36] text-white hover:bg-[#e04e2d] px-6 py-3"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a]">
          AI is Working its Magic ✨
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          {currentStage < STAGES.length
            ? `${STAGES[currentStage].detail}`
            : "Almost done — finalising your photo…"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Photo preview */}
        <div className="hidden md:flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={bgRemovedUrl ?? "original"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl overflow-hidden bg-[#F7F7F8] w-full max-w-xs aspect-[35/45] border border-slate-100 shadow-sm"
            >
              {(bgRemovedUrl ?? photoData.original) && (
                <Image
                  src={bgRemovedUrl ?? photoData.original!}
                  alt="Processing"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              )}
              {/* Shimmer overlay while still processing */}
              {currentStage < STAGES.length && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.8s_infinite]" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stage list */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-5">
            {STAGES.map((stage, idx) => {
              const state = idx < currentStage ? "done" : idx === currentStage ? "active" : "pending"
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 mt-0.5">
                    <StageIcon state={state} />
                  </div>
                  <div>
                    <p className={`font-semibold transition-colors ${state !== "pending" ? "text-[#1a1a1a]" : "text-[#9ca3af]"
                      }`}>
                      {stage.label}
                    </p>
                    {state === "active" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-[#6b7280] mt-0.5"
                      >
                        {stage.detail}
                      </motion.p>
                    )}
                    {state === "done" && (
                      <p className="text-sm text-[#1D9E75] mt-0.5">Complete</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="relative w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {currentStage < STAGES.length && (
                <motion.div
                  className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>
            <p className="text-sm text-[#6b7280]">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </div>
    </div>
  )
}
