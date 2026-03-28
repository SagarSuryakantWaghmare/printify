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
    <section className="rounded-[2.5rem] border border-slate-200/60 bg-white/70 backdrop-blur-md py-12 md:py-16 px-6 md:px-10 space-y-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1D9E75]/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#1D9E75]">
          <ShieldCheck className="h-4 w-4" />
          Print Quality Options
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
          Made for High-Quality Document Printing
        </h3>
        <p className="text-base md:text-lg font-medium text-slate-600 max-w-2xl">
          India passport-size photo packs on premium paper with professional finishing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {printOptions.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200/60 bg-white/50 px-6 py-6 text-left transition-all duration-300 hover:border-[#1D9E75]/30 hover:bg-white hover:shadow-md hover:-translate-y-1 flex flex-col items-start"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-[#1D9E75]">
              <item.icon className="h-6 w-6" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">{item.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
