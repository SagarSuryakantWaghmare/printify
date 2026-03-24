"use client"

import { useState, useMemo } from "react"
import { useWizard } from "@/lib/hooks"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { COUNTRIES, REGIONS } from "@/lib/data/countries"

const REGIONS_WITH_ALL = ["All", ...REGIONS] as const

function CountryCard({
  country,
  selected,
  onClick,
}: {
  country: (typeof COUNTRIES)[0]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border-2 p-4 md:p-5 transition-all ${
        selected
          ? "border-[#FF5A36] bg-white"
          : "border-[#E5E5E5] hover:border-[#FF5A36]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl md:text-4xl shrink-0">{country.flag}</div>
          <div className="min-w-0">
            <p className="font-600 text-[#1a1a1a] text-sm md:text-base">
              {country.name}
            </p>
            <p className="text-xs md:text-sm text-[#6b7280]">{country.specs}</p>
          </div>
        </div>
        {selected && (
          <div className="shrink-0 mt-1">
            <div className="w-6 h-6 rounded-full bg-[#FF5A36] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  )
}

export function CountrySelectorStep() {
  const { selectedCountry, selectCountry } = useWizard()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const filteredCountries = useMemo(() => {
    let filtered = COUNTRIES

    // Filter by region
    if (selectedRegion !== "All") {
      filtered = filtered.filter((c) => c.region === selectedRegion)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(query))
    }

    return filtered
  }, [searchQuery, selectedRegion])

  // Separate popular and other countries
  const popularCountries = filteredCountries.filter((c) => c.popular)
  const otherCountries = filteredCountries.filter((c) => !c.popular)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Select Your Country
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          Choose your country to find the correct photo specifications
        </p>
      </div>

      {/* Search Bar - Sticky on mobile */}
      <div className="sticky top-0 z-30 pt-4 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 bg-white">
        <Input
          type="search"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border border-[#E5E5E5] px-4 py-3 text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Desktop: Sidebar filters */}
        <div className="hidden md:flex md:col-span-1 flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-600 text-[#1a1a1a]">Filter by Region</p>
            <div className="flex flex-col gap-2">
              {REGIONS_WITH_ALL.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors text-left ${
                    selectedRegion === region
                      ? "bg-[#FF5A36] text-white"
                      : "bg-[#F7F7F8] text-[#1a1a1a] hover:bg-[#E5E5E5]"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content: Countries grid */}
        <div className="md:col-span-2 space-y-8">
          {/* Popular Countries */}
          {popularCountries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-600 text-[#1a1a1a]">Popular Countries</h2>
                <Badge className="bg-[#FF5A36] text-white">Recommended</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {popularCountries.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    selected={selectedCountry === country.id}
                    onClick={() => selectCountry(country.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Countries */}
          {otherCountries.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-600 text-[#1a1a1a]">More Countries</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                {otherCountries.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    selected={selectedCountry === country.id}
                    onClick={() => selectCountry(country.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Filter tags at bottom */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 border-t border-[#E5E5E5] bg-white py-4 -mx-4 px-4 flex gap-2 overflow-x-auto">
        {REGIONS_WITH_ALL.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-2 rounded-full text-xs font-500 whitespace-nowrap transition-colors ${
              selectedRegion === region
                ? "bg-[#FF5A36] text-white"
                : "bg-[#F7F7F8] text-[#1a1a1a]"
            }`}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  )
}
