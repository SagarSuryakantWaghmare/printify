"use client"

import { CheckCircle2, Award, Users } from "lucide-react"

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {badges.map((badge, idx) => {
        const Icon = badge.icon
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl border border-[#e6e7ea] bg-white p-4 md:p-5 shadow-[0_8px_20px_rgba(17,24,39,0.04)]"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f3]">
              <Icon className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-[#1D9E75]" />
            </div>
            <div>
              <p className="text-sm font-700 text-[#111827]">{badge.label}</p>
              <p className="text-xs md:text-sm text-[#6b7280]">
                {badge.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
