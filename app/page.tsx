import { Hero } from "@/components/landing/Hero"
import { TrustBadges } from "@/components/landing/TrustBadges"
import { ExplainerSteps } from "@/components/landing/ExplainerSteps"
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider"
import { LogoStrip } from "@/components/landing/LogoStrip"
import { PricingCards } from "@/components/landing/PricingCards"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
        <Hero />
      </section>

      {/* Trust Badges */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
        <TrustBadges />
      </section>

      {/* Before/After Slider + Explainer (Responsive) */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-20 space-y-12 md:space-y-16">
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
      </section>

      {/* Logo Strip */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
        <LogoStrip />
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
        <PricingCards />
      </section>

      {/* Footer CTA */}
      <section className="px-4 sm:px-6 md:px-8 bg-[#F7F7F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
            Ready to generate your
            <br />
            <span className="text-[#FF5A36]">perfect passport photo?</span>
          </h2>
          <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
            Start now and get approved photos in 2 minutes or less
          </p>
          <Link href="/app">
            <Button className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-8 py-6 text-base font-600 h-auto">
              Start Free
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
