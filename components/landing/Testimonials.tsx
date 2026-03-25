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
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-700 uppercase tracking-widest text-[#FF5A36]">
            Trusted by users
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 tracking-tight text-[#111827]">
            Trusted For Premium Indian Passport Prints
          </h2>
          <p className="max-w-2xl text-base md:text-lg text-[#6b7280]">
            Users choose PrintfY for cleaner output, premium paper quality, and confident final submission.
          </p>
        </div>
        <div className="rounded-2xl border border-[#ffd6cd] bg-[#fff4f0] px-4 py-3 text-sm font-600 text-[#c43d1f]">
          4.9/5 average user rating
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-3xl border border-[#E8E8EA] bg-white p-6 md:p-7 shadow-[0_8px_24px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(17,24,39,0.1)]"
          >
            <div className="mb-4 flex items-center gap-1 text-[#FF5A36]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#4b5563]">“{item.quote}”</p>
            <div className="mt-6">
              <p className="text-base font-700 text-[#1a1a1a]">{item.name}</p>
              <p className="text-sm text-[#6b7280]">{item.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
