"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckIcon } from "@/components/ui/icons"

const STAGES = [
  { label: "Analysing photo", detail: "Checking image quality and face position…" },
  { label: "Removing background", detail: "AI separating you from the background in your browser (private & free)…" },
]

const TIPS = [
  "Your photo is processed 100% locally - it never leaves your device!",
  "AI background removal works best with clear face visibility",
  "Good lighting in your original photo means better results",
  "The final output will be cropped to Indian passport spec (35×45mm)",
]

function StageIcon({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done")
    return (
      <motion.div 
        initial={{ scale: 0.6, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-7 h-7 rounded-full bg-[#1D9E75] flex items-center justify-center shadow-md shadow-[#1D9E75]/30">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </motion.div>
    )
  if (state === "active")
    return (
      <div className="relative w-7 h-7 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full border-2 border-[#FF5A36]/40"
          animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="w-3.5 h-3.5 rounded-full bg-[#FF5A36] shadow-lg shadow-[#FF5A36]/40"
          animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
      </div>
    )
  return (
    <div className="w-7 h-7 rounded-full bg-[#E5E5E5] flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-[#d1d5db]" />
    </div>
  )
}

export function ProcessingStep() {
  const { photoData, setPhotoData, nextStep } = useWizard()
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [modelProgress, setModelProgress] = useState(0) // 0-100 while model downloads
  const hasStarted = useRef(false)

  const runPipeline = async () => {
    if (!photoData.original) return
    hasStarted.current = true
    setError(null)
    setStage(0)

    try {
      // Stage 0: brief analysis pause
      await new Promise((r) => setTimeout(r, 700))
      setStage(1)

      // Stage 1: BG removal via @imgly/background-removal (local model files, no CDN)
      const { removeBackground } = await import("@imgly/background-removal")

      const res = await fetch(photoData.original)
      const blob = await res.blob()

      const transparentBlob = await removeBackground(blob, {
        // Model files are served from public/bg-removal/ folder
        publicPath: `${window.location.origin}/bg-removal/`,
        // Use the smaller/faster fp16 model
        model: "isnet_fp16",
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100)
            setModelProgress(pct)
            console.log(`BG model: ${key} ${pct}%`)
          }
        },
      })

      const transparentUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(transparentBlob)
      })

      setPhotoData({ transparent: transparentUrl })
      setPreviewUrl(transparentUrl)
      setStage(2) // done

      await new Promise((r) => setTimeout(r, 400))
      nextStep() // → CropStep
    } catch (err) {
      console.error("BG removal error:", err)
      setError(err instanceof Error ? err.message : "Background removal failed. Please try again.")
    }
  }

  useEffect(() => {
    if (!hasStarted.current) runPipeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stageProgress = (Math.min(stage, STAGES.length) / STAGES.length) * 100
  // While model is downloading show model progress, otherwise show stage progress
  const progress = stage === 1 && modelProgress > 0 && modelProgress < 100
    ? modelProgress
    : stageProgress

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-20 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 shadow-lg shadow-red-100"
        >
          <AlertCircle className="h-8 w-8 text-red-500" />
        </motion.div>
        <div>
          <p className="text-xl font-semibold text-slate-900">Background Removal Failed</p>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">{error}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => { hasStarted.current = false; runPipeline() }}
            className="rounded-xl bg-[#FF5A36] text-white hover:bg-[#e04e2d] px-6 py-3 shadow-lg hover:shadow-xl transition-all">
            <RefreshCw className="mr-2 h-4 w-4" />Try Again
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // Random tip to show during processing
  const tipIndex = Math.floor((stage + modelProgress / 50) % TIPS.length)

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] flex items-center gap-3">
          Removing Background
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-8 w-8 text-[#FF5A36]" />
          </motion.div>
        </h1>
        <p className="mt-1 text-base text-[#6b7280]">
          {stage < STAGES.length ? STAGES[Math.min(stage, STAGES.length - 1)].detail : "Done! Taking you to the crop editor…"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Live preview */}
        <div className="hidden md:flex items-center justify-center">
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div key="preview"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22%23e5e7eb%22/%3E%3Crect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e5e7eb%22/%3E%3C/svg%3E')] w-full max-w-[200px] aspect-[35/45] border border-slate-200 shadow-sm"
              >
                {(previewUrl ?? photoData.original) && (
                  <Image src={previewUrl ?? photoData.original!} alt="Processing"
                    fill className="object-cover" sizes="200px" />
                )}
              </motion.div>
            ) : (
              <motion.div key="skeleton"
                className="relative rounded-2xl overflow-hidden w-full max-w-[200px] aspect-[35/45] border border-slate-200 shadow-sm bg-[#F3F4F6]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stage list + progress */}
        <div className="md:col-span-2 space-y-7">
          <div className="space-y-5">
            {STAGES.map((s, idx) => {
              const state = idx < stage ? "done" : idx === stage ? "active" : "pending"
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }} className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5"><StageIcon state={state} /></div>
                  <div>
                    <p className={`font-semibold ${state !== "pending" ? "text-[#1a1a1a]" : "text-[#9ca3af]"}`}>{s.label}</p>
                    {state === "active" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-sm text-[#6b7280] mt-0.5">{s.detail}</motion.p>
                    )}
                    {state === "done" && (
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-[#1D9E75] font-semibold">Complete</p>
                        <CheckIcon className="w-4 h-4 text-[#1D9E75]" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#6b7280]">Processing</span>
                <span className="text-sm font-semibold text-[#1a1a1a]">{Math.round(progress)}%</span>
              </div>
              <div className="relative w-full h-3 bg-[#E5E5E5] rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FF5A36] via-[#FF8C6B] to-[#FF5A36] rounded-full shadow-lg"
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 0.5, ease: "easeOut" }} 
                />
                {stage < STAGES.length && (
                  <motion.div 
                    className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm"
                    animate={{ x: ["-100%", "500%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
                  />
                )}
              </div>
            </div>
            <p className="text-xs text-[#6b7280]">
              {stage === 1 && modelProgress > 0 && modelProgress < 100
                ? `Loading AI model… ${modelProgress}%`
                : stage >= STAGES.length
                  ? "All done! Taking you to crop…"
                  : `${STAGES[Math.min(stage, STAGES.length - 1)]?.label || "Processing"}`}
            </p>
          </div>

          <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-3 text-sm text-[#166534]">
            🔒 Background removal runs <strong>entirely in your browser</strong> — your photo stays private.
          </div>

          {/* Dynamic tip during processing */}
          <AnimatePresence mode="wait">
            {stage < STAGES.length && (
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 flex items-start gap-3"
              >
                <Lightbulb className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-sm text-[#92400E]">{TIPS[tipIndex]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
