"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Eye, Maximize2, Zap, CheckCircle2, AlertCircle, X } from "lucide-react"
import type { SheetPreset } from "@/lib/sheet-export"

interface PrintPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string | null
  sheetPreset: SheetPreset
  quantity: number
  bgColor: string
  printerProfile?: string
}

type PreviewMode = "layout" | "accuracy" | "specs"

export function PrintPreviewModal({
  open,
  onOpenChange,
  imageUrl,
  sheetPreset,
  quantity,
  bgColor,
  printerProfile,
}: PrintPreviewModalProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("layout")
  const [scale, setScale] = useState(1)

  // Calculate physical dimensions for display
  const physicalHeight = sheetPreset === "4x6" ? "152" : "297"
  const physicalWidth = sheetPreset === "4x6" ? "102" : "210"
  const photoWidth = sheetPreset === "4x6" ? "89" : "89" // Standard passport width
  const photoHeight = sheetPreset === "4x6" ? "119" : "119" // Standard passport height

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader className="border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#FF5A36]" />
              <DialogTitle className="text-lg font-bold text-[#111827]">
                Print Preview
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#6b7280] hover:text-[#111827]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Preview tabs */}
        <div className="border-b border-[#E5E7EB] px-6 py-3">
          <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as PreviewMode)}>
            <TabsList className="grid w-fit grid-cols-3 rounded-xl bg-[#F8F9FA] p-1">
              <TabsTrigger value="layout" className="rounded-lg py-2 text-sm font-semibold">
                <Maximize2 className="h-4 w-4 mr-2" />
                Layout
              </TabsTrigger>
              <TabsTrigger value="accuracy" className="rounded-lg py-2 text-sm font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                Accuracy
              </TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg py-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Specs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Preview viewport */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-[#FAFAFA] p-6">
          <div className="space-y-4 w-full">
            {previewMode === "layout" && (
              <motion.div
                key="layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-4"
              >
                {/* Sheet preview container */}
                <div className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-[#E5E7EB]">
                  {/* Sheet background */}
                  <div
                    style={{
                      width: `${Math.min(400, sheetPreset === "4x6" ? 300 : 350)}px`,
                      aspectRatio: sheetPreset === "4x6" ? "102/152" : "210/297",
                      backgroundColor: "#ffffff",
                    }}
                    className="relative bg-white border border-[#D1D5DB]"
                  >
                    {/* Grid of photos */}
                    <div
                      className="absolute inset-0 grid gap-2 p-2"
                      style={{
                        gridTemplateColumns: sheetPreset === "4x6" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                        gridAutoRows: "auto",
                      }}
                    >
                      {Array.from({ length: quantity }).map((_, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative rounded-sm border border-[#E5E7EB] overflow-hidden bg-[#F7F7F8] shadow-sm"
                          style={{
                            aspectRatio: "3/4",
                          }}
                        >
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={`Photo ${idx + 1}`}
                              fill
                              className="object-cover object-top"
                              sizes="120px"
                            />
                          )}
                          {/* Trim marks */}
                          <div className="pointer-events-none absolute inset-0">
                            <span className="absolute left-0.5 top-0.5 h-1 w-1 border-l border-t border-[#9CA3AF]" />
                            <span className="absolute right-0.5 top-0.5 h-1 w-1 border-r border-t border-[#9CA3AF]" />
                            <span className="absolute right-0.5 bottom-0.5 h-1 w-1 border-r border-b border-[#9CA3AF]" />
                            <span className="absolute left-0.5 bottom-0.5 h-1 w-1 border-l border-b border-[#9CA3AF]" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bleed guides (red dashed lines) */}
                    <div className="pointer-events-none absolute inset-1 border border-dashed border-red-300 opacity-40" />
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                    className="px-2 py-1 rounded border border-[#E5E7EB] hover:bg-[#F7F7F8]"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => setScale(Math.min(2, scale + 0.1))}
                    className="px-2 py-1 rounded border border-[#E5E7EB] hover:bg-[#F7F7F8]"
                  >
                    +
                  </button>
                </div>

                {/* Info note */}
                <p className="text-xs text-[#6b7280] text-center max-w-md">
                  Dashed red border shows print bleed area. Trim marks in corners ensure clean cutting.
                </p>
              </motion.div>
            )}

            {previewMode === "accuracy" && (
              <motion.div
                key="accuracy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Color profile info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Background color */}
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-3 text-sm">Background Color</h4>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-16 w-16 rounded-lg border-2 border-[#E5E7EB] shadow-sm"
                        style={{
                          backgroundColor:
                            bgColor === "white"
                              ? "#ffffff"
                              : bgColor === "red"
                                ? "#c0392b"
                                : "#1a1a1a",
                        }}
                      />
                      <div>
                        <p className="font-semibold text-[#111827] capitalize">{bgColor}</p>
                        <p className="text-xs text-[#6b7280]">
                          {bgColor === "white"
                            ? "Bright & neutral"
                            : bgColor === "red"
                              ? "Professional red"
                              : "Deep black"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Color space */}
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-3 text-sm">Color Space</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
                        <span className="text-sm font-semibold text-[#1a1a1a]">sRGB Optimized</span>
                      </div>
                      <p className="text-xs text-[#6b7280]">
                        Colors calibrated for accurate printing on your selected printer
                      </p>
                    </div>
                  </div>

                  {/* Contrast check */}
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-3 text-sm">Contrast Check</h4>
                    <div className="space-y-2">
                      <div className="w-full bg-[#F7F7F8] rounded h-2 overflow-hidden">
                        <div className="bg-[#FF5A36] h-full w-4/5" />
                      </div>
                      <p className="text-xs text-[#6b7280]">High contrast detected — excellent for printing</p>
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-3 text-sm">Saturation Level</h4>
                    <div className="space-y-2">
                      <div className="w-full bg-[#F7F7F8] rounded h-2 overflow-hidden">
                        <div className="bg-linear-to-r from-[#FF5A36] to-[#FFA500] h-full w-3/5" />
                      </div>
                      <p className="text-xs text-[#6b7280]">Optimized for vibrant, natural-looking prints</p>
                    </div>
                  </div>
                </div>

                {/* Quality checks */}
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <h4 className="font-semibold text-[#111827] mb-3 text-sm">Quality Checks</h4>
                  <div className="space-y-2">
                    {[
                      "No blown highlights or crushed blacks",
                      "Face tones properly exposed",
                      "No visible banding or posterization",
                      "Proper edge detailing & sharpness",
                    ].map((check, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#1D9E75] shrink-0" />
                        <span className="text-sm text-[#4B5563]">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {previewMode === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Sheet specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-4 text-sm">Sheet Dimensions</h4>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Size</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {sheetPreset === "4x6" ? "4×6 inches" : "A4 (210×297 mm)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Dimensions (mm)</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {physicalWidth}×{physicalHeight} mm
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Photo count</span>
                        <span className="font-semibold text-[#1a1a1a]">{quantity} photos</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Layout</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {sheetPreset === "4x6" ? "2×3 grid" : "3×4 grid"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                    <h4 className="font-semibold text-[#111827] mb-4 text-sm">Photo Specs</h4>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Per photo (mm)</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {photoWidth}×{photoHeight}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Aspect ratio</span>
                        <span className="font-semibold text-[#1a1a1a]">3:4 (portrait)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Margin per photo</span>
                        <span className="font-semibold text-[#1a1a1a]">2 mm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6b7280]">Trim marks</span>
                        <span className="font-semibold text-[#1a1a1a]">Included</span>
                      </div>
                    </div>
                  </div>

                  {printerProfile && (
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 md:col-span-2">
                      <h4 className="font-semibold text-[#111827] mb-4 text-sm">Printer Profile</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#1a1a1a]">{printerProfile}</p>
                          <p className="text-xs text-[#6b7280]">
                            Output optimized for your selected printer
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-[#1D9E75]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Print instructions */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900 text-sm">Before Printing</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Allow sheet to sit flat for 30 minutes after cutting</li>
                        <li>• Use high-quality photo paper matching your printer spec</li>
                        <li>• Cut along trim marks with sharp blade for clean edges</li>
                        <li>• Store prints away from direct sunlight</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className="border-t border-[#E5E7EB] bg-[#FAFAFA] px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[#6b7280]">Review all details before downloading</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg border-[#E5E7EB] hover:bg-[#F7F7F8]"
            >
              Back to Edit
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-lg font-semibold"
            >
              Ready to Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
