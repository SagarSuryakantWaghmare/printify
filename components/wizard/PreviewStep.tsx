"use client"

import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Download, ShoppingCart } from "lucide-react"

const VALIDATION_POINTS = [
  "Face centered",
  "Eyes open",
  "No filters applied",
  "Correct dimensions",
  "Proper lighting",
  "Background approved",
]

export function PreviewStep() {
  const { photoData, selectedCountry, reset } = useWizard()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Your Photo is Ready!
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          Approved for {selectedCountry}
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

      {/* Action buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl py-6 text-base font-600 h-auto">
          <Download className="w-5 h-5 mr-2" />
          Download Free (Compressed)
        </Button>

        <Button variant="outline" className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-xl py-6 text-base font-600 h-auto hover:bg-[#F7F7F8]">
          📸 Download HD — ₹49
        </Button>

        <Button variant="outline" className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-xl py-6 text-base font-600 h-auto hover:bg-[#F7F7F8]">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Order Prints — ₹99
        </Button>

        <button
          onClick={reset}
          className="w-full text-[#6b7280] hover:text-[#1a1a1a] font-600 py-3 transition-colors"
        >
          Create Another Photo
        </button>
      </div>
    </div>
  )
}
