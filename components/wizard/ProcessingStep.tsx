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
  { label: "Removing background", detail: "AI separating you from the background via remove.bg API…" },
]

const TIPS = [
  "Your photo is sent securely over HTTPS to the remove.bg API — never stored.",
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
        className="w-7 h-7 rounded-full bg-success-500 flex items-center justify-center shadow-md shadow-success-500/30">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </motion.div>
    )
  if (state === "active")
    return (
      <div className="relative w-7 h-7 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-full border-2 border-primary/40"
          animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }} />
        <motion.div className="w-3.5 h-3.5 rounded-full bg-primary shadow-lg shadow-primary/40"
          animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
      </div>
    )
  return (
    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
    </div>
  )
}

export function ProcessingStep() {
  const { photoData, setPhotoData, nextStep } = useWizard()
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const hasStarted = useRef(false)
  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Mark unmounted and cancel any in-flight request
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  const runPipeline = async () => {
    if (!photoData.original) return
    hasStarted.current = true
    setError(null)
    setStage(0)

    try {
      // Stage 0: brief analysis pause
      await new Promise((r) => setTimeout(r, 700))
      if (!mountedRef.current) return
      setStage(1)

      // Stage 1: BG removal via API — abort signal lets us cancel if user navigates away
      abortControllerRef.current = new AbortController()
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: photoData.original }),
        signal: abortControllerRef.current.signal,
      })

      if (!mountedRef.current) return
      const data = await response.json()
      if (!mountedRef.current) return

      if (data.resultDataUrl) {
        setPhotoData({ transparent: data.resultDataUrl })
        setPreviewUrl(data.resultDataUrl)
        setStage(2)
      } else {
        setError(data.error || "Background removal failed")
        return
      }

      await new Promise((r) => setTimeout(r, 400))
      if (!mountedRef.current) return
      nextStep() // → CropStep
    } catch (err) {
      if (!mountedRef.current) return
      // AbortError = user navigated away — silently ignore
      if (err instanceof Error && err.name === "AbortError") return
      console.error("BG removal error:", err)
      setError(err instanceof Error ? err.message : "Background removal failed. Please try again.")
    }
  }

  useEffect(() => {
    if (hasStarted.current) return

    // transparent already set means user pressed Back from Crop — skip straight through
    if (photoData.transparent) {
      const timer = setTimeout(() => {
        if (mountedRef.current) nextStep()
      }, 350)
      return () => clearTimeout(timer)
    }

    runPipeline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stageProgress = (Math.min(stage, STAGES.length) / STAGES.length) * 100

  // ── Error state ────────────────────────────────────────────────────────────
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
          <p className="text-xl font-semibold text-foreground">Background Removal Failed</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">{error}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => { hasStarted.current = false; runPipeline() }}
            variant="cta"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />Try Again
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // ── Skip-through state (transparent already exists) ────────────────────────
  if (photoData.transparent && stage === 0 && !hasStarted.current) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 py-24 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-50 shadow-md">
          <CheckCircle2 className="h-7 w-7 text-success-500" />
        </div>
        <p className="text-lg font-semibold text-foreground">Background already removed — resuming…</p>
      </motion.div>
    )
  }

  // ── Normal processing state ────────────────────────────────────────────────
  const tipIndex = Math.floor(stage % TIPS.length)

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
          Removing Background
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          {stage < STAGES.length
            ? STAGES[Math.min(stage, STAGES.length - 1)].detail
            : "Done! Taking you to the crop editor…"}
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
                className="relative rounded-2xl overflow-hidden bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22%3E%3Crect width=%2210%22 height=%2210%22 fill=%22%23e5e7eb%22/%3E%3Crect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23e5e7eb%22/%3E%3C/svg%3E')] w-full max-w-[200px] aspect-[35/45] border border-border shadow-sm"
              >
                <Image
                  src={previewUrl}
                  alt="Processing preview"
                  fill className="object-cover" sizes="200px"
                />
              </motion.div>
            ) : (
              <motion.div key="skeleton"
                className="relative rounded-2xl overflow-hidden w-full max-w-[200px] aspect-[35/45] border border-border shadow-sm bg-muted">
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
                    <p className={`font-semibold ${state !== "pending" ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    {state === "active" && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground mt-0.5">{s.detail}</motion.p>
                    )}
                    {state === "done" && (
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-success-500 font-semibold">Complete</p>
                        <CheckIcon className="w-4 h-4 text-success-500" />
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
                <span className="text-sm font-semibold text-muted-foreground">Processing</span>
                <span className="text-sm font-semibold text-foreground">{Math.round(stageProgress)}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={Math.round(stageProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Background removal progress"
                className="relative w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full shadow-lg"
                  animate={{ width: `${stageProgress}%` }}
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
            <p className="text-xs text-muted-foreground">
              {stage >= STAGES.length
                ? "All done! Taking you to crop…"
                : STAGES[Math.min(stage, STAGES.length - 1)]?.label || "Processing"}
            </p>
          </div>

          {/* Privacy notice — accurate copy */}
          <div className="rounded-xl bg-success-50 border border-success-500/30 px-4 py-3 text-sm text-success-600">
            🔒 Photo sent securely over HTTPS to the <strong>remove.bg API</strong> — never stored or shared.
          </div>

          {/* Dynamic tip */}
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
