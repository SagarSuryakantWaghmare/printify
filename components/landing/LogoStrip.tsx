"use client"

export function LogoStrip() {
  const countries = [
    { flag: "🇮🇳", name: "India" },
    { flag: "🇺🇸", name: "USA" },
    { flag: "🇬🇧", name: "UK" },
    { flag: "🇪🇺", name: "Schengen" },
    { flag: "🇦🇺", name: "Australia" },
    { flag: "🇯🇵", name: "Japan" },
  ]

  return (
    <section className="py-12 md:py-16 border-t border-b border-[#E5E5E5] space-y-8">
      <p className="text-center text-sm font-600 text-[#6b7280] uppercase tracking-wide">
        Trusted by students applying to
      </p>

      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
        {countries.map((country) => (
          <div
            key={country.name}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-4xl md:text-5xl">{country.flag}</div>
            <p className="text-xs md:text-sm font-500 text-[#6b7280]">
              {country.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
