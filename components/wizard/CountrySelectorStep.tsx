"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Check, Globe, Star, ChevronRight, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  COUNTRIES, 
  REGIONS, 
  getPopularCountries, 
  searchCountries, 
  getCountriesByRegion,
  type Country 
} from "@/lib/data/countries"

interface CountrySelectorStepProps {
  onSelect: (countryId: string) => void
  selectedCountryId?: string
}

export function CountrySelectorStep({ onSelect, selectedCountryId }: CountrySelectorStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const popularCountries = useMemo(() => getPopularCountries(), [])
  
  const filteredCountries = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCountries(searchQuery)
    }
    if (activeRegion) {
      return getCountriesByRegion(activeRegion)
    }
    return COUNTRIES
  }, [searchQuery, activeRegion])

  const selectedCountry = COUNTRIES.find(c => c.id === selectedCountryId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-1"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          Select Your Country
        </h1>
        <p className="text-base text-[#6b7280]">
          Choose your destination country to get the correct photo specifications
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
        <Input
          type="text"
          placeholder="Search countries..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setActiveRegion(null) }}
          className="h-12 pl-12 pr-4 rounded-xl border-[#E5E7EB] bg-white text-base focus:border-[#FF5A36] focus:ring-[#FF5A36]/20"
        />
      </motion.div>

      {/* Popular countries */}
      {!searchQuery && !activeRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6b7280]">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            Popular Countries
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {popularCountries.map((country) => (
              <CountryCard
                key={country.id}
                country={country}
                isSelected={country.id === selectedCountryId}
                onSelect={onSelect}
                onShowDetails={setShowDetails}
                compact
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Region tabs */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6b7280]">
            <Globe className="h-4 w-4" />
            Browse by Region
          </div>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeRegion === region
                    ? "bg-[#FF5A36] text-white shadow-sm"
                    : "bg-[#F7F7F8] text-[#374151] hover:bg-[#E5E7EB]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Country list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide rounded-xl"
      >
        {filteredCountries.length === 0 ? (
          <div className="text-center py-12 text-[#6b7280]">
            <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No countries found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.02 * index }}
              >
                <CountryCard
                  country={country}
                  isSelected={country.id === selectedCountryId}
                  onSelect={onSelect}
                  onShowDetails={setShowDetails}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Selected country preview */}
      {selectedCountry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-[#FF5A36] bg-[#FFF5F0] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedCountry.flag}</span>
              <div>
                <p className="font-semibold text-[#1a1a1a]">{selectedCountry.name}</p>
                <p className="text-sm text-[#6b7280]">
                  {selectedCountry.passportSpec.widthMm}×{selectedCountry.passportSpec.heightMm}mm
                </p>
              </div>
            </div>
            <Check className="h-6 w-6 text-[#FF5A36]" />
          </div>
          {selectedCountry.passportSpec.notes && (
            <p className="mt-3 text-xs text-[#6b7280] bg-white rounded-lg px-3 py-2">
              {selectedCountry.passportSpec.notes}
            </p>
          )}
        </motion.div>
      )}

      {/* Country details modal */}
      <AnimatePresence>
        {showDetails && (
          <CountryDetailsModal
            countryId={showDetails}
            onClose={() => setShowDetails(null)}
            onSelect={onSelect}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

interface CountryCardProps {
  country: Country
  isSelected: boolean
  onSelect: (id: string) => void
  onShowDetails: (id: string) => void
  compact?: boolean
}

function CountryCard({ country, isSelected, onSelect, onShowDetails, compact }: CountryCardProps) {
  return (
    <button
      onClick={() => onSelect(country.id)}
      className={`relative flex items-center gap-3 w-full rounded-xl p-3 text-left transition-all ${
        isSelected
          ? "border-2 border-[#FF5A36] bg-[#FFF5F0] shadow-sm"
          : "border border-[#E5E7EB] bg-white hover:border-[#FF5A36]/40 hover:bg-[#FFF8F6]"
      } ${compact ? "p-2.5" : ""}`}
    >
      <span className={`${compact ? "text-xl" : "text-2xl"}`}>{country.flag}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-[#1a1a1a] truncate ${compact ? "text-sm" : ""}`}>
          {country.name}
        </p>
        {!compact && (
          <p className="text-xs text-[#6b7280] truncate">{country.specs}</p>
        )}
      </div>
      {isSelected && (
        <Check className="h-5 w-5 text-[#FF5A36] shrink-0" />
      )}
      {!isSelected && !compact && (
        <button
          onClick={(e) => { e.stopPropagation(); onShowDetails(country.id) }}
          className="p-1 rounded-lg hover:bg-[#E5E7EB] transition-colors"
        >
          <Info className="h-4 w-4 text-[#9ca3af]" />
        </button>
      )}
    </button>
  )
}

interface CountryDetailsModalProps {
  countryId: string
  onClose: () => void
  onSelect: (id: string) => void
}

function CountryDetailsModal({ countryId, onClose, onSelect }: CountryDetailsModalProps) {
  const country = COUNTRIES.find(c => c.id === countryId)
  if (!country) return null

  const spec = country.passportSpec

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#F7F7F8] px-6 py-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{country.flag}</span>
            <div>
              <h3 className="font-display text-xl font-bold text-[#1a1a1a]">{country.name}</h3>
              <p className="text-sm text-[#6b7280]">{country.region}</p>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#F7F7F8] p-3 text-center">
              <p className="text-2xl font-bold text-[#1a1a1a]">{spec.widthMm}×{spec.heightMm}</p>
              <p className="text-xs text-[#6b7280]">Size (mm)</p>
            </div>
            <div className="rounded-xl bg-[#F7F7F8] p-3 text-center">
              <div 
                className="w-8 h-8 rounded-lg mx-auto border border-[#E5E7EB]"
                style={{ backgroundColor: spec.bgColorHex }}
              />
              <p className="text-xs text-[#6b7280] mt-1 capitalize">{spec.bgColor.replace("-", " ")}</p>
            </div>
          </div>

          {spec.faceCoverage && (
            <div className="rounded-xl border border-[#E5E7EB] p-3">
              <p className="text-xs font-semibold text-[#6b7280] mb-1">Face Coverage</p>
              <p className="text-sm text-[#1a1a1a]">{spec.faceCoverage}</p>
            </div>
          )}

          {spec.notes && (
            <div className="rounded-xl border border-[#E5E7EB] p-3">
              <p className="text-xs font-semibold text-[#6b7280] mb-1">Requirements</p>
              <p className="text-sm text-[#1a1a1a]">{spec.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-xl border-[#E5E7EB]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => { onSelect(country.id); onClose() }}
            className="flex-1 rounded-xl bg-[#FF5A36] hover:bg-[#e04e2d] text-white"
          >
            Select Country
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

