"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Clock, Zap, Trash2, Download, X } from "lucide-react"
import type { BatchItem } from "@/lib/hooks/useBatchQueue"

interface BatchQueuePanelProps {
  items: BatchItem[]
  onRemove: (id: string) => void
  onClearCompleted: () => void
  onClearAll: () => void
}

export function BatchQueuePanel({
  items,
  onRemove,
  onClearCompleted,
  onClearAll,
}: BatchQueuePanelProps) {
  if (items.length === 0) return null

  const completedCount = items.filter((i) => i.status === "completed").length
  const failedCount = items.filter((i) => i.status === "failed").length
  const processingCount = items.filter((i) => i.status === "processing").length
  const pendingCount = items.filter((i) => i.status === "pending").length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 max-h-96 overflow-hidden flex flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-[#E5E7EB] p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#111827]">Processing Queue</h3>
          <button
            onClick={onClearAll}
            className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
            title="Close queue"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          {completedCount > 0 && (
            <div className="flex items-center gap-1 text-[#1D9E75]">
              <Check className="h-3.5 w-3.5" />
              <span>{completedCount} done</span>
            </div>
          )}
          {processingCount > 0 && (
            <div className="flex items-center gap-1 text-[#FF5A36]">
              <Zap className="h-3.5 w-3.5 animate-pulse" />
              <span>{processingCount} processing</span>
            </div>
          )}
          {pendingCount > 0 && (
            <div className="flex items-center gap-1 text-[#6b7280]">
              <Clock className="h-3.5 w-3.5" />
              <span>{pendingCount} pending</span>
            </div>
          )}
          {failedCount > 0 && (
            <div className="flex items-center gap-1 text-[#EF4444]">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{failedCount} failed</span>
            </div>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] p-3"
            >
              {/* File name */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-[#111827] truncate">{item.fileName}</p>
                {item.status === "completed" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="h-4 w-4 text-[#1D9E75] shrink-0" />
                  </motion.div>
                )}
                {item.status === "failed" && (
                  <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                )}
                {item.status === "processing" && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                    <Zap className="h-4 w-4 text-[#FF5A36] shrink-0" />
                  </motion.div>
                )}
              </div>

              {/* Progress bar */}
              {(item.status === "processing" || item.status === "pending") && (
                <div className="mb-2 h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B]"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress ?? 0}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}

              {/* Status text */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-[#6b7280] capitalize">
                  {item.status === "pending" ? "Waiting…" : item.status === "processing" ? "Processing…" : item.status}
                </span>
                {item.status === "failed" && item.error && (
                  <span className="text-[10px] text-[#EF4444] text-right max-w-[120px] line-clamp-1">
                    {item.error}
                  </span>
                )}
                {item.status === "completed" && item.result && (
                  <a
                    href={item.result}
                    download
                    className="text-[10px] font-semibold text-[#FF5A36] hover:underline flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {completedCount > 0 && (
        <div className="border-t border-[#E5E7EB] flex gap-2 p-3">
          <button
            onClick={onClearCompleted}
            className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6b7280] hover:bg-[#F7F7F8] transition-colors"
          >
            Clear Done
          </button>
        </div>
      )}
    </motion.div>
  )
}
