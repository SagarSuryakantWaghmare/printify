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
import { ArrowRight } from "lucide-react"

export default function Home() {
  const shell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

  return (
    <main className="relative w-full overflow-x-hidden bg-slate-50/30">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_6%,rgba(255,90,54,0.05),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(29,158,117,0.05),transparent_32%)]" />

      {/* Hero Section */}
      <SectionReveal className={`${shell} py-4 md:py-12`} delay={0.05}>
        <Hero />
      </SectionReveal>

      {/* Trust Badges */}
      <SectionReveal className={`${shell} pb-10 md:pb-16`} delay={0.1}>
        <TrustBadges />
      </SectionReveal>

      {/* Before/After Slider + Explainer (Responsive) */}
      <SectionReveal className={`${shell} relative py-16 md:py-24`} delay={0.15}>
        <div className="pointer-events-none absolute -left-20 top-6 hidden h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#FF5A36]/5 to-transparent blur-3xl md:block" />
        <div className="pointer-events-none absolute -right-20 bottom-10 hidden h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-[#1D9E75]/5 to-transparent blur-3xl md:block" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left: Slider */}
          <div className="order-2 md:order-1 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF5A36]/10 to-[#1D9E75]/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <BeforeAfterSlider />
          </div>
          {/* Right: Explainer Steps */}
          <div className="order-1 md:order-2">
            <ExplainerSteps />
          </div>
        </div>
      </SectionReveal>

      {/* Logo Strip */}
      <SectionReveal className={`${shell} py-10 md:py-16`} delay={0.2}>
        <LogoStrip />
      </SectionReveal>

      {/* Print Pack Section */}
      <SectionReveal className={`${shell} py-16 md:py-24`} delay={0.2}>
        <PricingCards />
      </SectionReveal>

      {/* Testimonials */}
      <SectionReveal className={`${shell} py-14 md:py-20`} delay={0.2}>
        <Testimonials />
      </SectionReveal>

      {/* Footer CTA */}
      <SectionReveal className="relative bg-white py-24 md:py-32 overflow-hidden border-t border-slate-100" delay={0.2}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,90,54,0.05),transparent_50%)]" />
        <div className={`${shell} relative text-center space-y-10 max-w-4xl mx-auto`}>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Ready to create your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-[#ff8a73]">
              Indian passport photo pack?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Upload once, then choose 8 or 12 prints on ultra-gloss paper with precision-cut quality.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/app">
              <Button className="group relative bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl px-10 py-7 text-lg font-bold h-auto overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,90,54,0.3)]">
                <span className="relative z-10 flex items-center justify-center">
                  Start My Passport Photo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </Button>
            </Link>
          </div>
        </div>
      </SectionReveal>

      <Footer />
    </main>
  )
}
