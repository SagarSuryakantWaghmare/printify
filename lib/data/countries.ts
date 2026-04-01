export type BgColorType = "white" | "light-gray" | "light-blue" | "red" | "any"

export interface PassportSpec {
  widthMm: number
  heightMm: number
  bgColor: BgColorType
  bgColorHex: string
  headHeightPercent?: { min: number; max: number }
  eyeLinePercent?: number
  faceCoverage?: string
  notes?: string
}

export interface Country {
  id: string
  name: string
  flag: string
  region: "Asia" | "Europe" | "Americas" | "Middle East" | "Africa" | "Pacific"
  specs: string
  popular: boolean
  passportSpec: PassportSpec
  visaSpec?: PassportSpec
  dlSpec?: PassportSpec
}

const DEFAULT_SPEC: PassportSpec = {
  widthMm: 35,
  heightMm: 45,
  bgColor: "white",
  bgColorHex: "#ffffff",
  headHeightPercent: { min: 70, max: 80 },
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
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face: 70-80% of photo height",
      notes: "Eyes must be open, neutral expression, no glasses",
    },
  },
  {
    id: "usa",
    name: "USA",
    flag: "🇺🇸",
    region: "Americas",
    specs: "2×2 inches · White background",
    popular: true,
    passportSpec: {
      widthMm: 51,
      heightMm: 51,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 50, max: 69 },
      eyeLinePercent: 60,
      faceCoverage: "Head: 1-1⅜ inches (25-35mm)",
      notes: "Eyes must be between 1⅛ and 1⅜ inches from bottom",
    },
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    specs: "35×45mm · White or light gray",
    popular: true,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#f0f0f0",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face height: 29-34mm",
      notes: "Plain light grey or cream background, mouth closed",
    },
  },
  {
    id: "uae",
    name: "UAE",
    flag: "🇦🇪",
    region: "Middle East",
    specs: "4×6cm · White background",
    popular: true,
    passportSpec: {
      widthMm: 40,
      heightMm: 60,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White background only, recent photo (within 6 months)",
    },
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    region: "Americas",
    specs: "50×70mm · White background",
    popular: true,
    passportSpec: {
      widthMm: 50,
      heightMm: 70,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 45, max: 55 },
      faceCoverage: "Face height: 31-36mm",
      notes: "Plain white or light-colored background, neutral expression",
    },
  },
  {
    id: "australia",
    name: "Australia",
    flag: "🇦🇺",
    region: "Pacific",
    specs: "35×45mm · White background",
    popular: true,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 64, max: 80 },
      faceCoverage: "Head size: 32-36mm",
      notes: "Plain light background, neutral expression, mouth closed",
    },
  },
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    region: "Europe",
    specs: "35×45mm · White or light gray",
    popular: true,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#e8e8e8",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face: 32-36mm height",
      notes: "Uniform light background, neutral expression, no shadows",
    },
  },
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    region: "Europe",
    specs: "35×45mm · Light gray background",
    popular: true,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#d9d9d9",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face: 32-36mm height",
      notes: "Light gray, blue or light background. Mouth closed.",
    },
  },
  // Other countries
  {
    id: "japan",
    name: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Plain white or off-white background",
    },
  },
  {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    region: "Asia",
    specs: "33×48mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 33,
      heightMm: 48,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 66, max: 75 },
      faceCoverage: "Head width: 21-24mm, face length: 28-33mm",
      notes: "White background, no borders, front facing",
    },
  },
  {
    id: "singapore",
    name: "Singapore",
    flag: "🇸🇬",
    region: "Asia",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White background only",
    },
  },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    region: "Asia",
    specs: "35×50mm · White or light blue",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 50,
      bgColor: "light-blue",
      bgColorHex: "#e3f2fd",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White or light blue background",
    },
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    region: "Asia",
    specs: "40×60mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 40,
      heightMm: 60,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White background, formal attire",
    },
  },
  {
    id: "southkorea",
    name: "South Korea",
    flag: "🇰🇷",
    region: "Asia",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face size: 25-35mm",
      notes: "Plain white background, natural expression",
    },
  },
  {
    id: "newzealand",
    name: "New Zealand",
    flag: "🇳🇿",
    region: "Pacific",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Plain off-white or light grey background",
    },
  },
  {
    id: "ireland",
    flag: "🇮🇪",
    name: "Ireland",
    region: "Europe",
    specs: "35×45mm · White/light gray",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#f5f5f5",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Light grey or off-white background",
    },
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    region: "Europe",
    specs: "35×45mm · Light background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#efefef",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Light grey background, no patterns",
    },
  },
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    region: "Europe",
    specs: "26×32mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 26,
      heightMm: 32,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White or uniform light background",
    },
  },
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Plain white background",
    },
  },
  {
    id: "switzerland",
    name: "Switzerland",
    flag: "🇨🇭",
    region: "Europe",
    specs: "35×45mm · Light background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#f0f0f0",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Plain light background, no shadows",
    },
  },
  {
    id: "mexico",
    name: "Mexico",
    flag: "🇲🇽",
    region: "Americas",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "Plain white background",
    },
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    region: "Americas",
    specs: "50×70mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 50,
      heightMm: 70,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 60, max: 70 },
      notes: "Plain white background, front facing",
    },
  },
  {
    id: "southafrica",
    name: "South Africa",
    flag: "🇿🇦",
    region: "Africa",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White background, neutral expression",
    },
  },
  {
    id: "saudiarabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    region: "Middle East",
    specs: "40×60mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 40,
      heightMm: 60,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White background, full face visible",
    },
  },
  {
    id: "russia",
    name: "Russia",
    flag: "🇷🇺",
    region: "Europe",
    specs: "35×45mm · White background",
    popular: false,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "white",
      bgColorHex: "#ffffff",
      headHeightPercent: { min: 70, max: 80 },
      notes: "White or light gray background",
    },
  },
  {
    id: "schengen",
    name: "Schengen Visa",
    flag: "🇪🇺",
    region: "Europe",
    specs: "35×45mm · Light background",
    popular: true,
    passportSpec: {
      widthMm: 35,
      heightMm: 45,
      bgColor: "light-gray",
      bgColorHex: "#f0f0f0",
      headHeightPercent: { min: 70, max: 80 },
      faceCoverage: "Face: 32-36mm height",
      notes: "ICAO standard - light grey or light blue background",
    },
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

export function getCountryById(id: string): Country | undefined {
  return COUNTRIES.find((c) => c.id === id)
}

export function getPassportSpecById(id: string): PassportSpec {
  const country = COUNTRIES.find((c) => c.id === id)
  return country?.passportSpec ?? DEFAULT_SPEC
}

export const BG_COLOR_MAP: Record<BgColorType, string> = {
  "white": "#ffffff",
  "light-gray": "#f0f0f0",
  "light-blue": "#e3f2fd",
  "red": "#c0392b",
  "any": "#ffffff",
}
