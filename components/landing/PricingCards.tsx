"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  return (
    <section
      id="print-packs"
      className="space-y-12 md:space-y-16"
    >
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 tracking-tight text-[#111827]">
          Select Your Photo Pack
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
          First make your passport photo, then choose the output format you need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl border-2 p-8 md:p-10 space-y-6 transition-all ${
              plan.recommended
                ? "border-[#FF5A36] bg-white shadow-[0_24px_42px_rgba(255,90,54,0.16)] scale-105 md:scale-100 md:ring-2 md:ring-[#FF5A36] md:ring-offset-4"
                : "border-[#E5E5E5] bg-white hover:border-[#FF5A36] hover:shadow-[0_16px_28px_rgba(17,24,39,0.08)]"
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-6 -translate-y-1/2">
                <span className="inline-flex rounded-full bg-[#FF5A36] px-3 py-1 text-xs font-600 text-white">
                  Recommended
                </span>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-700 text-[#111827]">{plan.name}</h3>
              <p className="text-sm text-[#6b7280]">{plan.description}</p>
            </div>

            <Button
              className={`w-full rounded-xl px-6 py-6 text-base font-600 h-auto transition-all ${
                plan.recommended
                  ? "bg-[#FF5A36] text-white hover:bg-[#e04e2d]"
                  : "bg-[#F7F7F8] text-[#1a1a1a] hover:bg-[#E5E5E5]"
              }`}
            >
              {plan.cta}
            </Button>

            <div className="space-y-3 pt-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-[#1D9E75] mt-0.5" />
                  <span className="text-sm text-[#6b7280]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
