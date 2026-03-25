"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles, Printer, Scissors } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[60vh] overflow-hidden py-8 md:min-h-[88vh] md:py-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.2),transparent_42%),radial-gradient(circle_at_18%_82%,rgba(29,158,117,0.14),transparent_36%)]" />
      <div className="relative grid min-h-[inherit] grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-10">
        {/* Left: Headline + CTA */}
        <motion.div
          className="space-y-6 md:col-span-7 md:space-y-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd9d0] bg-[#fff6f3] px-4 py-2 text-sm font-600 text-[#c44728]">
            <Sparkles className="h-4 w-4" />
            India Passport Photo Service
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-700 leading-tight tracking-tight text-[#111827]">
              Indian Passport Photos,
              <br />
              <span className="text-[#FF5A36]">Ready As 8 Or 12 Premium Prints.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#6b7280] max-w-xl">
              Create your passport-size photo first, then choose print pack quantity,
              ultra-gloss paper, and precision-cut finish in one flow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button
              asChild
              className="w-full sm:w-auto bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-8 py-6 text-base font-600 h-auto"
            >
              <Link href="/app" className="inline-flex items-center">
                Upload Photo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-[#E5E5E5] text-[#1a1a1a] hover:bg-[#F7F7F8] rounded-xl px-8 py-6 text-base font-600 h-auto"
            >
              <Link href="/#print-packs">View Print Packs</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              "Indian passport size format",
              "Ultra-gloss paper finish",
              "8 or 12 print pack options",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-white/80 border border-[#efefef] px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
                <span className="text-xs font-600 text-[#4b5563]">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Pack and finish highlights */}
        <motion.div
          className="hidden md:col-span-5 md:flex md:items-center md:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#E8E8EA] bg-white p-5 shadow-[0_20px_44px_rgba(17,24,39,0.12)]">
            <div className="absolute -top-5 -right-5 rounded-2xl bg-[#1D9E75] px-4 py-2 text-xs font-700 text-white">
              India Spec Ready
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#E8E8EA] bg-[#fbfcfe] p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2ed] text-[#FF5A36]">
                  <Printer className="h-4 w-4" />
                </div>
                <p className="text-xs font-700 uppercase tracking-widest text-[#9ca3af]">Pack</p>
                <p className="mt-1 text-lg font-700 text-[#111827]">8 Prints</p>
              </div>
              <div className="rounded-2xl border border-[#E8E8EA] bg-[#fbfcfe] p-4">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef7f3] text-[#1D9E75]">
                  <Scissors className="h-4 w-4" />
                </div>
                <p className="text-xs font-700 uppercase tracking-widest text-[#9ca3af]">Finish</p>
                <p className="mt-1 text-lg font-700 text-[#111827]">Precision Cut</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-[#E8E8EA] bg-[#fafbfc] px-4 py-3 text-sm text-[#4b5563]">
              Choose between 8 or 12 prints on ultra-gloss paper after your photo is processed.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile: Demo card below hero */}
      <motion.div
        className="md:hidden mt-12 rounded-3xl overflow-hidden bg-[#F7F7F8] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <p className="text-xs font-600 text-[#6b7280] text-center mb-4">
          PREVIEW
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-2xl bg-white border border-[#E5E5E5]" />
          <div className="aspect-square rounded-2xl bg-white border border-[#E5E5E5]" />
        </div>
      </motion.div>
    </section>
  )
}
