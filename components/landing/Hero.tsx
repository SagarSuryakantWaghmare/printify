"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles, Printer, Scissors } from "lucide-react"
import type { Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export function Hero() {
  return (
    <section className="relative min-h-[60vh] overflow-hidden py-12 md:min-h-[88vh] md:py-0 flex items-center">
      {/* Animated Background Gradients */}
      <motion.div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.15),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(29,158,117,0.1),transparent_40%)]" 
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          opacity: [0.8, 1, 0.8] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
        {/* Left: Headline + CTA */}
        <motion.div
          className="space-y-8 md:col-span-7"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-[#FF5A36]/20 bg-[#FF5A36]/5 px-4 py-2 text-sm font-semibold text-[#c44728] backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 text-[#FF5A36]" />
            </motion.div>
            India Passport Photo Service
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Indian Passport Photos,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-[#ff8a73]">
                Ready to Print.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Create your passport-size photo instantly. Choose 8 or 12 print pack quantities,
              ultra-gloss paper, and precision-cut finish all in one flow.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:items-center pt-2">
            <Button
              asChild
              className="group relative w-full sm:w-auto bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl px-8 py-7 text-lg font-semibold overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,90,54,0.3)]"
            >
              <Link href="/app" className="inline-flex items-center justify-center">
                <span className="relative z-10 flex items-center">
                  Upload Photo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl px-8 py-7 text-lg font-semibold transition-all hover:scale-[1.02]"
            >
              <Link href="/#print-packs">View Print Packs</Link>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              "Indian passport format",
              "Ultra-gloss paper",
              "8 or 12 print packs",
            ].map((item) => (
              <motion.div 
                key={item} 
                className="flex items-center gap-3 rounded-2xl bg-white/60 backdrop-blur-md border border-slate-200/50 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/10">
                  <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Floating Pack Preview */}
        <motion.div
          className="hidden md:col-span-5 md:flex md:items-center md:justify-center relative"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.3 }}
        >
          {/* Decorative background blur */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5A36]/20 to-[#1D9E75]/20 blur-3xl rounded-full transform -translate-y-12 scale-90" />
          
          <motion.div 
            className="relative w-full max-w-md rounded-[2rem] border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            
            <motion.div 
              className="absolute -top-4 -right-4 rounded-2xl bg-[#1D9E75] px-5 py-2.5 text-sm font-bold text-white shadow-xl transform rotate-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
            >
              India Spec Ready
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-sm transition-transform hover:scale-105">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff2ed] text-[#FF5A36] shadow-inner">
                  <Printer className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pack</p>
                <p className="mt-1 text-xl font-bold text-slate-900">8 Prints</p>
              </div>
              <div className="rounded-2xl border border-white/50 bg-white/80 p-5 shadow-sm transition-transform hover:scale-105">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef7f3] text-[#1D9E75] shadow-inner">
                  <Scissors className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Finish</p>
                <p className="mt-1 text-xl font-bold text-slate-900">Precision Cut</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/60 bg-white/50 px-5 py-4 text-sm font-medium text-slate-600 shadow-sm leading-relaxed">
              Choose between 8 or 12 prints on ultra-gloss paper instantly after your photo is processed.
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
