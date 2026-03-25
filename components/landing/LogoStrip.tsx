"use client"

import { Scissors, ShieldCheck, Printer, Star } from "lucide-react"

export function LogoStrip() {
  const printOptions = [
    {
      icon: Printer,
      title: "8 Photo Print Pack",
      detail: "Compact sheet for quick document submission.",
    },
    {
      icon: Printer,
      title: "12 Photo Print Pack",
      detail: "Best value for multiple forms and future use.",
    },
    {
      icon: Star,
      title: "Ultra-Gloss Paper",
      detail: "Premium photo paper finish with sharp color and detail.",
    },
    {
      icon: Scissors,
      title: "Precision Cutting",
      detail: "Neat passport-edge cutting for clean, professional output.",
    },
  ]

  return (
    <section id="print-packs" className="rounded-3xl border border-[#eceef2] bg-white py-10 md:py-12 px-5 md:px-8 space-y-8 shadow-[0_16px_30px_rgba(17,24,39,0.04)]">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef7f3] px-4 py-2 text-xs font-700 uppercase tracking-wider text-[#1D9E75]">
          <ShieldCheck className="h-4 w-4" />
          Print Quality Options
        </div>
        <p className="text-sm md:text-base font-600 text-[#374151]">
          India passport-size photo packs on premium paper with professional finishing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {printOptions.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#eceef2] bg-[#fafbfc] px-4 py-4 text-left transition-colors hover:border-[#FF5A36]/40 hover:bg-white"
          >
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#e6e7ea] text-[#6b7280]">
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-sm md:text-base font-700 text-[#111827]">{item.title}</p>
            <p className="text-xs md:text-sm text-[#6b7280]">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
