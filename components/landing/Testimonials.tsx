"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { scrollReveal } from "@/lib/animations"
import Image from "next/image"

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Graduate Student",
    quote:
      "I picked the 8 prints pack and the finish looked premium. The photo size matched my requirement perfectly.",
    avatar: "AM",
    rating: 5,
  },
  {
    name: "Nisha Rao",
    role: "Product Designer",
    quote:
      "The flow is super clean. Upload, AI correction, then choose 12 prints on glossy paper in minutes.",
    avatar: "NR",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Travel Consultant",
    quote:
      "Precision-cut output makes a big difference. The final print sheet feels professional and ready to submit.",
    avatar: "RV",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="space-y-8 md:space-y-10">
      <motion.div 
        {...scrollReveal}
        className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end"
      >
        <div className="space-y-3">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-widest text-[#FF5A36]"
          >
            Trusted by users
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Trusted For Premium <span className="gradient-text">Indian</span> Passport Prints
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-base sm:text-lg text-slate-600"
          >
            Users choose PrintfY for cleaner output, premium paper quality, and confident final submission.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="rounded-2xl border border-[#FFD5C8] bg-[#FFF1ED] px-5 py-3 text-sm font-bold text-[#C84426] shadow-sm hover:shadow-md transition-all cursor-default"
        >
          ⭐ 4.9/5 Average User Rating
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-10">
        {testimonials.map((item, idx) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(255,90,54,0.15)" }}
            className="rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-md p-8 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-all duration-500 hover:border-[#FF5A36]/30 flex flex-col justify-between group cursor-default"
          >
            <div>
              <motion.div 
                className="mb-6 flex items-center gap-1.5 text-[#FF5A36]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.15 + 0.2 }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.15 + 0.3 + i * 0.05 }}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-base leading-relaxed text-slate-700 italic group-hover:text-slate-800 transition-colors">"{item.quote}"</p>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF5A36] to-[#FF8C6B] text-white font-bold text-sm shadow-md">
                {item.avatar}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">{item.name}</p>
                <p className="text-sm font-medium text-slate-500">{item.role}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
