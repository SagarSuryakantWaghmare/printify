"use client"

import { Camera, WandSparkles, DownloadCloud } from "lucide-react"

export function ExplainerSteps() {
  const steps = [
    {
      icon: Camera,
      label: "Upload Your Photo",
      description: "Capture or upload one clear photo to start your Indian passport workflow.",
    },
    {
      icon: WandSparkles,
      label: "AI Passport Setup",
      description: "We correct background, align your face, and set official Indian passport size.",
    },
    {
      icon: DownloadCloud,
      label: "Choose 8 Or 12 Prints",
      description: "Pick your print pack with ultra-gloss paper and precision cutting finish.",
    },
  ]

  return (
    <section id="how-it-works" className="space-y-8 md:space-y-12">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 tracking-tight text-[#111827]">
          From Upload To Premium Prints In 3 Steps
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
          Built for Indian passport needs with a clean flow and zero manual editing work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-white border border-[#e6e7ea] p-6 md:p-8 text-left space-y-4 transition-all hover:-translate-y-1 hover:border-[#FF5A36] hover:shadow-[0_18px_30px_rgba(17,24,39,0.08)]"
          >
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff2ed] text-[#FF5A36]">
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg md:text-xl font-600 text-[#111827]">
              {step.label}
            </h3>
            <p className="text-sm md:text-base text-[#6b7280]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
