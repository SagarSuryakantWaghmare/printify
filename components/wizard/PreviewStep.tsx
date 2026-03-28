"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import type { BgColor } from "@/lib/hooks/useWizard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Download, LayoutGrid, Contrast, RefreshCw, Sparkles } from "lucide-react"
import {
  buildSheetJpgFile,
  downloadSheetAsJpg,
  downloadSheetAsPdf,
  estimateExportFileSize,
  type ExportQuality,
  getPresetDimensionsMm,
  type SheetPreset,
} from "@/lib/sheet-export"
import { applyBgAndCrop, compositeWithBg } from "@/lib/image-processing"
import { enhanceClientSide } from "@/lib/enhance-client"

const VALIDATION_POINTS = [
  "Face centred & visible",
  "Background applied",
  "Correct dimensions",
  "Print-ready quality",
  "No watermarks",
  "High resolution",
]

const BG_OPTIONS: { value: BgColor; label: string; hex: string }[] = [
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "red", label: "Red", hex: "#c0392b" },
  { value: "black", label: "Black", hex: "#1a1a1a" },
]

export function PreviewStep() {
  const { photoData, photoSpec, setPhotoSpec, setPhotoData, reset } = useWizard()
  const [sheetPreset, setSheetPreset] = useState<SheetPreset>("4x6")
  const [exportQuality, setExportQuality] = useState<ExportQuality>("standard")
  const [isExportingJpg, setIsExportingJpg] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isNativeSharing, setIsNativeSharing] = useState(false)
  const [statusText, setStatusText] = useState<string | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [isApplyingBg, setIsApplyingBg] = useState(false)
  const enhancedRef = useRef(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  // Auto-enhance on mount — client-side canvas sharpen + contrast boost
  useEffect(() => {
    if (enhancedRef.current || !photoData.processed) return
    enhancedRef.current = true
    const run = async () => {
      setIsEnhancing(true)
      try {
        const enhanced = await enhanceClientSide(photoData.processed!)
        setPhotoData({ enhanced })
      } catch (e) {
        console.warn("Client-side enhance failed:", e)
        // Non-fatal — user still gets the processed photo
      } finally {
        setIsEnhancing(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Image for sheet = enhanced > processed > original
  const imageForSheet = photoData.enhanced ?? photoData.processed ?? photoData.original

  const sizeDetails = useMemo(() => {
    const preset = photoSpec.preset === "professional" ? "passport" : photoSpec.preset
    return getPresetDimensionsMm(preset, photoSpec.customWidthMm, photoSpec.customHeightMm)
  }, [photoSpec])

  const widthMm = photoSpec.preset === "professional" ? 51 : sizeDetails.widthMm
  const heightMm = photoSpec.preset === "professional" ? 51 : sizeDetails.heightMm
  const selectedSizeLabel = photoSpec.preset === "professional"
    ? "Professional 51×51 mm"
    : sizeDetails.label

  // Re-apply BG color when user changes it
  const applyNewBg = useCallback(async (color: BgColor) => {
    if (!photoData.transparent) return
    setIsApplyingBg(true)
    try {
      const newProcessed = await applyBgAndCrop({
        transparentDataUrl: photoData.transparent,
        bgColor: color,
        widthMm,
        heightMm,
        outputWidth: 1050,
      })
      setPhotoData({ processed: newProcessed })
    } finally {
      setIsApplyingBg(false)
    }
  }, [photoData.transparent, widthMm, heightMm, setPhotoData])

  const handleBgChange = async (color: BgColor) => {
    setPhotoSpec({ bgColor: color })
    await applyNewBg(color)
  }

  const estimatedJpgSize = useMemo(
    () => estimateExportFileSize({ sheetPreset, quality: exportQuality, format: "jpg" }),
    [sheetPreset, exportQuality]
  )
  const estimatedPdfSize = useMemo(
    () => estimateExportFileSize({ sheetPreset, quality: exportQuality, format: "pdf" }),
    [sheetPreset, exportQuality]
  )

  const makeExportSpec = () => ({
    imageDataUrl: imageForSheet!,
    sheetPreset,
    quality: exportQuality,
    photoSpec: { widthMm, heightMm, count: photoSpec.count },
  })

  const handleDownloadJpg = async () => {
    if (!imageForSheet) return
    setIsExportingJpg(true); setStatusText("Preparing JPG sheet…")
    try { await downloadSheetAsJpg(makeExportSpec()); setStatusText("✓ JPG downloaded!") }
    finally { setIsExportingJpg(false); setTimeout(() => setStatusText(null), 1800) }
  }

  const handleDownloadPdf = async () => {
    if (!imageForSheet) return
    setIsExportingPdf(true); setStatusText("Preparing PDF sheet…")
    try { await downloadSheetAsPdf(makeExportSpec()); setStatusText("✓ PDF downloaded!") }
    finally { setIsExportingPdf(false); setTimeout(() => setStatusText(null), 1800) }
  }

  const handleNativeShare = async () => {
    if (!imageForSheet) return
    setIsNativeSharing(true); setStatusText("Preparing share…")
    try {
      const file = await buildSheetJpgFile(makeExportSpec())
      const canShare = typeof navigator !== "undefined" && "share" in navigator &&
        "canShare" in navigator && navigator.canShare?.({ files: [file] })
      if (canShare) {
        await navigator.share({ files: [file], title: "PrintfY photo sheet" })
        setStatusText("✓ Shared!")
      } else {
        await handleDownloadJpg()
      }
    } finally { setIsNativeSharing(false); setTimeout(() => setStatusText(null), 1800) }
  }

  const busy = isExportingJpg || isExportingPdf || isNativeSharing

  return (
    <div className="space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          Your Photo is Ready! 🎉
        </h1>
        <p className="text-base text-[#6b7280]">{selectedSizeLabel} · {photoSpec.bgColor} background</p>
      </motion.div>

      {/* Enhancement status */}
      {isEnhancing && (
        <div className="flex items-center gap-3 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-3 text-sm text-[#4338CA]">
          <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
          <span><strong>Sharpening photo…</strong> Applying smart enhance for crisp print quality</span>
        </div>
      )}
      {!isEnhancing && photoData.enhanced && (
        <div className="flex items-center gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span><strong>Smart Enhance applied!</strong> Photo sharpened and contrast-boosted for print-ready quality.</span>
        </div>
      )}

      <div className="space-y-3">
        {photoData.original && photoData.processed && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">View:</span>
            <button onClick={() => setShowOriginal(false)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${!showOriginal ? "bg-[#FF5A36] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}>
              AI Result
            </button>
            <button onClick={() => setShowOriginal(true)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5 transition-all ${showOriginal ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}>
              <Contrast className="h-3.5 w-3.5" />Original
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Main photo preview */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              {showOriginal ? "Original Upload" : "AI Enhanced"}
            </p>
            <AnimatePresence mode="wait">
              <motion.div key={showOriginal ? "original" : "processed"}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}
                className="relative rounded-2xl overflow-hidden bg-[#F7F7F8] aspect-[3/4] shadow-md border border-slate-100"
              >
                {(showOriginal ? photoData.original : (photoData.processed ?? photoData.original)) && (
                  <Image
                    src={(showOriginal ? photoData.original : (photoData.processed ?? photoData.original))!}
                    alt={showOriginal ? "Original" : "Enhanced"}
                    fill className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                {isApplyingBg && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-[#FF5A36] animate-spin" />
                  </div>
                )}
                {!showOriginal && !isApplyingBg && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="absolute top-3 right-3 bg-[#1D9E75] text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />Approved
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BG color picker + quality check */}
          <div className="lg:col-span-2 space-y-4">
            {/* BG color */}
            {photoData.transparent && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2">
                <p className="text-sm font-semibold text-[#111827]">Change background colour</p>
                <div className="flex gap-2 flex-wrap">
                  {BG_OPTIONS.map((bg) => (
                    <button key={bg.value}
                      onClick={() => handleBgChange(bg.value)}
                      disabled={isApplyingBg}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border-2 transition-all ${photoSpec.bgColor === bg.value
                        ? "border-[#FF5A36] bg-[#FFF5F0] shadow-sm"
                        : "border-[#E5E7EB] hover:border-[#FF5A36]/40"
                        } disabled:opacity-50`}
                    >
                      <span className="h-5 w-5 rounded-full border border-[#d1d5db]" style={{ background: bg.hex }} />
                      {bg.label}
                      {photoSpec.bgColor === bg.value && <Check className="h-3.5 w-3.5 text-[#FF5A36]" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">Changing colour re-processes the image instantly.</p>
              </div>
            )}

            {/* Quality checklist */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7280] mb-2">Quality Check</p>
              <div className="grid grid-cols-2 gap-2">
                {VALIDATION_POINTS.map((point, idx) => (
                  <motion.div key={idx}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + idx * 0.05 }}
                    className="flex items-center gap-2 rounded-xl bg-[#F7F7F8] px-3 py-2">
                    <Check className="w-4 h-4 text-[#1D9E75] shrink-0" />
                    <p className="text-xs font-semibold text-[#1a1a1a]">{point}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print options */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 space-y-4">
        {/* Count */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#111827]">Print Quantity</p>
            <p className="text-xs text-[#6b7280]">{selectedSizeLabel}</p>
          </div>
          <Tabs value={String(photoSpec.count)} onValueChange={(v) => setPhotoSpec({ count: Number(v) as 6 | 8 | 12 })}>
            <TabsList className="grid h-auto w-[220px] grid-cols-3 rounded-xl bg-[#F8F9FA] p-1">
              {[6, 8, 12].map((c) => (
                <TabsTrigger key={c} value={String(c)} className="rounded-lg py-2 text-sm font-bold">{c}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Sheet type */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#111827]">Sheet type</p>
          <Tabs value={sheetPreset} onValueChange={(v) => setSheetPreset(v as SheetPreset)}>
            <TabsList className="grid h-auto w-[160px] grid-cols-2 rounded-xl bg-[#F8F9FA] p-1">
              <TabsTrigger value="4x6" className="rounded-lg py-2 text-sm font-bold">4×6</TabsTrigger>
              <TabsTrigger value="a4" className="rounded-lg py-2 text-sm font-bold">A4</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Quality */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#111827]">Export quality</p>
          <Tabs value={exportQuality} onValueChange={(v) => setExportQuality(v as ExportQuality)}>
            <TabsList className="grid h-auto w-[190px] grid-cols-2 rounded-xl bg-[#F8F9FA] p-1">
              <TabsTrigger value="standard" className="rounded-lg py-2 text-sm font-bold">Standard</TabsTrigger>
              <TabsTrigger value="low-data" className="rounded-lg py-2 text-sm font-bold">Low Data</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Mini print preview grid */}
        <div className="rounded-xl border border-[#E8EAEE] bg-[#FBFCFD] p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
              <LayoutGrid className="h-3.5 w-3.5" />Sheet Preview
            </span>
            <span className="text-xs font-bold text-[#1D9E75]">{photoSpec.count} photos</span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(photoSpec.count, 6)}, 1fr)` }}>
            {Array.from({ length: photoSpec.count }).map((_, idx) => (
              <div key={idx} className="relative aspect-[3/4] overflow-hidden rounded border border-[#DFE3E8] bg-white">
                {imageForSheet && (
                  <Image src={imageForSheet} alt={`${idx + 1}`} fill className="object-cover object-top" sizes="60px" />
                )}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-0.5 top-0.5 h-1.5 w-1.5 border-l border-t border-[#9CA3AF]" />
                  <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 border-r border-t border-[#9CA3AF]" />
                  <span className="absolute right-0.5 bottom-0.5 h-1.5 w-1.5 border-r border-b border-[#9CA3AF]" />
                  <span className="absolute left-0.5 bottom-0.5 h-1.5 w-1.5 border-l border-b border-[#9CA3AF]" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">Corner marks are trim guides for clean cutting.</p>
        </div>
      </div>

      {/* Download actions */}
      <div className="space-y-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-2.5 text-xs text-[#4B5563]">
          Estimated: JPG {estimatedJpgSize} · PDF {estimatedPdfSize}
        </div>
        {statusText && (
          <p className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#374151] font-semibold">{statusText}</p>
        )}
        <Button onClick={handleDownloadJpg} disabled={!imageForSheet || busy}
          className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-6 text-base font-semibold h-auto shadow-[0_8px_24px_rgba(255,90,54,0.25)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.35)] transition-all hover:scale-[1.01] disabled:opacity-60">
          <Download className="w-5 h-5 mr-2" />
          {isExportingJpg ? "Creating JPG…" : `Download ${sheetPreset.toUpperCase()} JPG Sheet`}
        </Button>
        <Button onClick={handleDownloadPdf} disabled={!imageForSheet || busy} variant="outline"
          className="w-full border border-[#E5E5E5] rounded-2xl py-6 text-base font-semibold h-auto hover:bg-[#F7F7F8]">
          <Download className="w-5 h-5 mr-2" />
          {isExportingPdf ? "Creating PDF…" : `Download ${sheetPreset.toUpperCase()} PDF Sheet`}
        </Button>
        <Button onClick={handleNativeShare} disabled={!imageForSheet || busy} variant="outline"
          className="w-full border border-[#E5E5E5] rounded-2xl py-6 text-base font-semibold h-auto hover:bg-[#F7F7F8]">
          {isNativeSharing ? "Preparing…" : "Share to My Devices"}
        </Button>

        {/* Post-download nudges */}
        <div className="rounded-2xl border border-[#E8EAEE] bg-[#FAFBFD] px-4 py-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">What&apos;s next?</p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent("I just created my passport photo in seconds with PrintfY — free! Try it: https://printfy.app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-[#DCF8C6] bg-[#F3FFF0] px-4 py-3 text-sm font-semibold text-[#1a7a40] hover:bg-[#E8FFE0] transition-colors"
          >
            <span className="text-xl">💬</span>
            <span>Share with a friend on WhatsApp</span>
          </a>
          <a
            href="https://g.page/r/printfy/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#4b5563] hover:bg-[#F7F7F8] transition-colors"
          >
            <span className="text-xl">⭐</span>
            <span>Leave us a quick review — it helps a lot!</span>
          </a>
        </div>

        <Button onClick={reset} variant="ghost" className="w-full text-[#6b7280] hover:text-[#1a1a1a] font-semibold py-3">
          ↺ Create Another Photo
        </Button>
      </div>
    </div>
  )
}
