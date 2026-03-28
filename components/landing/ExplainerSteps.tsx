"use client"

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
    description: 'Choose 6, 8, or 12 photos. Export a print-ready 4×6" or A4 sheet in JPG or PDF.',
    color: "#6366F1",
    bg: "#EEF2FF",
  },
]

export function ExplainerSteps() {
  return (
    <section id="how-it-works" className="space-y-10">
      <div className="text-center space-y-4">
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Professional Output in <span className="gradient-text">3 Steps</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          No editing skills needed. AI handles the hard part — you just upload and download.
        </p>
      </div>

      {/* Desktop: flex row with visible arrow connectors between cards */}
      <div className="hidden sm:flex items-start gap-0">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex items-start flex-1">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.12 }}
            >
              <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md h-full overflow-hidden group hover:border-[#FF5A36]/30 hover:shadow-[0_20px_40px_-15px_rgba(255,90,54,0.15)] transition-all duration-500 hover:-translate-y-2 rounded-3xl">
                <CardContent className="p-8 sm:p-10">
                  <div
                    className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ background: step.bg }}
                  >
                    <step.icon className="h-7 w-7" style={{ color: step.color }} />
                  </div>
                  <p className="text-sm font-bold tracking-widest text-[#FF5A36] uppercase mb-2">Step {idx + 1}</p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">{step.label}</h3>
                  <p className="text-base leading-relaxed text-slate-500">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* SVG arrow connector between cards */}
            {idx < steps.length - 1 && (
              <div className="flex items-center justify-center shrink-0 w-10 pt-8 self-start">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: simple stacked list */}
      <div className="sm:hidden grid grid-cols-1 gap-5">
        {steps.map((step, idx) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: idx * 0.12 }}
          >
            <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md overflow-hidden group hover:border-[#FF5A36]/30 hover:shadow-[0_20px_40px_-15px_rgba(255,90,54,0.15)] transition-all duration-500 rounded-3xl">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500" style={{ background: step.bg }}>
                  <step.icon className="h-7 w-7" style={{ color: step.color }} />
                </div>
                <p className="text-sm font-bold tracking-widest text-[#FF5A36] uppercase mb-2">Step {idx + 1}</p>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">{step.label}</h3>
                <p className="text-base leading-relaxed text-slate-500">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary badges */}
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
