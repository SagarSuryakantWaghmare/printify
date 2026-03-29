/**
 * Printer Profile Definitions
 * Professional printer presets with DPI and color space recommendations
 */

export interface PrinterProfile {
  id: string
  name: string
  category: "inkjet" | "laser" | "dye-sub"
  description: string
  recommendedDpi: number
  colorSpace: "srgb" | "adobergb" | "prophoto"
  colorSpaceDescription: string
  maxMoisture?: string
  features: string[]
}

export const PRINTER_PROFILES: PrinterProfile[] = [
  {
    id: "epson-inkjet-photo",
    name: "Epson Photo (Inkjet)",
    category: "inkjet",
    description: "High-quality photo inkjet with premium paper support",
    recommendedDpi: 300,
    colorSpace: "srgb",
    colorSpaceDescription: "sRGB (wide gamut with glossy paper)",
    maxMoisture: "Guard against humidity when handling",
    features: [
      "7+ color printing",
      "Suitable for premium matte & glossy",
      "Water-resistant inks available",
      "Best with dedicated photo paper",
    ],
  },
  {
    id: "canon-inkjet-pixma",
    name: "Canon PIXMA (Inkjet)",
    category: "inkjet",
    description: "Consumer-friendly inkjet with good color accuracy",
    recommendedDpi: 300,
    colorSpace: "srgb",
    colorSpaceDescription: "sRGB (optimized for lab settings)",
    features: [
      "6-color system",
      "Good for matte prints",
      "Fine Art paper compatible",
      "Lower running costs than Epson",
    ],
  },
  {
    id: "hp-inkjet-designjet",
    name: "HP DesignJet (Inkjet)",
    category: "inkjet",
    description: "Wide-format inkjet for professional prints",
    recommendedDpi: 300,
    colorSpace: "adobergb",
    colorSpaceDescription: "Adobe RGB (for professional work)",
    features: [
      "Variable drop size technology",
      "Suitable for large format",
      "Fast drying inks",
      "Wide media support",
    ],
  },
  {
    id: "brother-laser-color",
    name: "Brother Color Laser",
    category: "laser",
    description: "Compact color laser printer for office use",
    recommendedDpi: 600,
    colorSpace: "srgb",
    colorSpaceDescription: "sRGB (standard color space)",
    features: [
      "Fast print speed",
      "Sharp text & graphics",
      "Suitable for glossy coated paper",
      "Good for mixed use (photos + documents)",
    ],
  },
  {
    id: "ricoh-laser-pro",
    name: "Ricoh MP C (Laser)",
    category: "laser",
    description: "Professional-grade color laser system",
    recommendedDpi: 600,
    colorSpace: "adobergb",
    colorSpaceDescription: "Adobe RGB (professional color)",
    features: [
      "High-speed professional printing",
      "Excellent color consistency",
      "Heavy media support",
      "Ideal for service bureaus",
    ],
  },
  {
    id: "xerox-laser-color",
    name: "Xerox VersaLink (Laser)",
    category: "laser",
    description: "Versatile color laser for professional environments",
    recommendedDpi: 600,
    colorSpace: "srgb",
    colorSpaceDescription: "sRGB with Pantone matching",
    features: [
      "Exceptional color quality",
      "Advanced finishing options",
      "Security features for enterprise",
      "Suitable for premium coated stock",
    ],
  },
  {
    id: "mitsubishi-dye-sub",
    name: "Mitsubishi Dye-Sub",
    category: "dye-sub",
    description: "Professional dye-sublimation for premium photo prints",
    recommendedDpi: 300,
    colorSpace: "prophoto",
    colorSpaceDescription: "ProPhoto RGB (widest gamut available)",
    features: [
      "Continuous tone output",
      "No visible dots or banding",
      "Archival quality with special paper",
      "Vibrant colors with wide gamut",
      "Best for professional photo labs",
    ],
  },
  {
    id: "sony-dye-sub-compact",
    name: "Sony Dye-Sub (Compact)",
    category: "dye-sub",
    description: "Portable dye-sublimation for on-location printing",
    recommendedDpi: 300,
    colorSpace: "srgb",
    colorSpaceDescription: "sRGB (optimized for 4×6 prints)",
    features: [
      "Portable & lightweight",
      "Fast print speed",
      "Perfect for events & proofs",
      "Limited to small format",
      "Built-in cutter for clean edges",
    ],
  },
  {
    id: "fnac-dye-sub-pro",
    name: "FNAC Dye-Sub (Professional)",
    category: "dye-sub",
    description: "Industrial dye-sublimation for volume production",
    recommendedDpi: 600,
    colorSpace: "adobergb",
    colorSpaceDescription: "Adobe RGB (professional gamut)",
    features: [
      "High-volume production ready",
      "Consistent color across batches",
      "Thermal transfer technology",
      "Minimal maintenance required",
      "Suitable for lab automation",
    ],
  },
]

/**
 * Get profile by ID
 */
export function getProfileById(id: string): PrinterProfile | undefined {
  return PRINTER_PROFILES.find((p) => p.id === id)
}

/**
 * Get profiles by category
 */
export function getProfilesByCategory(
  category: "inkjet" | "laser" | "dye-sub",
): PrinterProfile[] {
  return PRINTER_PROFILES.filter((p) => p.category === category)
}

/**
 * Get recommended DPI for a profile
 */
export function getRecommendedDpi(profileId: string): number {
  const profile = getProfileById(profileId)
  return profile?.recommendedDpi || 300
}

/**
 * Get color space for profile (for color management)
 */
export function getColorSpace(profileId: string): string {
  const profile = getProfileById(profileId)
  return profile?.colorSpace || "srgb"
}

/**
 * Format profile name with category badge
 */
export function formatProfileName(profile: PrinterProfile): string {
  return `${profile.name}`
}
