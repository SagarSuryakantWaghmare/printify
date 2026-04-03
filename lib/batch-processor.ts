/**
 * Batch Processing Utilities (Client-Only)
 * 
 * This module MUST only be imported dynamically in client components.
 * It uses remove.bg API for background removal.
 */

// Configuration
// No local config needed for API-based removal

// Maximum concurrent processing tasks
const DEFAULT_CONCURRENCY = 2

// Processing state
interface ProcessingState {
  isPaused: boolean
  isCancelled: boolean
}

/**
 * Convert base64 string to Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(",")
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg"
  const base64Data = parts[1]

  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mime })
}

/**
 * Convert Blob to base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read blob"))
    reader.readAsDataURL(blob)
  })
}

/**
 * Process a single image with background removal
 */
export async function processImage(
  imageData: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Use API for background removal
  const response = await fetch("/api/remove-bg", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageDataUrl: imageData })
  })
  const data = await response.json()
  if (data.resultDataUrl) {
    return data.resultDataUrl
  } else {
    throw new Error(data.error || "Background removal failed")
  }
}

/**
 * Batch item interface
 */
export interface BatchProcessItem {
  id: string
  imageData: string
}

/**
 * Process result
 */
export interface BatchProcessResult {
  id: string
  success: boolean
  result?: string
  error?: string
}

/**
 * Callbacks for batch processing
 */
export interface BatchProcessCallbacks {
  onItemStart?: (id: string) => void
  onItemProgress?: (id: string, progress: number) => void
  onItemComplete?: (result: BatchProcessResult) => void
  onBatchProgress?: (completed: number, total: number) => void
}

/**
 * Create a batch processor with pause/resume/cancel support
 */
export function createBatchProcessor(concurrency: number = DEFAULT_CONCURRENCY) {
  const state: ProcessingState = {
    isPaused: false,
    isCancelled: false,
  }

  /**
   * Process items in batches with concurrency limit
   */
  async function processBatch(
    items: BatchProcessItem[],
    callbacks?: BatchProcessCallbacks
  ): Promise<BatchProcessResult[]> {
    const results: BatchProcessResult[] = []
    let completedCount = 0

    // Split into chunks for concurrent processing
    const chunks: BatchProcessItem[][] = []
    for (let i = 0; i < items.length; i += concurrency) {
      chunks.push(items.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      // Check for cancellation
      if (state.isCancelled) {
        break
      }

      // Wait while paused
      while (state.isPaused && !state.isCancelled) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Process chunk in parallel
      const chunkResults = await Promise.all(
        chunk.map(async (item) => {
          callbacks?.onItemStart?.(item.id)

          try {
            const result = await processImage(item.imageData, (progress) => {
              callbacks?.onItemProgress?.(item.id, progress)
            })

            const processResult: BatchProcessResult = {
              id: item.id,
              success: true,
              result,
            }
            callbacks?.onItemComplete?.(processResult)
            return processResult
          } catch (error) {
            const processResult: BatchProcessResult = {
              id: item.id,
              success: false,
              error: error instanceof Error ? error.message : "Processing failed",
            }
            callbacks?.onItemComplete?.(processResult)
            return processResult
          }
        })
      )

      results.push(...chunkResults)
      completedCount += chunkResults.length
      callbacks?.onBatchProgress?.(completedCount, items.length)
    }

    return results
  }

  return {
    processBatch,
    pause: () => {
      state.isPaused = true
    },
    resume: () => {
      state.isPaused = false
    },
    cancel: () => {
      state.isCancelled = true
    },
    get isPaused() {
      return state.isPaused
    },
    get isCancelled() {
      return state.isCancelled
    },
    reset: () => {
      state.isPaused = false
      state.isCancelled = false
    },
  }
}

/**
 * Simple parallel processing without pause/resume
 * Use this for fire-and-forget batch processing
 */
export async function processInParallel(
  items: BatchProcessItem[],
  concurrency: number = DEFAULT_CONCURRENCY,
  callbacks?: BatchProcessCallbacks
): Promise<BatchProcessResult[]> {
  const processor = createBatchProcessor(concurrency)
  return processor.processBatch(items, callbacks)
}

/**
 * Estimate memory usage for a batch
 * Returns estimated MB needed
 */
export function estimateMemoryUsage(items: BatchProcessItem[]): number {
  let totalBytes = 0
  for (const item of items) {
    // Base64 is ~33% larger than binary
    const base64Length = item.imageData.length
    const binarySize = (base64Length * 3) / 4
    // Processing typically needs ~3x the image size in memory
    totalBytes += binarySize * 3
  }
  return totalBytes / (1024 * 1024)
}

/**
 * Recommend concurrency based on estimated memory and item count
 */
export function recommendConcurrency(items: BatchProcessItem[]): number {
  const estimatedMB = estimateMemoryUsage(items)
  const itemCount = items.length

  // Conservative memory limit (assume 2GB available)
  const availableMemoryMB = 2048
  const maxConcurrentByMemory = Math.floor(availableMemoryMB / (estimatedMB / itemCount))

  // Limit concurrency based on item count
  const maxConcurrentByCount = Math.min(4, itemCount)

  // Use the more conservative limit
  return Math.max(1, Math.min(maxConcurrentByMemory, maxConcurrentByCount, DEFAULT_CONCURRENCY))
}
