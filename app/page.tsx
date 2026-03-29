import { Hero } from "@/components/landing/Hero"
import { TrustBadges } from "@/components/landing/TrustBadges"
import { ExplainerSteps } from "@/components/landing/ExplainerSteps"
import { SupportedSizesPreview } from "@/components/landing/SupportedSizesPreview"
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider"
import { Testimonials } from "@/components/landing/Testimonials"
import { LogoStrip } from "@/components/landing/LogoStrip"
import { PricingCards } from "@/components/landing/PricingCards"
import { Footer } from "@/components/common/footer"

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden bg-slate-50/30">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_6%,rgba(255,90,54,0.05),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(29,158,117,0.05),transparent_32%)]" />

      {/* Hero */}
      <Hero />

      {/* Value anchor banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 mb-6">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#FFD5C8] bg-[#FFF5F0] px-5 py-3 text-sm font-semibold text-[#C84426]">
          <span>💸</span>
          <span>Studios charge <strong>₹50–₹150 per photo</strong> — PrintfY is completely free.</span>
        </div>
      </div>

      <section id="how-it-works" className="mx-auto w-full max-w-7xl space-y-20 px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <ExplainerSteps />
        <TrustBadges />

        {/* Before / After demo */}
        <div className="mx-auto max-w-4xl px-4 sm:px-0">
          <BeforeAfterSlider />
        </div>

        <LogoStrip />
        <Testimonials />
        <SupportedSizesPreview />
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <PricingCards />
      </section>

      <Footer />
    </div>
  )
}

