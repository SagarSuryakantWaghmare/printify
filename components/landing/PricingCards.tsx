"use client"

import { Check, Sparkles, Zap, Shield, Download, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import Link from "next/link"

const features = [
  {
    icon: Sparkles,
    title: "AI Background Removal",
    description: "Advanced ML removes backgrounds instantly, creating clean white backdrops perfect for official documents.",
    color: "#FF5A36",
    bg: "#FFF1ED",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your passport photo ready in under 60 seconds. No waiting, no appointments needed.",
    color: "#1D9E75",
    bg: "#EDFAF5",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens in your browser. Your photos never leave your device.",
    color: "#6366F1",
    bg: "#EEF2FF",
  },
  {
    icon: Download,
    title: "Print-Ready Output",
    description: "Download high-resolution sheets with 6, 8, or 12 photos ready for professional printing.",
    color: "#EC4899",
    bg: "#FDF2F8",
  },
  {
    icon: Globe,
    title: "Indian Passport Spec",
    description: "Automatically formatted to 35×45mm with proper face positioning and margins.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: Clock,
    title: "100% Free Forever",
    description: "No hidden fees, no subscriptions. Create unlimited passport photos at no cost.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
]

export function PricingCards() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  }

  return (
    <section
      id="features"
      className="relative py-16 space-y-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white -z-10" />
      
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-[#FFF1ED] border border-[#FFD5C8] px-4 py-1.5 text-sm font-bold text-[#C84426]"
        >
          <Sparkles className="w-4 h-4" />
          100% Free Forever
        </motion.span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Everything You Need, <span className="gradient-text">Free</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Professional passport photos without the professional price tag. All features, no limits.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
            className="relative rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-lg p-8 flex flex-col transition-all duration-300 hover:border-slate-300 group cursor-default"
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:shadow-lg"
              style={{ background: feature.bg }}
            >
              <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
            </motion.div>

            <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#FF5A36] transition-colors">
              {feature.title}
            </h3>
            <p className="text-base text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center pt-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            asChild
            className="h-14 sm:h-16 rounded-2xl bg-[#FF5A36] px-10 sm:px-12 text-base sm:text-lg font-bold text-white hover:bg-[#E24D2E] shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Link href="/app">
              Start Creating Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
        <p className="mt-4 text-sm text-slate-500">No signup required • No credit card needed</p>
      </motion.div>
    </section>
  )
}
