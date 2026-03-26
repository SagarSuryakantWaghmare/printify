"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Download, LayoutGrid, Contrast } from "lucide-react"
import {
  buildSheetJpgFile,
  downloadSheetAsJpg,
  downloadSheetAsPdf,
  estimateExportFileSize,
  type ExportQuality,
  getPresetDimensionsMm,
  type SheetPreset,
} from "@/lib/sheet-export"

const VALIDATION_POINTS = [
  "Face centred & aligned",
  "Eyes open & visible",
  "White background",
  "35 × 45 mm Indian passport spec",
  "Proper lighting",
  "No filters applied",
]

export function PreviewStep() {
  const { photoData, photoSpec, setPhotoSpec, reset } = useWizard()
  const [sheetPreset, setSheetPreset] = useState<SheetPreset>("4x6")
  const [exportQuality, setExportQuality] = useState<ExportQuality>("standard")
  const [isExportingJpg, setIsExportingJpg] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isNativeSharing, setIsNativeSharing] = useState(false)
  const [statusText, setStatusText] = useState<string | null>(null)
  const [networkHint, setNetworkHint] = useState<string | null>(null)
  const [isQualityAutoSet, setIsQualityAutoSet] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  // Use AI-processed image if available, else fall back to original
  const imageForSheet = photoData.processed ?? photoData.original

  const sizeDetails = getPresetDimensionsMm(photoSpec.preset, photoSpec.customWidthMm, photoSpec.customHeightMm)
  const selectedSizeLabel = sizeDetails.label

  const estimatedJpgSize = useMemo(
    () => estimateExportFileSize({ sheetPreset, quality: exportQuality, format: "jpg" }),
    [sheetPreset, exportQuality]
  )
  const estimatedPdfSize = useMemo(
    () => estimateExportFileSize({ sheetPreset, quality: exportQuality, format: "pdf" }),
    [sheetPreset, exportQuality]
  )

  useEffect(() => {
    if (isQualityAutoSet || typeof navigator === "undefined") return
    type ConnectionLike = { effectiveType?: string; saveData?: boolean }
    const conn = (navigator as Navigator & { connection?: ConnectionLike }).connection
    const isSlow = conn?.saveData === true || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g"
    if (isSlow) {
      setExportQuality("low-data")
      setNetworkHint("Slow network detected. Low Data mode auto-selected.")
    } else if (conn?.effectiveType === "3g") {
      setNetworkHint("3G detected. Consider Low Data mode for faster sharing.")
    }
    setIsQualityAutoSet(true)
  }, [isQualityAutoSet])

  const makeExportSpec = () => ({
    imageDataUrl: imageForSheet!,
    sheetPreset,
    quality: exportQuality,
    photoSpec: { widthMm: sizeDetails.widthMm, heightMm: sizeDetails.heightMm, count: photoSpec.count },
  })

  const handleDownloadJpg = async () => {
    if (!imageForSheet) return
    setIsExportingJpg(true)
    setStatusText("Preparing JPG sheet…")
    try {
      await downloadSheetAsJpg(makeExportSpec())
      setStatusText("✓ JPG downloaded")
    } finally {
      setIsExportingJpg(false)
      setTimeout(() => setStatusText(null), 1500)
    }
  }

  const handleDownloadPdf = async () => {
    if (!imageForSheet) return
    setIsExportingPdf(true)
    setStatusText("Preparing PDF sheet…")
    try {
      await downloadSheetAsPdf(makeExportSpec())
      setStatusText("✓ PDF downloaded")
    } finally {
      setIsExportingPdf(false)
      setTimeout(() => setStatusText(null), 1500)
    }
  }

  const handleNativeShare = async () => {
    if (!imageForSheet) return
    setIsNativeSharing(true)
    setStatusText("Preparing share file…")
    try {
      const shareFile = await buildSheetJpgFile(makeExportSpec())
      const canShare =
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare?.({ files: [shareFile] })
      if (canShare) {
        await navigator.share({ files: [shareFile], title: "PrintfY photo sheet", text: `${selectedSizeLabel}, ${photoSpec.count} photos` })
        setStatusText("✓ Shared")
      } else {
        await handleDownloadJpg()
      }
    } finally {
      setIsNativeSharing(false)
      setTimeout(() => setStatusText(null), 1500)
    }
  }

  const busy = isExportingJpg || isExportingPdf || isNativeSharing

  return (
    <div className="space-y-8">
      <motion.div className="space-y-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a]">
          Your Photo is Ready! 🎉
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          AI-enhanced, cropped to Indian passport spec (35×45 mm), white background
        </p>
      </motion.div>

      {/* Before / After comparison */}
      <div className="space-y-4">
        {/* Toggle */}
        {photoData.processed && photoData.original && (
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-500">View:</p>
            <button
              onClick={() => setShowOriginal(false)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${!showOriginal ? "bg-[#FF5A36] text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}
            >
              AI Result
            </button>
            <button
              onClick={() => setShowOriginal(true)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all flex items-center gap-1.5 ${showOriginal ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <Contrast className="h-4 w-4" />
              Original
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Main photo */}
          <div className="md:col-span-1">
            <p className="text-xs font-semibold text-[#6b7280] mb-3 uppercase tracking-wider">
              {showOriginal ? "Original Upload" : "AI Enhanced"}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={showOriginal ? "original" : "processed"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden bg-[#F7F7F8] aspect-[35/45] shadow-md"
              >
                {(showOriginal ? photoData.original : (photoData.processed ?? photoData.original)) && (
                  <Image
                    src={(showOriginal ? photoData.original : (photoData.processed ?? photoData.original))!}
                    alt={showOriginal ? "Original" : "AI Enhanced"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                {!showOriginal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-3 right-3 bg-[#1D9E75] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approved
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quality checklist */}
          <div className="md:col-span-2">
            <p className="text-xs font-semibold text-[#6b7280] mb-3 uppercase tracking-wider">Quality Check</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VALIDATION_POINTS.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + idx * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-[#F7F7F8] p-3"
                >
                  <Check className="w-4 h-4 text-[#1D9E75] shrink-0" />
                  <p className="text-sm font-semibold text-[#1a1a1a]">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print sheet options */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 md:p-6 space-y-5">
        {/* Count */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#111827]">Print Quantity</p>
            <p className="text-xs text-[#6b7280]">{selectedSizeLabel}</p>
          </div>
          <Tabs value={String(photoSpec.count)} onValueChange={(v) => setPhotoSpec({ count: Number(v) as 6 | 8 | 12 })}>
            <TabsList className="grid h-auto w-[240px] grid-cols-3 rounded-xl bg-[#F8F9FA] p-1">
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
            <TabsList className="grid h-auto w-[180px] grid-cols-2 rounded-xl bg-[#F8F9FA] p-1">
              <TabsTrigger value="4x6" className="rounded-lg py-2 text-sm font-bold">4×6</TabsTrigger>
              <TabsTrigger value="a4" className="rounded-lg py-2 text-sm font-bold">A4</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Quality */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#111827]">Export quality</p>
          <Tabs value={exportQuality} onValueChange={(v) => setExportQuality(v as ExportQuality)}>
            <TabsList className="grid h-auto w-[200px] grid-cols-2 rounded-xl bg-[#F8F9FA] p-1">
              <TabsTrigger value="standard" className="rounded-lg py-2 text-sm font-bold">Standard</TabsTrigger>
              <TabsTrigger value="low-data" className="rounded-lg py-2 text-sm font-bold">Low Data</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {networkHint && (
          <p className="rounded-xl border border-[#FAD7CD] bg-[#FFF4F1] px-3 py-2 text-xs text-[#9A3412]">{networkHint}</p>
        )}

        {/* Mini print preview */}
        <div className="rounded-2xl border border-[#E8EAEE] bg-[#FBFCFD] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6b7280]">
              <LayoutGrid className="h-3.5 w-3.5" />
              Sheet Preview
            </span>
            <span className="text-xs font-bold text-[#1D9E75]">{photoSpec.count} photos</span>
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(photoSpec.count, 6)}, 1fr)` }}>
            {Array.from({ length: photoSpec.count }).map((_, idx) => (
              <div key={idx} className="relative aspect-[35/45] overflow-hidden rounded-md border border-[#DFE3E8] bg-white">
                {imageForSheet && (
                  <Image src={imageForSheet} alt={`Print ${idx + 1}`} fill className="object-cover" sizes="60px" />
                )}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-0.5 top-0.5 h-2 w-2 border-l border-t border-[#9CA3AF]" />
                  <span className="absolute right-0.5 top-0.5 h-2 w-2 border-r border-t border-[#9CA3AF]" />
                  <span className="absolute right-0.5 bottom-0.5 h-2 w-2 border-r border-b border-[#9CA3AF]" />
                  <span className="absolute left-0.5 bottom-0.5 h-2 w-2 border-l border-b border-[#9CA3AF]" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#6b7280]">Grey corner marks are trim guides for clean cutting.</p>
        </div>
      </div>

      {/* Download actions */}
      <div className="space-y-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-2.5 text-xs text-[#4B5563]">
          Estimated size: JPG {estimatedJpgSize} · PDF {estimatedPdfSize}
        </div>
        {statusText && (
          <p className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-[#374151]">{statusText}</p>
        )}
        <Button
          onClick={handleDownloadJpg}
          disabled={!imageForSheet || busy}
          className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-6 text-base font-semibold h-auto glow-primary transition-all hover:scale-[1.01] disabled:opacity-60"
        >
          <Download className="w-5 h-5 mr-2" />
          {isExportingJpg ? "Creating JPG…" : `Download ${sheetPreset.toUpperCase()} JPG Sheet`}
        </Button>
        <Button
          onClick={handleDownloadPdf}
          disabled={!imageForSheet || busy}
          variant="outline"
          className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-2xl py-6 text-base font-semibold h-auto hover:bg-[#F7F7F8]"
        >
          <Download className="w-5 h-5 mr-2" />
          {isExportingPdf ? "Creating PDF…" : `Download ${sheetPreset.toUpperCase()} PDF Sheet`}
        </Button>
        <Button
          onClick={handleNativeShare}
          disabled={!imageForSheet || busy}
          variant="outline"
          className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-2xl py-6 text-base font-semibold h-auto hover:bg-[#F7F7F8]"
        >
          {isNativeSharing ? "Preparing…" : "Share Sheet to My Devices"}
        </Button>
        <Button
          onClick={reset}
          variant="ghost"
          className="w-full text-[#6b7280] hover:text-[#1a1a1a] font-semibold py-3"
        >
          ↺ Create Another Photo
        </Button>
      </div>
    </div>
  )
}
