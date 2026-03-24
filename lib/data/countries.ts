export interface Country {
  id: string
  name: string
  flag: string
  region: "Asia" | "Europe" | "Americas" | "Middle East" | "Africa" | "Pacific"
  specs: string
  popular: boolean
}

export const COUNTRIES: Country[] = [
  // Popular countries
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    region: "Asia",
    specs: "35×45mm · White background",
    popular: true,
  },
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    region: "Americas",
    specs: "2×2 inches · White background",
    popular: true,
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: true,
  },
  {
    id: "uae",
    name: "UAE",
    flag: "🇦🇪",
    region: "Middle East",
    specs: "4×6cm · White background",
    popular: true,
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    region: "Americas",
    specs: "2×2 inches · White background",
    popular: true,
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    region: "Pacific",
    specs: "35×45mm · White background",
    popular: true,
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: true,
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: true,
  },
  // Other countries
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    specs: "4×3cm · White background",
    popular: false,
  },
  {
    id: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Asia",
    specs: "35×45mm · White background",
    popular: false,
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Asia",
    specs: "35×50mm · White background",
    popular: false,
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Asia",
    specs: "4×6cm · White background",
    popular: false,
  },
  {
    id: "newzealand",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Pacific",
    specs: "45×35mm · White background",
    popular: false,
  },
  {
    id: "ireland",
    flag: "🇮🇪",
    name: "Ireland",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: false,
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: false,
  },
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    region: "Europe",
    specs: "32×26mm · White background",
    popular: false,
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: false,
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    region: "Americas",
    specs: "4×5cm · Light background",
    popular: false,
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    region: "Americas",
    specs: "5×7cm · White background",
    popular: false,
  },
  {
    id: "southafrica",
    name: "South Africa",
    flag: "🇿🇦",
    region: "Africa",
    specs: "35×45mm · White background",
    popular: false,
  },
]

export const REGIONS = ["Asia", "Europe", "Americas", "Middle East", "Africa", "Pacific"] as const

export function getCountriesByRegion(region: string): Country[] {
  return COUNTRIES.filter((c) => c.region === region)
}

export function getPopularCountries(): Country[] {
  return COUNTRIES.filter((c) => c.popular)
}

export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase()
  return COUNTRIES.filter((c) => c.name.toLowerCase().includes(lowerQuery))
}
