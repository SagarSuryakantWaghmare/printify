"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PricingCards() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "Perfect to get started",
      cta: "Download Compressed",
      features: [
        "Download compressed photos",
        "Standard crop",
        "Email delivery",
        "1 format (JPG)",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "₹49",
      description: "Most popular choice",
      cta: "Get HD Photos",
      features: [
        "HD quality download",
        "All formats (JPG, PNG, PDF)",
        "Precise crop to country spec",
        "Instant delivery",
        "Print-ready files",
      ],
      popular: true,
    },
    {
      name: "Student Pack",
      price: "₹199/mo",
      description: "Unlimited for students",
      cta: "Subscribe Now",
      features: [
        "Unlimited passport photos",
        "All countries supported",
        "HD + print formats",
        "Priority support",
        "Document templates included",
      ],
      popular: false,
    },
  ]

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 space-y-12 md:space-y-16"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Simple, Transparent Pricing
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl border-2 p-8 md:p-10 space-y-6 transition-all ${
              plan.popular
                ? "border-[#FF5A36] bg-white shadow-lg scale-105 md:scale-100 md:ring-2 md:ring-[#FF5A36] md:ring-offset-4"
                : "border-[#E5E5E5] bg-white hover:border-[#FF5A36]"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-6 -translate-y-1/2">
                <Badge
                  className="bg-[#FF5A36] text-white px-3 py-1 text-xs font-600 rounded-full"
                >
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-2xl font-700 text-[#1a1a1a]">{plan.name}</h3>
              <p className="text-sm text-[#6b7280]">{plan.description}</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-700 text-[#1a1a1a]">
                {plan.price}
              </div>
              {plan.price !== "₹0" && (
                <p className="text-sm text-[#6b7280]">
                  {plan.price.includes("/mo")
                    ? "per month, cancel anytime"
                    : "one-time"}
                </p>
              )}
            </div>

            <Button
              className={`w-full rounded-xl px-6 py-6 text-base font-600 h-auto transition-all ${
                plan.popular
                  ? "bg-[#FF5A36] text-white hover:bg-[#e04e2d]"
                  : "bg-[#F7F7F8] text-[#1a1a1a] hover:bg-[#E5E5E5]"
              }`}
            >
              {plan.cta}
            </Button>

            <div className="space-y-3 pt-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-[#1D9E75] mt-0.5" />
                  <span className="text-sm text-[#6b7280]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
