"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Sparkles, Layers, Printer } from "lucide-react"
import { SparkleIcon } from "@/components/ui/icons"
import dynamic from "next/dynamic"
import { staggerContainer, staggerItem } from "@/lib/animations"

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
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5])

  return (
    <section className="relative overflow-hidden w-full min-h-[calc(100svh-64px)] flex flex-col items-center justify-center pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32 safe-x">
      {/* Three.js particle bg */}
      <ThreeBackground />

      {/* Radial gradient overlay - enhanced with parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,90,54,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(29,158,117,0.1),transparent_40%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_100%)]" 
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center space-y-8 sm:space-y-10 lg:space-y-12"
        >
          {/* Badge with enhanced animation */}
          <motion.div 
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Badge className="rounded-full border border-[#FFD5C8] bg-[#FFF1ED] px-3 sm:px-4 py-1.5 text-xs font-semibold text-[#C84426] hover:bg-[#FFE8E0] shadow-sm flex items-center gap-1.5 w-fit transition-all duration-300">
              <SparkleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" fill="#C84426" />
              <span className="hidden xs:inline">Free AI Passport Photo Generator for India</span>
              <span className="xs:hidden">Free AI Passport Photos</span>
            </Badge>
          </motion.div>

          {/* Headline with stagger animation - fluid typography */}
          <motion.div 
            variants={staggerItem}
            className="space-y-4 sm:space-y-6 max-w-5xl"
          >
            <h1 className="font-display font-extrabold leading-[1.1] tracking-tight text-slate-900 text-fluid-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] lg:leading-[1.05]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="block"
              >
                AI-Powered
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
                className="block gradient-text mt-1 sm:mt-2 mb-1 sm:mb-2 drop-shadow-sm"
              >
                Passport Photos
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="block"
              >
                in 60 Seconds
              </motion.span>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 md:text-xl lg:text-2xl pt-1 sm:pt-2 px-2 sm:px-0"
            >
              Upload one photo. Our AI removes the background, enhances quality, and crops to Indian passport spec (35×45 mm). Download a ready-to-print sheet with 6, 8, or 12 photos.
            </motion.p>
          </motion.div>

          {/* CTA buttons - full width on mobile */}
          <motion.div 
            variants={staggerItem}
            className="flex flex-col gap-3 sm:gap-4 sm:flex-row mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl bg-[#FF5A36] px-8 sm:px-10 text-base sm:text-lg font-bold text-white hover:bg-[#E24D2E] glow-primary transition-all duration-300 shadow-xl hover:shadow-2xl touch-target"
              >
                <Link href="/app">
                  Start Free Now
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full sm:w-auto"
            >
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm px-8 sm:px-10 text-base sm:text-lg font-bold text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300 touch-target"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust bullets - horizontal scroll on mobile */}
          <motion.div 
            variants={staggerItem}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-0"
          >
            {TRUSTS.map((t, index) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#1D9E75]" />
                <span className="whitespace-nowrap">{t}</span>
              </motion.span>
            ))}
          </motion.div>

          {/* Feature cards - optimized for touch */}
          <motion.div
            variants={staggerItem}
            className="mt-8 sm:mt-12 grid w-full max-w-5xl grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3 px-2 sm:px-0"
          >
            {FEATURES.map((f, index) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="glass-card rounded-2xl p-4 sm:p-5 text-left group cursor-default card-mobile"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-2 sm:mb-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all duration-300"
                  style={{ background: f.bg }}
                >
                  <f.icon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" style={{ color: f.color }} />
                </motion.div>
                <p className="font-display text-sm sm:text-base font-semibold text-slate-900 mb-0.5 sm:mb-1">{f.title}</p>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
