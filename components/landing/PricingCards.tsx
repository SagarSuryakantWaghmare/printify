"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

export function PricingCards() {
  const plans = [
    {
      name: "Digital Only",
      description: "Create and preview your passport photo",
      cta: "Create Free",
      features: [
        "Indian passport size preview",
        "AI background cleanup",
        "Basic digital download",
        "Single JPG export",
      ],
      popular: false,
    },
    {
      name: "8 Prints Pack",
      description: "Best for immediate document needs",
      cta: "Choose 8 Prints",
      features: [
        "8 Indian passport-size photos",
        "Ultra-gloss photo paper",
        "Precision cutting layout",
        "High-resolution print file",
        "Fast processing turnaround",
      ],
      recommended: true,
    },
    {
      name: "12 Prints Pack",
      description: "Value pack for multiple submissions",
      cta: "Choose 12 Prints",
      features: [
        "12 Indian passport-size photos",
        "Ultra-gloss photo paper",
        "Precision cutting layout",
        "High-resolution print file",
        "Best value per photo",
      ],
      recommended: false,
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
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
      id="print-packs"
      className="relative py-16 space-y-16"
    >
      <div className="absolute inset-0 bg-slate-50/50 -z-10" />
      
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Select Your Photo Pack
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          First make your passport photo, then choose the output format you need.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={cardVariants}
            whileHover={{ y: plan.recommended ? -12 : -8 }}
            className={`relative rounded-[2.5rem] border p-8 md:p-10 flex flex-col transition-all duration-300 ${
              plan.recommended
                ? "border-[#FF5A36]/30 bg-white/90 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(255,90,54,0.2)] md:scale-105 z-10"
                : "border-slate-200/60 bg-white/70 backdrop-blur-lg hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] z-0"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="inline-flex rounded-full bg-gradient-to-r from-[#FF5A36] to-[#fc7153] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#FF5A36]/30"
                >
                  Most Popular
                </motion.span>
              </div>
            )}
            
            {/* Soft background glow for recommended card */}
            {plan.recommended && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#FF5A36]/5 to-transparent rounded-[2.5rem] -z-10 pointer-events-none" />
            )}

            <div className="space-y-3 mb-8">
              <h3 className={`font-display text-2xl font-bold ${plan.recommended ? "text-[#FF5A36]" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <p className="text-base text-slate-500 font-medium">
                {plan.description}
              </p>
            </div>

            <Button
              className={`w-full rounded-2xl px-6 py-7 text-lg font-bold transition-all duration-300 ${
                plan.recommended
                  ? "bg-[#FF5A36] text-white hover:bg-[#e04e2d] hover:shadow-[0_8px_20px_rgba(255,90,54,0.3)] hover:scale-[1.02]"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:scale-[1.02]"
              }`}
            >
              {plan.cta}
            </Button>

            <div className="space-y-4 pt-10 mt-auto">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`mt-1 inline-flex shrink-0 items-center justify-center rounded-full p-1 ${
                    plan.recommended ? "bg-[#1D9E75]/10" : "bg-slate-100"
                  }`}>
                    <Check className={`h-3.5 w-3.5 ${plan.recommended ? "text-[#1D9E75]" : "text-slate-500"}`} strokeWidth={3} />
                  </div>
                  <span className="text-base text-slate-600 font-medium leading-tight">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
