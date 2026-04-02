"use client"

import { useState, useCallback, useRef } from "react"

// Types defined locally to avoid any SSR import chain issues
export interface BatchProcessItem {
  id: string
  imageData: string
}

export interface BatchProcessResult {
  id: string
  success: boolean
  result?: string
  error?: string
}

export interface BatchItem {
  id: string
  fileName: string
  photoData: string
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
  result?: string
  progress?: number
}

// Processor type - defined inline to avoid import
interface BatchProcessor {
  processBatch: (
    items: BatchProcessItem[],
    callbacks?: {
      onItemStart?: (id: string) => void
      onItemProgress?: (id: string, progress: number) => void
      onItemComplete?: (result: BatchProcessResult) => void
      onBatchProgress?: (completed: number, total: number) => void
    }
  ) => Promise<BatchProcessResult[]>
  pause: () => void
  resume: () => void
  cancel: () => void
  reset: () => void
  isPaused: boolean
  isCancelled: boolean
}

export interface BatchQueueContextType {
  items: BatchItem[]
  addItems: (items: Array<{ fileName: string; photoData: string }>) => void
  updateItemStatus: (id: string, status: BatchItem["status"], error?: string) => void
  updateItemProgress: (id: string, progress: number) => void
  setItemResult: (id: string, result: string) => void
  removeItem: (id: string) => void
  clearCompleted: () => void
  clearAll: () => void
  processQueue: () => Promise<void>
  downloadAll: () => Promise<void>
  pauseProcessing: () => void
  resumeProcessing: () => void
  cancelProcessing: () => void
  isProcessing: boolean
  isPaused: boolean
  completedCount: number
  failedCount: number
  pendingCount: number
}

export function useBatchQueue(): BatchQueueContextType {
  const [items, setItems] = useState<BatchItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const processorRef = useRef<BatchProcessor | null>(null)

  const addItems = useCallback((newItems: Array<{ fileName: string; photoData: string }>) => {
    setItems((prev) => [
      ...prev,
      ...newItems.map((item) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fileName: item.fileName,
        photoData: item.photoData,
        status: "pending" as const,
        progress: 0,
      })),
    ])
  }, [])

  const updateItemStatus = useCallback((id: string, status: BatchItem["status"], error?: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, error, progress: status === "completed" ? 100 : item.progress }
          : item
      )
    )
  }, [])

  const updateItemProgress = useCallback((id: string, progress: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, progress: Math.min(100, progress) } : item))
    )
  }, [])

  const setItemResult = useCallback((id: string, result: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, result, status: "completed" } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== "completed"))
  }, [])

  const clearAll = useCallback(() => {
    processorRef.current?.cancel()
    setItems([])
    setIsProcessing(false)
    setIsPaused(false)
    processorRef.current?.reset()
  }, [])

  // Process entire queue using optimized batch processor
  const processQueue = useCallback(async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    // Lazy load processor only when needed (client-side)
    if (!processorRef.current) {
      const { createBatchProcessor } = await import("@/lib/batch-processor")
      processorRef.current = createBatchProcessor(2)
    }
    processorRef.current.reset()

    // Get pending items
    const pendingItems = items.filter((i) => i.status === "pending")
    const batchItems: BatchProcessItem[] = pendingItems.map((item) => ({
      id: item.id,
      imageData: item.photoData,
    }))

    await processorRef.current.processBatch(batchItems, {
      onItemStart: (id) => {
        updateItemStatus(id, "processing")
      },
      onItemProgress: (id, progress) => {
        updateItemProgress(id, progress)
      },
      onItemComplete: (result) => {
        if (result.success && result.result) {
          setItemResult(result.id, result.result)
        } else {
          updateItemStatus(result.id, "failed", result.error)
        }
      },
    })

    setIsProcessing(false)
    setIsPaused(false)
  }, [items, isProcessing, updateItemStatus, updateItemProgress, setItemResult])

  // Pause processing
  const pauseProcessing = useCallback(() => {
    processorRef.current?.pause()
    setIsPaused(true)
  }, [])

  // Resume processing
  const resumeProcessing = useCallback(() => {
    processorRef.current?.resume()
    setIsPaused(false)
  }, [])

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    processorRef.current?.cancel()
    setIsProcessing(false)
    setIsPaused(false)
    // Reset pending items that haven't started
    setItems((prev) =>
      prev.map((item) =>
        item.status === "pending" ? item : item
      )
    )
  }, [])

  // Download all completed items as ZIP
  const downloadAll = useCallback(async () => {
    const completedItems = items.filter((i) => i.status === "completed" && i.result)
    if (completedItems.length === 0) return

    try {
      const JSZip = (await import("jszip")).default as unknown
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const zip = new (JSZip as any)()

      completedItems.forEach((item) => {
        if (item.result) {
          const base64Data = item.result.split(",")[1]
          const fileName = item.fileName.replace(/\.[^/.]+$/, "") + "_processed.png"
          zip.file(fileName, base64Data, { base64: true })
        }
      })

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = `printfy_batch_${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: download each file individually
      completedItems.forEach((item) => {
        if (item.result) {
          const a = document.createElement("a")
          a.href = item.result
          a.download = item.fileName.replace(/\.[^/.]+$/, "") + "_processed.png"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    }
  }, [items])

  const completedCount = items.filter((item) => item.status === "completed").length
  const failedCount = items.filter((item) => item.status === "failed").length
  const pendingCount = items.filter((item) => item.status === "pending").length

  return {
    items,
    addItems,
    updateItemStatus,
    updateItemProgress,
    setItemResult,
    removeItem,
    clearCompleted,
    clearAll,
    processQueue,
    downloadAll,
    pauseProcessing,
    resumeProcessing,
    cancelProcessing,
    isProcessing,
    isPaused,
    completedCount,
    failedCount,
    pendingCount,
  }
}
