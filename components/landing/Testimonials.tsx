"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Graduate Student",
    quote:
      "I picked the 8 prints pack and the finish looked premium. The photo size matched my requirement perfectly.",
  },
  {
    name: "Nisha Rao",
    role: "Product Designer",
    quote:
      "The flow is super clean. Upload, AI correction, then choose 12 prints on glossy paper in minutes.",
  },
  {
    name: "Rahul Verma",
    role: "Travel Consultant",
    quote:
      "Precision-cut output makes a big difference. The final print sheet feels professional and ready to submit.",
  },
]

export function Testimonials() {
  return (
    <section className="space-y-8 md:space-y-10">
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FF5A36]">
            Trusted by users
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Trusted For Premium <span className="gradient-text">Indian</span> Passport Prints
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-600">
            Users choose PrintfY for cleaner output, premium paper quality, and confident final submission.
          </p>
        </div>
        <div className="rounded-2xl border border-[#FFD5C8] bg-[#FFF1ED] px-5 py-3 text-sm font-bold text-[#C84426] shadow-sm">
          4.9/5 Average User Rating
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-10">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-8 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,90,54,0.15)] hover:border-[#FF5A36]/30 flex flex-col justify-between"
          >
            <div>
              <div className="mb-6 flex items-center gap-1.5 text-[#FF5A36]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-base leading-relaxed text-slate-700 italic">"{item.quote}"</p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <p className="text-lg font-bold text-slate-900">{item.name}</p>
              <p className="text-sm font-medium text-slate-500">{item.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
