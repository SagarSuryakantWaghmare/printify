"use client"

import { motion } from "framer-motion"
import { Camera, Wand2, DownloadCloud, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { scrollReveal, staggerContainer, staggerItem } from "@/lib/animations"

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
      <motion.div 
        {...scrollReveal}
        className="text-center space-y-4"
      >
        <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Professional Output in <span className="gradient-text">3 Steps</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
          No editing skills needed. AI handles the hard part — you just upload and download.
        </p>
      </motion.div>

      {/* Desktop: flex row with visible arrow connectors between cards */}
      <div className="hidden sm:flex items-start gap-0">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex items-start flex-1">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ 
                duration: 0.6, 
                delay: idx * 0.15,
                type: "spring",
                stiffness: 100
              }}
            >
              <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md h-full overflow-hidden group hover:border-[#FF5A36]/30 hover:shadow-[0_20px_40px_-15px_rgba(255,90,54,0.15)] transition-all duration-500 hover:-translate-y-3 rounded-3xl cursor-default">
                <CardContent className="p-8 sm:p-10">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:shadow-xl"
                    style={{ background: step.bg }}
                  >
                    <step.icon className="h-7 w-7" style={{ color: step.color }} />
                  </motion.div>
                  <p className="text-sm font-bold tracking-widest text-[#FF5A36] uppercase mb-2">Step {idx + 1}</p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#FF5A36] transition-colors">{step.label}</h3>
                  <p className="text-base leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* SVG arrow connector between cards with animation */}
            {idx < steps.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 + 0.3 }}
                className="flex items-center justify-center shrink-0 w-10 pt-8 self-start"
              >
                <motion.svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-slate-300" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </motion.div>
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
            transition={{ duration: 0.55, delay: idx * 0.12, type: "spring", stiffness: 100 }}
          >
            <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md overflow-hidden group hover:border-[#FF5A36]/30 hover:shadow-[0_20px_40px_-15px_rgba(255,90,54,0.15)] transition-all duration-500 rounded-3xl active:scale-95">
              <CardContent className="p-8">
                <motion.div 
                  whileTap={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500" 
                  style={{ background: step.bg }}
                >
                  <step.icon className="h-7 w-7" style={{ color: step.color }} />
                </motion.div>
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {["Indian passport spec", "White background", "35×45 mm crop", "Print-ready output"].map((tag, idx) => (
          <motion.span 
            key={tag} 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 hover:border-[#1D9E75]/30 hover:bg-white transition-all cursor-default"
          >
            <Check className="h-3.5 w-3.5 text-[#1D9E75]" />
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </section>
  )
}
