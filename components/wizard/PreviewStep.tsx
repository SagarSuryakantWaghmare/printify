"use client"

import { useState } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Download, LayoutGrid } from "lucide-react"

const VALIDATION_POINTS = [
  "Face centered",
  "Eyes open",
  "No filters applied",
  "Correct dimensions",
  "Proper lighting",
  "Background approved",
]

export function PreviewStep() {
  const { photoData, reset } = useWizard()
  const [selectedPack, setSelectedPack] = useState<8 | 12>(8)
  const imageForSheet = photoData.original

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Your Photo is Ready!
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          Indian passport-size approved layout
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Original photo - Desktop: left, Mobile: top */}
        <div className="order-2 md:order-1">
          <p className="text-sm font-600 text-[#6b7280] mb-4">Original</p>
          <div className="rounded-2xl overflow-hidden bg-[#F7F7F8] aspect-square">
            {photoData.original && (
              <Image
                src={photoData.original}
                alt="Original"
                fill
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            )}
          </div>
        </div>

        {/* Processed photo - Desktop: center (larger), Mobile: below */}
        <div className="order-1 md:order-2">
          <p className="text-sm font-600 text-[#6b7280] mb-4">Your Photo</p>
          <motion.div
            className="relative rounded-3xl overflow-hidden bg-[#F7F7F8] aspect-square"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {photoData.original && (
              <Image
                src={photoData.original}
                alt="Processed"
                fill
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            )}

            {/* Approved badge */}
            <motion.div
              className="absolute top-4 right-4 bg-[#1D9E75] text-white px-4 py-3 rounded-xl font-700 flex items-center gap-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Check className="w-5 h-5" />
              Approved
            </motion.div>
          </motion.div>
        </div>

        {/* Validation checklist - Desktop: right, Mobile: below */}
        <div className="order-3">
          <p className="text-sm font-600 text-[#6b7280] mb-4">Quality Check</p>
          <div className="space-y-3">
            {VALIDATION_POINTS.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="flex items-start gap-3 rounded-xl bg-[#F7F7F8] p-3 md:p-4"
              >
                <Check className="w-5 h-5 text-[#1D9E75] shrink-0 mt-0.5" />
                <p className="text-sm font-600 text-[#1a1a1a]">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-700 text-[#111827]">Select Print Quantity</p>
            <p className="text-xs md:text-sm text-[#6b7280]">Choose 8 or 12 photos and preview the arranged print sheet.</p>
          </div>
          <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] p-1">
            <button
              onClick={() => setSelectedPack(8)}
              className={`rounded-lg px-4 py-2 text-sm font-700 transition-colors ${
                selectedPack === 8 ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"
              }`}
            >
              8 Photos
            </button>
            <button
              onClick={() => setSelectedPack(12)}
              className={`rounded-lg px-4 py-2 text-sm font-700 transition-colors ${
                selectedPack === 12 ? "bg-white text-[#111827] shadow-sm" : "text-[#6b7280]"
              }`}
            >
              12 Photos
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8EAEE] bg-[#FBFCFD] p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-xs font-700 uppercase tracking-wider text-[#6b7280]">
              <LayoutGrid className="h-4 w-4" />
              Print Sheet Preview
            </p>
            <p className="text-xs font-700 text-[#1D9E75]">{selectedPack} photos arranged</p>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {Array.from({ length: selectedPack }).map((_, idx) => (
              <div key={idx} className="relative aspect-4/5 overflow-hidden rounded-lg border border-[#DFE3E8] bg-white">
                {imageForSheet ? (
                  <Image
                    src={imageForSheet}
                    alt={`Print ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl py-6 text-base font-600 h-auto">
          <Download className="w-5 h-5 mr-2" />
          Download Digital Photo
        </Button>

        <Button variant="outline" className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-xl py-6 text-base font-600 h-auto hover:bg-[#F7F7F8]">
          <Download className="w-5 h-5 mr-2" />
          Download {selectedPack} Photo Print Sheet
        </Button>

        <Button
          onClick={reset}
          variant="ghost"
          className="w-full text-[#6b7280] hover:text-[#1a1a1a] font-600 py-3"
        >
          Create Another Photo
        </Button>
      </div>
    </div>
  )
}
