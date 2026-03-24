"use client"

export function ExplainerSteps() {
  const steps = [
    {
      emoji: "📸",
      label: "Take Photo",
      description: "Use your phone camera or upload from gallery",
    },
    {
      emoji: "🤖",
      label: "AI Processes",
      description: "Our AI removes background & aligns to spec",
    },
    {
      emoji: "⬇️",
      label: "Download",
      description: "Get instant high-quality results",
    },
  ]

  return (
    <section className="py-12 md:py-20 space-y-8 md:space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Three Simple Steps
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
          From photo to perfect passport size in minutes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-[#E5E5E5] p-6 md:p-8 text-center space-y-3 hover:border-[#FF5A36] transition-colors"
          >
            <div className="text-5xl md:text-6xl">{step.emoji}</div>
            <h3 className="text-lg md:text-xl font-600 text-[#1a1a1a]">
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
