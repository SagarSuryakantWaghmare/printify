"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getRecentPhotos,
  addPhotoToHistory,
  removePhotoFromHistory,
  clearPhotoHistory,
  generateThumbnail,
  type RecentPhoto,
} from "@/lib/photo-history"

export function usePhotoHistory() {
  const [photos, setPhotos] = useState<RecentPhoto[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load photos on mount
  useEffect(() => {
    const stored = getRecentPhotos()
    setPhotos(stored)
  }, [])

  const addPhoto = useCallback(
    async (imageData: string, backgroundApplied?: boolean, bgColor?: "white" | "red" | "black") => {
      setIsLoading(true)
      try {
        const thumbnail = await generateThumbnail(imageData)
        const newPhoto = addPhotoToHistory({
          thumbnail,
          originalData: imageData,
          backgroundApplied,
          bgColor,
        })
        setPhotos((prev) => [newPhoto, ...prev])
        return newPhoto
      } catch (error) {
        console.error("Failed to add photo to history:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const removePhoto = useCallback((photoId: string) => {
    removePhotoFromHistory(photoId)
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }, [])

  const clearHistory = useCallback(() => {
    clearPhotoHistory()
    setPhotos([])
  }, [])

  return {
    photos,
    addPhoto,
    removePhoto,
    clearHistory,
    isLoading,
  }
}
