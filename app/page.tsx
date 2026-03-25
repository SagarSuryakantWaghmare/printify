import { Hero } from "@/components/landing/Hero"
import { TrustBadges } from "@/components/landing/TrustBadges"
import { ExplainerSteps } from "@/components/landing/ExplainerSteps"
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider"
import { LogoStrip } from "@/components/landing/LogoStrip"
import { PricingCards } from "@/components/landing/PricingCards"
import { Testimonials } from "@/components/landing/Testimonials"
import { Footer } from "@/components/common/footer"
import { SectionReveal } from "@/components/common/SectionReveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

  return (
    <main className="relative w-full overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_6%,rgba(255,90,54,0.08),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(29,158,117,0.08),transparent_32%)]" />

      {/* Hero Section */}
      <SectionReveal className={`${shell} py-16 md:py-20`} delay={0.02}>
        <Hero />
      </SectionReveal>

      {/* Trust Badges */}
      <SectionReveal className={`${shell} py-10 md:py-12`} delay={0.06}>
        <TrustBadges />
      </SectionReveal>

      {/* Before/After Slider + Explainer (Responsive) */}
      <SectionReveal className={`${shell} relative py-16 md:py-20`} delay={0.08}>
        <div className="pointer-events-none absolute -left-20 top-6 hidden h-40 w-40 rounded-full bg-[#ffece6] blur-3xl md:block" />
        <div className="pointer-events-none absolute -right-20 bottom-10 hidden h-48 w-48 rounded-full bg-[#e9f8f2] blur-3xl md:block" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Slider */}
          <div className="order-2 md:order-1">
            <BeforeAfterSlider />
          </div>
          {/* Right: Explainer Steps */}
          <div className="order-1 md:order-2">
            <ExplainerSteps />
          </div>
        </div>
      </SectionReveal>

      {/* Logo Strip */}
      <SectionReveal className={`${shell} py-14 md:py-16`} delay={0.1}>
        <LogoStrip />
      </SectionReveal>

      {/* Print Pack Section */}
      <SectionReveal className={`${shell} py-16 md:py-24`} delay={0.12}>
        <PricingCards />
      </SectionReveal>

      {/* Testimonials */}
      <SectionReveal className={`${shell} py-14 md:py-20`} delay={0.14}>
        <Testimonials />
      </SectionReveal>

      {/* Footer CTA */}
      <SectionReveal className="relative bg-[#F7F7F8] py-16 md:py-24" delay={0.16}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.55)_15%,rgba(255,255,255,0)_70%)]" />
        <div className={`${shell} relative text-center space-y-8`}>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-700 tracking-tight text-[#111827]">
            Ready to create your
            <br />
            <span className="text-[#FF5A36]">Indian passport photo pack?</span>
          </h2>
          <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
            Upload once, then choose 8 or 12 prints on ultra-gloss paper with precision-cut quality.
          </p>
          <Link href="/app">
            <Button className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-8 py-6 text-base font-600 h-auto">
              Start My Passport Photo
            </Button>
          </Link>
        </div>
      </SectionReveal>

      <Footer />
    </main>
  )
}
