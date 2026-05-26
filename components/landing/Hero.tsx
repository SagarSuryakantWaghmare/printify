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
  "Cropped to Indian passport spec",
  "Download JPG or PDF sheet",
]

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Enhance",
    desc: "Auto-correction, sharpening & brightness for print-perfect results",
    color: "var(--primary)",
    bg: "var(--color-brand-50)",
  },
  {
    icon: Layers,
    title: "BG Removal",
    desc: "Clean background removal powered by remove.bg",
    color: "var(--color-success-500)",
    bg: "var(--color-success-50)",
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
  const y = useTransform(scrollY, [0, 300], [0, 40])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4])

  return (
    <section className="relative overflow-hidden w-full min-h-[calc(100svh-64px)] flex flex-col items-center justify-center pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 safe-x">
      <ThreeBackground />

      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,90,54,0.14),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(29,158,117,0.09),transparent_40%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center text-center space-y-7 sm:space-y-9 lg:space-y-11"
        >
          {/* Badge */}
          <motion.div variants={staggerItem}>
            <Badge className="rounded-full border border-brand-200 bg-brand-50 px-3 sm:px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm flex items-center gap-1.5 w-fit">
              <SparkleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" fill="currentColor" />
              <span className="hidden xs:inline">Free AI Passport Photo Generator for India</span>
              <span className="xs:hidden">Free AI Passport Photos</span>
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div variants={staggerItem} className="space-y-4 sm:space-y-6 max-w-5xl">
            <h1 className="font-display font-extrabold leading-[1.05] tracking-tight text-foreground text-[clamp(2.25rem,7vw,5.5rem)]">
              <span className="block">AI-Powered</span>
              <span className="block gradient-text mt-1 sm:mt-2 mb-1 sm:mb-2">Passport Photos</span>
              <span className="block">in 60 Seconds</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground md:text-xl pt-1 sm:pt-2 px-2 sm:px-0">
              Upload one photo. Our AI removes the background, enhances quality, and crops to Indian
              passport spec (35×45 mm). Download a ready-to-print sheet with 6, 8, or 12 photos.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Button asChild variant="cta" size="xl" className="w-full sm:w-auto h-14 px-8 text-base">
              <Link href="/app">
                Start Free Now
                <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto h-14 px-8 text-base bg-background/80 backdrop-blur-sm">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>

          {/* Trust bullets */}
          <motion.div variants={staggerItem} className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-0">
            {TRUSTS.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground/80 shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-success-500" />
                <span className="whitespace-nowrap">{t}</span>
              </span>
            ))}
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={staggerItem}
            className="mt-6 sm:mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3 px-2 sm:px-0"
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-4 sm:p-5 text-left group transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: f.bg }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <p className="font-display text-base font-semibold text-foreground mb-1">{f.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {f.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
