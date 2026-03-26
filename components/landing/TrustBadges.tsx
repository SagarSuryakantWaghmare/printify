import { BadgeIndianRupee, Printer, ShieldCheck, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TrustBadges() {
  const badges = [
    {
      icon: Printer,
      label: "Self-Print Workflow",
      description: "Maintain full control from capture to export and print directly from your own setup.",
    },
    {
      icon: BadgeIndianRupee,
      label: "100% Free Tool",
      description: "No hidden charges. Generate professional print sheets at no cost.",
    },
    {
      icon: ShieldCheck,
      label: "No Design Skills Needed",
      description: "Auto-tiling and ready layout make the process simple for both professionals and beginners.",
    },
    {
      icon: Smartphone,
      label: "Made for Android Phones",
      description: "Lightweight interface that performs smoothly on budget phones and slower mobile networks.",
    },
  ]

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Why People In India Use Printify
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Built for photographers and individual users who need a fast self-print workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge, idx) => {
        const Icon = badge.icon
        return (
          <Card
            key={idx}
            className="border-slate-200 bg-white"
          >
            <CardHeader className="pb-2">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F2]">
                <Icon className="h-5 w-5 text-[#1D9E75]" />
              </div>
              <CardTitle className="text-base leading-snug text-slate-900">{badge.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-600">
                {badge.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
      </div>
    </section>
  )
}
