"use client"

import { CheckCircle2, Award, Users } from "lucide-react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"

export function TrustBadges() {
  const badges = [
    {
      icon: CheckCircle2,
      label: "Indian Passport Spec Ready",
      description: "Aligned for standard Indian passport photo dimension and framing.",
    },
    {
      icon: Award,
      label: "Ultra-Gloss Print Quality",
      description: "Designed for crisp photo paper output with strong clarity and tone.",
    },
    {
      icon: Users,
      label: "Premium Finish Workflow",
      description: "8 or 12 print packs with precision-cut guidance for cleaner final photos.",
    },
  ]

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {badges.map((badge, idx) => {
        const Icon = badge.icon
        return (
          <motion.div
            key={idx}
            variants={badgeVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group flex flex-col md:flex-row items-start md:items-center gap-4 rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(29,158,117,0.08)] hover:border-[#1D9E75]/30 transition-all duration-300"
          >
            <motion.div 
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef7f3] to-white shadow-inner ring-1 ring-black/5"
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-6 w-6 shrink-0 text-[#1D9E75]" />
            </motion.div>
            <div>
              <p className="text-base font-bold text-slate-900 group-hover:text-[#1D9E75] transition-colors">{badge.label}</p>
              <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
