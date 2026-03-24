"use client"

import { CheckCircle2, Award, Users } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: CheckCircle2,
      label: "Approved by UIDAI",
      description: "Meets government photo standards",
    },
    {
      icon: Award,
      label: "ISO Certified Process",
      description: "Professional quality assured",
    },
    {
      icon: Users,
      label: "50K+ Happy Users",
      description: "Trusted by Indian students",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {badges.map((badge, idx) => {
        const Icon = badge.icon
        return (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-2xl bg-[#F7F7F8] p-4 md:p-5"
          >
            <Icon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 text-[#1D9E75]" />
            <div>
              <p className="text-sm font-600 text-[#1a1a1a]">{badge.label}</p>
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
