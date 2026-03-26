"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Camera, Wand2, DownloadCloud, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Camera,
    label: "Upload Your Photo",
    description: "Drag & drop or upload from your gallery. Our AI detects your face instantly.",
    color: "#FF5A36",
    bg: "#FFF1ED",
  },
  {
    icon: Wand2,
    label: "AI Removes BG & Enhances",
    description: "Background removed, lighting corrected, and cropped to Indian passport spec (35×45 mm).",
    color: "#1D9E75",
    bg: "#EDFAF5",
  },
  {
    icon: DownloadCloud,
    label: "Download Print Sheet",
    description: "Choose 6, 8, or 12 photos. Export a print-ready 4×6\" or A4 sheet in JPG or PDF.",
    color: "#6366F1",
    bg: "#EEF2FF",
  },
]



export function ExplainerSteps() {
  return (
    <section id="how-it-works" className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Professional Output in <span className="gradient-text">3 Steps</span>
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
          No editing skills needed. AI handles the hard part — you just upload and download.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: idx * 0.12 }}
          >
            <Card className="relative border-slate-200 bg-white h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300">
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute top-10 left-[calc(100%+1px)] z-10 w-5 h-px bg-slate-200" />
              )}
              <CardContent className="p-6 sm:p-7">
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: step.bg }}
                >
                  <step.icon className="h-6 w-6" style={{ color: step.color }} />
                </div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">Step {idx + 1}</p>
                <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">{step.label}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {["Indian passport spec", "White background", "35×45 mm crop", "Print-ready output"].map((tag) => (
          <span key={tag} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Check className="h-3.5 w-3.5 text-[#1D9E75]" />
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
