"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-12 md:py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Headline + CTA */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-700 leading-tight text-[#1a1a1a]">
              Passport Photos That Get Approved.
              <br />
              <span className="text-[#FF5A36]">In 2 Minutes.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#6b7280] max-w-xl">
              AI-powered passport photo generator trusted by Indian students and visa applicants. Precise cropping, instant results.
            </p>
          </div>

          <Button
            asChild
            className="w-full sm:w-auto bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-8 py-6 text-base font-600 h-auto"
          >
            <Link href="/app">Start Free</Link>
          </Button>
        </div>

        {/* Right: Mockup placeholder (will be replaced with before/after slider) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-linear-to-br from-[#FF5A36] to-[#e04e2d] opacity-20 flex items-center justify-center">
            <span className="text-[#6b7280] text-sm font-500">
              Before/After Slider Coming
            </span>
          </div>
        </div>
      </div>

      {/* Mobile: Demo card below hero */}
      <div className="md:hidden mt-12 rounded-3xl overflow-hidden bg-[#F7F7F8] p-6">
        <p className="text-xs font-600 text-[#6b7280] text-center mb-4">
          PREVIEW
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square rounded-2xl bg-white border border-[#E5E5E5]" />
          <div className="aspect-square rounded-2xl bg-white border border-[#E5E5E5]" />
        </div>
      </div>
    </section>
  )
}
