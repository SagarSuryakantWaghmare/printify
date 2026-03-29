/**
 * Photo History Storage
 * Manages recent photos for quick access
 */

export interface RecentPhoto {
  id: string
  thumbnail: string // base64 thumbnail
  originalData: string // base64 original
  timestamp: number
  backgroundApplied?: boolean
  bgColor?: "white" | "red" | "black"
}

const STORAGE_KEY = "printify_recent_photos"
const MAX_HISTORY = 20
const THUMBNAIL_SIZE = 80 // pixels

/**
 * Get all recent photos from storage
 */
export function getRecentPhotos(): RecentPhoto[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Add a photo to history
 */
export function addPhotoToHistory(photo: Omit<RecentPhoto, "id" | "timestamp">): RecentPhoto {
  const newPhoto: RecentPhoto = {
    ...photo,
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  }

  const photos = getRecentPhotos()
  photos.unshift(newPhoto)

  // Keep only recent photos
  const trimmed = photos.slice(0, MAX_HISTORY)

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch (e) {
      console.warn("Failed to save photo to history:", e)
    }
  }

  return newPhoto
}

/**
 * Remove a photo from history
 */
export function removePhotoFromHistory(photoId: string): void {
  const photos = getRecentPhotos()
  const filtered = photos.filter((p) => p.id !== photoId)

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (e) {
      console.warn("Failed to remove photo from history:", e)
    }
  }
}

/**
 * Clear all history
 */
export function clearPhotoHistory(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn("Failed to clear photo history:", e)
    }
  }
}

/**
 * Generate thumbnail from image data
 */
export async function generateThumbnail(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(imageData)
        return
      }

      canvas.width = THUMBNAIL_SIZE
      canvas.height = THUMBNAIL_SIZE

      const sourceAspect = img.width / img.height
      const targetAspect = 1

      if (sourceAspect > targetAspect) {
        const drawHeight = THUMBNAIL_SIZE
        const drawWidth = drawHeight * sourceAspect
        const offsetX = (canvas.width - drawWidth) / 2
        ctx.drawImage(img, offsetX, 0, drawWidth, drawHeight)
      } else {
        const drawWidth = THUMBNAIL_SIZE
        const drawHeight = drawWidth / sourceAspect
        const offsetY = (canvas.height - drawHeight) / 2
        ctx.drawImage(img, 0, offsetY, drawWidth, drawHeight)
      }

      resolve(canvas.toDataURL("image/jpeg", 0.6))
    }
    img.src = imageData
  })
}

/**
 * Format timestamp for display
 */
export function formatPhotoTime(timestamp: number): string {
  const now = new Date()
  const photo = new Date(timestamp)

  const diffMs = now.getTime() - photo.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return photo.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
