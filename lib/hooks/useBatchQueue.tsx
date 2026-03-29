"use client"

import { useState, useCallback } from "react"

export interface BatchItem {
  id: string
  fileName: string
  photoData: string
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
  result?: string
  progress?: number
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
  isProcessing: boolean
  completedCount: number
  failedCount: number
}

export function useBatchQueue(): BatchQueueContextType {
  const [items, setItems] = useState<BatchItem[]>([])

  const addItems = useCallback((newItems: Array<{ fileName: string; photoData: string }>) => {
    setItems((prev) => [
      ...prev,
      ...newItems.map((item) => ({
        id: Date.now() + Math.random().toString(),
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
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, result } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== "completed"))
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  const isProcessing = items.some((item) => item.status === "processing" || item.status === "pending")
  const completedCount = items.filter((item) => item.status === "completed").length
  const failedCount = items.filter((item) => item.status === "failed").length

  return {
    items,
    addItems,
    updateItemStatus,
    updateItemProgress,
    setItemResult,
    removeItem,
    clearCompleted,
    clearAll,
    isProcessing,
    completedCount,
    failedCount,
  }
}
