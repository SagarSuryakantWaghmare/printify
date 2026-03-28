"use client"

import { BadgeIndianRupee, Printer, ShieldCheck, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const badges = [
  {
    icon: Printer,
    label: "Self-Print Workflow",
    description: "Maintain full control from capture to export and print directly from your own setup.",
    iconBg: "#FFF1ED",
    iconColor: "#FF5A36",
  },
  {
    icon: BadgeIndianRupee,
    label: "100% Free Tool",
    description: "No hidden charges. Generate professional print sheets at no cost.",
    iconBg: "#EDFAF5",
    iconColor: "#1D9E75",
  },
  {
    icon: ShieldCheck,
    label: "No Design Skills Needed",
    description: "Auto-tiling and ready layout make the process simple for both professionals and beginners.",
    iconBg: "#EEF2FF",
    iconColor: "#6366F1",
  },
  {
    icon: Smartphone,
    label: "Made for Android Phones",
    description: "Lightweight interface that performs smoothly on budget phones and slower mobile networks.",
    iconBg: "#FFF8E1",
    iconColor: "#D97706",
  },
]

export function TrustBadges() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Why People In India Use <span className="gradient-text">PrintfY</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
          Built for photographers and individual users who need a fast self-print workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge, idx) => {
          const Icon = badge.icon
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md h-full hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] hover:border-[#FF5A36]/20 transition-all duration-300 hover:-translate-y-1 rounded-3xl">
                <CardHeader className="pb-2 pt-6 px-6">
                  <div
                    className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: badge.iconBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: badge.iconColor }} />
                  </div>
                  <CardTitle className="text-lg font-bold leading-snug text-slate-900">{badge.label}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-base leading-relaxed text-slate-600">{badge.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
