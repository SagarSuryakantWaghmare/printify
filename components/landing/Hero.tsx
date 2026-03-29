"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Sparkles, Layers, Printer } from "lucide-react"
import { SparkleIcon } from "@/components/ui/icons"
import dynamic from "next/dynamic"

const ThreeBackground = dynamic(
  () => import("./ThreeBackground").then((m) => m.ThreeBackground),
  { ssr: false }
)

const TRUSTS = [
  "AI background removal",
  "Face-cropped to Indian passport spec",
  "Download JPG or PDF sheet",
]

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Enhance",
    desc: "Auto-correction, sharpening & brightness for print-perfect results",
    color: "#FF5A36",
    bg: "#FFF1ED",
  },
  {
    icon: Layers,
    title: "BG Removal",
    desc: "Clean white background removal powered by remove.bg",
    color: "#1D9E75",
    bg: "#EDFAF5",
  },
  {
    icon: Printer,
    title: "Print Sheet",
    desc: "6, 8, or 12 photos on a 4×6\" or A4 sheet, ready to print",
    color: "#6366F1",
    bg: "#EEF2FF",
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Three.js particle bg */}
      <ThreeBackground />

      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,90,54,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(29,158,117,0.1),transparent_40%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-[-2rem]">
        <div className="flex flex-col items-center text-center space-y-10 lg:space-y-12">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="rounded-full border border-[#FFD5C8] bg-[#FFF1ED] px-4 py-1.5 text-xs font-semibold text-[#C84426] hover:bg-[#FFF1ED] shadow-sm flex items-center gap-1.5 w-fit">
              <SparkleIcon className="w-4 h-4" fill="#C84426" />
              Free AI Passport Photo Generator for India
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6 max-w-5xl">
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-[5.5rem] lg:leading-[1.05]">
              AI-Powered
              <span className="block gradient-text mt-2 mb-2 drop-shadow-sm">Passport Photos</span>
              in 60 Seconds
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:text-2xl pt-2">
              Upload one photo. Our AI removes the background, enhances quality, and crops to Indian passport spec (35×45 mm). Download a ready-to-print sheet with 6, 8, or 12 photos.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-4 sm:flex-row mt-8">
            <Button
              asChild
              className="h-14 sm:h-16 rounded-2xl bg-[#FF5A36] px-8 sm:px-10 text-base sm:text-lg font-bold text-white hover:bg-[#E24D2E] glow-primary transition-all duration-300 hover:scale-105"
            >
              <Link href="/app">
                Start Free Now
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 sm:h-16 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm px-8 sm:px-10 text-base sm:text-lg font-bold text-slate-700 hover:bg-white hover:border-slate-300 transition-all duration-300"
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>

          {/* Trust bullets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-3">
            {TRUSTS.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-slate-700 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1D9E75]" />
                {t}
              </span>
            ))}
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card rounded-2xl p-5 text-left"
              >
                <div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: f.bg }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <p className="font-display text-base font-semibold text-slate-900">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
