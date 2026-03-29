/**
 * File Naming Configuration
 * Professional file naming conventions for exported photos
 */

export type NamingPattern = "date-index" | "date-time" | "custom-index" | "simple-index"

export interface FileNamingConfig {
  pattern: NamingPattern
  customPrefix?: string
  dateFormat?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MMDDYYYY"
  includeTime?: boolean
  startIndex?: number
}

interface NamingGeneratorOptions {
  config: FileNamingConfig
  photoIndex: number
  timestamp?: Date
}

/**
 * Format date according to the specified format
 */
function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`
    case "MMDDYYYY":
      return `${month}${day}${year}`
    default:
      return `${year}-${month}-${day}`
  }
}

/**
 * Format time as HH-MM-SS
 */
function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  return `${hours}-${minutes}-${seconds}`
}

/**
 * Generate a file name based on the configuration and index
 */
export function generateFileName(options: NamingGeneratorOptions): string {
  const { config, photoIndex, timestamp = new Date() } = options
  const startIndex = config.startIndex || 1
  const currentIndex = startIndex + photoIndex
  const paddedIndex = String(currentIndex).padStart(3, "0")

  switch (config.pattern) {
    case "date-index":
      return `${formatDate(timestamp, config.dateFormat || "YYYY-MM-DD")}-photo-${paddedIndex}`

    case "date-time":
      return `${formatDate(timestamp, config.dateFormat || "YYYY-MM-DD")}_${formatTime(timestamp)}`

    case "custom-index":
      return `${config.customPrefix || "photo"}-${paddedIndex}`

    case "simple-index":
      return `photo-${paddedIndex}`

    default:
      return `photo-${paddedIndex}`
  }
}

/**
 * Generate a preview of the naming pattern
 */
export function getFileNamingPreview(config: FileNamingConfig): string {
  const now = new Date()
  const example1 = generateFileName({ config, photoIndex: 0, timestamp: now })
  const example2 = generateFileName({ config, photoIndex: 1, timestamp: now })
  return `${example1}, ${example2}, ...`
}

/**
 * Get human-readable description of naming pattern
 */
export function getPatternDescription(pattern: NamingPattern): string {
  switch (pattern) {
    case "date-index":
      return "Date + photo number (best for batch work)"
    case "date-time":
      return "Date + time stamp (unique for each session)"
    case "custom-index":
      return "Custom prefix + number (fully customizable)"
    case "simple-index":
      return "Simple sequential numbers (compact)"
    default:
      return "File naming pattern"
  }
}

/**
 * Validate file naming configuration
 */
export function validateFileNamingConfig(config: FileNamingConfig): string | null {
  if (config.pattern === "custom-index" && !config.customPrefix?.trim()) {
    return "Custom prefix is required when using 'Custom Prefix' pattern"
  }

  if (config.startIndex !== undefined && config.startIndex < 0) {
    return "Start index must be 0 or greater"
  }

  return null
}
