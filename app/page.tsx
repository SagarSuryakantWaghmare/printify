import { Hero } from "@/components/landing/Hero"
import { TrustBadges } from "@/components/landing/TrustBadges"
import { ExplainerSteps } from "@/components/landing/ExplainerSteps"
import { SupportedSizesPreview } from "@/components/landing/SupportedSizesPreview"
import { Footer } from "@/components/common/footer"

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden bg-slate-50/30">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_6%,rgba(255,90,54,0.05),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(29,158,117,0.05),transparent_32%)]" />

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:py-8 lg:px-8">
        <Hero />
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-16 px-4 pb-16 sm:px-6 md:space-y-20 md:pb-20 lg:px-8">
        <ExplainerSteps />
        <TrustBadges />
        <SupportedSizesPreview />
      </section>

      <Footer />
    </div>
  )
}
