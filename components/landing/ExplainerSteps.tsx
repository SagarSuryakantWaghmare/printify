"use client"

import { Camera, WandSparkles, DownloadCloud } from "lucide-react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

export function ExplainerSteps() {
  const steps = [
    {
      icon: Camera,
      label: "Upload Your Photo",
      description: "Capture or upload one clear photo to start your Indian passport workflow.",
    },
    {
      icon: WandSparkles,
      label: "AI Passport Setup",
      description: "We correct background, align your face, and set official Indian passport size.",
    },
    {
      icon: DownloadCloud,
      label: "Choose 8 Or 12 Prints",
      description: "Pick your print pack with ultra-gloss paper and precision cutting finish.",
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    },
  }

  return (
    <section id="how-it-works" className="relative py-16 space-y-12">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-gradient-to-r from-[#FF5A36]/10 via-transparent to-[#1D9E75]/10 blur-3xl -z-10 pointer-events-none" />

      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          From Upload To <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-[#ff8a73]">Premium Prints</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          Built for Indian passport needs with a clean flow and zero manual editing work.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto relative cursor-default"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Connecting Line for Desktop */}
        <div className="hidden sm:block absolute top-[18%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 p-8 text-center sm:text-left space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_20px_40px_rgba(255,90,54,0.08)] hover:border-[#FF5A36]/30"
          >
            {/* Number watermark */}
            <div className="absolute -bottom-4 -right-2 text-9xl font-black text-slate-50/50 group-hover:text-[#FF5A36]/5 transition-colors z-0 pointer-events-none">
              {idx + 1}
            </div>

            <div className="relative z-10 flex flex-col items-center sm:items-start space-y-5">
              <motion.div 
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff2ed] to-white text-[#FF5A36] shadow-inner ring-1 ring-black/5"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <step.icon className="h-7 w-7" />
              </motion.div>
              
              <div className="space-y-3">
                <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                  {step.label}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
