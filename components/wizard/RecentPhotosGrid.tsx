"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Clock } from "lucide-react"
import { formatPhotoTime, type RecentPhoto } from "@/lib/photo-history"

interface RecentPhotosGridProps {
  photos: RecentPhoto[]
  onSelectPhoto?: (photo: RecentPhoto) => void
  onRemovePhoto?: (photoId: string) => void
  onClearHistory?: () => void
}

export function RecentPhotosGrid({
  photos,
  onSelectPhoto,
  onRemovePhoto,
  onClearHistory,
}: RecentPhotosGridProps) {
  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-6 py-8 text-center">
        <Clock className="h-8 w-8 text-[#D1D5DB] mx-auto mb-2" />
        <p className="text-sm text-[#6b7280] font-medium">No recent photos yet</p>
        <p className="text-xs text-[#9CA3AF] mt-1">Your history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#FF5A36]" />
          <h3 className="text-sm font-bold text-[#111827]">Recent Photos ({photos.length})</h3>
        </div>
        {photos.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearHistory}
            className="text-xs font-semibold text-[#6b7280] hover:text-red-600 transition-colors"
          >
            Clear
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: idx * 0.04 }}
              className="relative group"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectPhoto?.(photo)}
                className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-[#E5E7EB] hover:border-[#FF5A36] transition-colors bg-white shadow-sm hover:shadow-md"
              >
                <Image
                  src={photo.thumbnail}
                  alt="Recent photo"
                  fill
                  className="object-cover"
                  sizes="100px"
                />
                {photo.backgroundApplied && (
                  <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#1D9E75]" title="BG applied" />
                )}
              </motion.button>

              {/* Info tooltip */}
              <motion.div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-xs text-[#6b7280] text-center whitespace-nowrap">
                  {formatPhotoTime(photo.timestamp)}
                </p>
              </motion.div>

              {/* Delete button */}
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemovePhoto?.(photo.id)
                }}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600">
                  <X className="h-3 w-3" />
                </div>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-[#9CA3AF] text-center">
        Click a photo to load it, hover for options
      </p>
    </div>
  )
}
