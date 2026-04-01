"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Image as ImageIcon,
  Download,
  Trash2,
  X,
  Grid3X3,
  List,
  Search,
  CheckCircle2,
} from "lucide-react"
import {
  getRecentPhotos,
  removePhotoFromHistory,
  clearPhotoHistory,
  formatPhotoTime,
  type RecentPhoto,
} from "@/lib/photo-history"

interface DashboardPanelProps {
  onClose?: () => void
  onSelectPhoto?: (photo: RecentPhoto) => void
}

type ViewMode = "grid" | "list"

export function DashboardPanel({ onClose, onSelectPhoto }: DashboardPanelProps) {
  const [photos, setPhotos] = useState<RecentPhoto[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previewPhoto, setPreviewPhoto] = useState<RecentPhoto | null>(null)

  useEffect(() => {
    const loadPhotos = () => {
      const recentPhotos = getRecentPhotos()
      setPhotos(recentPhotos)
      setIsLoading(false)
    }
    loadPhotos()
  }, [])

  const toggleSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev)
      if (next.has(photoId)) {
        next.delete(photoId)
      } else {
        next.add(photoId)
      }
      return next
    })
  }

  const selectAll = () => {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set())
    } else {
      setSelectedPhotos(new Set(photos.map((p) => p.id)))
    }
  }

  const deleteSelected = () => {
    selectedPhotos.forEach((id) => {
      removePhotoFromHistory(id)
    })
    setPhotos((prev) => prev.filter((p) => !selectedPhotos.has(p.id)))
    setSelectedPhotos(new Set())
  }

  const deletePhoto = (photoId: string) => {
    removePhotoFromHistory(photoId)
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    setSelectedPhotos((prev) => {
      const next = new Set(prev)
      next.delete(photoId)
      return next
    })
  }

  const downloadPhoto = (photo: RecentPhoto) => {
    const link = document.createElement("a")
    link.href = photo.originalData
    link.download = `passport-photo-${new Date(photo.timestamp).toISOString().slice(0, 10)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadSelected = async () => {
    const selectedPhotosList = photos.filter((p) => selectedPhotos.has(p.id))

    if (selectedPhotosList.length === 1) {
      downloadPhoto(selectedPhotosList[0])
      return
    }

    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      selectedPhotosList.forEach((photo, index) => {
        const base64Data = photo.originalData.split(",")[1]
        const fileName = `passport-photo-${index + 1}.png`
        zip.file(fileName, base64Data, { base64: true })
      })

      const content = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(content)
      const link = document.createElement("a")
      link.href = url
      link.download = `passport-photos-${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      selectedPhotosList.forEach(downloadPhoto)
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Delete all photos? This cannot be undone.")) {
      clearPhotoHistory()
      setPhotos([])
      setSelectedPhotos(new Set())
    }
  }

  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery) return true
    const dateStr = new Date(photo.timestamp).toLocaleDateString()
    return dateStr.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalPhotos = photos.length
  const withBackground = photos.filter((p) => p.backgroundApplied).length

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#111827]">My Photos</h2>
          <span className="text-sm text-[#6b7280]">({totalPhotos})</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#F3F4F6]">
            <X className="h-5 w-5 text-[#6b7280]" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#FF5A36]/10 flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-[#FF5A36]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#111827]">{totalPhotos}</p>
            <p className="text-[10px] text-[#6b7280]">Total</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#111827]">{withBackground}</p>
            <p className="text-[10px] text-[#6b7280]">Processed</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 h-8 pl-8 pr-2 rounded-lg border border-[#E5E7EB] text-xs focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20"
            />
          </div>
          <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}>
              <Grid3X3 className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}>
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {selectedPhotos.size > 0 ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#6b7280] mr-1">{selectedPhotos.size}</span>
            <button onClick={downloadSelected} className="h-7 px-2 rounded-lg text-xs hover:bg-[#F3F4F6] flex items-center">
              <Download className="h-3.5 w-3.5" />
            </button>
            <button onClick={deleteSelected} className="h-7 px-2 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <button onClick={selectAll} className="text-[#FF5A36] hover:underline">Select all</button>
            <button onClick={handleClearAll} className="text-[#6b7280] hover:text-red-600">Clear</button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {!isLoading && filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[#F3F4F6] flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-[#9ca3af]" />
            </div>
            <h3 className="text-sm font-semibold text-[#111827] mb-1">No photos yet</h3>
            <p className="text-xs text-[#6b7280]">{searchQuery ? "No matches found." : "Create your first photo."}</p>
          </div>
        )}

        {filteredPhotos.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-3 gap-2">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]">
                <img src={photo.thumbnail} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => onSelectPhoto?.(photo) || setPreviewPhoto(photo)} />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelection(photo.id) }}
                  className={`absolute top-1.5 left-1.5 h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPhotos.has(photo.id) ? "bg-[#FF5A36] border-[#FF5A36]" : "bg-white/80 border-[#E5E7EB] opacity-0 group-hover:opacity-100"}`}
                >
                  {selectedPhotos.has(photo.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                </button>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }} className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Download className="h-4 w-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id) }} className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white truncate">{formatPhotoTime(photo.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPhotos.length > 0 && viewMode === "list" && (
          <div className="space-y-1.5">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="flex items-center gap-3 p-2 bg-[#F7F7F8] rounded-lg cursor-pointer" onClick={() => onSelectPhoto?.(photo) || setPreviewPhoto(photo)}>
                <button onClick={(e) => { e.stopPropagation(); toggleSelection(photo.id) }} className={`h-4 w-4 rounded border flex items-center justify-center ${selectedPhotos.has(photo.id) ? "bg-[#FF5A36] border-[#FF5A36]" : "border-[#E5E7EB]"}`}>
                  {selectedPhotos.has(photo.id) && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                </button>
                <img src={photo.thumbnail} alt="" className="h-10 w-8 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#111827]">Passport Photo</p>
                  <p className="text-[10px] text-[#6b7280]">{formatPhotoTime(photo.timestamp)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }} className="h-7 w-7 rounded flex items-center justify-center text-[#6b7280] hover:bg-[#E5E7EB]">
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deletePhoto(photo.id) }} className="h-7 w-7 rounded flex items-center justify-center text-[#6b7280] hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setPreviewPhoto(null)} className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white">
                <X className="h-4 w-4" />
              </button>
              <img src={previewPhoto.originalData} alt="Preview" className="w-full" />
              <div className="p-4 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Passport Photo</p>
                    <p className="text-xs text-[#6b7280]">{new Date(previewPhoto.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => downloadPhoto(previewPhoto)} className="flex-1 bg-[#FF5A36] hover:bg-[#e04e2d] text-white rounded-xl h-9 text-sm">
                    <Download className="h-4 w-4 mr-2" />Download
                  </Button>
                  <Button variant="outline" onClick={() => { deletePhoto(previewPhoto.id); setPreviewPhoto(null) }} className="rounded-xl h-9 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
