"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Clock, Zap, Download, X, Play, Archive, RefreshCw, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BatchItem } from "@/lib/hooks/useBatchQueue"

interface BatchQueuePanelProps {
  items: BatchItem[]
  onRemove: (id: string) => void
  onClearCompleted: () => void
  onClearAll: () => void
  onProcessQueue?: () => Promise<void>
  onDownloadAll?: () => Promise<void>
  onPause?: () => void
  onResume?: () => void
  onCancel?: () => void
  isProcessing?: boolean
  isPaused?: boolean
}

export function BatchQueuePanel({
  items,
  onRemove,
  onClearCompleted,
  onClearAll,
  onProcessQueue,
  onDownloadAll,
  onPause,
  onResume,
  onCancel,
  isProcessing = false,
  isPaused = false,
}: BatchQueuePanelProps) {
  if (items.length === 0) return null

  const completedCount = items.filter((i) => i.status === "completed").length
  const failedCount = items.filter((i) => i.status === "failed").length
  const processingCount = items.filter((i) => i.status === "processing").length
  const pendingCount = items.filter((i) => i.status === "pending").length
  const totalProgress = items.reduce((acc, i) => acc + (i.progress ?? 0), 0) / items.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#111827]">Batch Queue ({items.length})</h3>
        <button
          onClick={onClearAll}
          className="text-[#6b7280] hover:text-[#1a1a1a] transition-colors p-1"
          title="Clear all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Overall progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6b7280]">
            <span>{isPaused ? "Paused" : "Processing..."}</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${isPaused ? "bg-[#6b7280]" : "bg-gradient-to-r from-[#FF5A36] to-[#FF8C6B]"}`}
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs flex-wrap">
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

      {/* Items list */}
      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
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
                <p className="text-xs font-semibold text-[#111827] truncate flex-1">{item.fileName}</p>
                {item.status === "completed" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="h-4 w-4 text-[#1D9E75] shrink-0" />
                  </motion.div>
                )}
                {item.status === "failed" && (
                  <AlertCircle className="h-4 w-4 text-[#EF4444] shrink-0" />
                )}
                {item.status === "processing" && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RefreshCw className="h-4 w-4 text-[#FF5A36] shrink-0" />
                  </motion.div>
                )}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#9ca3af] hover:text-[#EF4444] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
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
                  {item.status === "pending" ? "Waiting…" : item.status === "processing" ? `${item.progress ?? 0}%` : item.status}
                </span>
                {item.status === "failed" && item.error && (
                  <span className="text-[10px] text-[#EF4444] text-right max-w-[120px] line-clamp-1">
                    {item.error}
                  </span>
                )}
                {item.status === "completed" && item.result && (
                  <a
                    href={item.result}
                    download={item.fileName.replace(/\.[^/.]+$/, "") + "_processed.png"}
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

      {/* Actions */}
      <div className="flex gap-2">
        {/* Start/Pause/Resume button */}
        {pendingCount > 0 && onProcessQueue && !isProcessing && (
          <Button
            onClick={onProcessQueue}
            className="flex-1 bg-[#FF5A36] hover:bg-[#e04e2d] text-white rounded-xl h-10"
          >
            <Play className="h-4 w-4 mr-2" />
            Process All ({pendingCount})
          </Button>
        )}
        
        {isProcessing && !isPaused && onPause && (
          <Button
            onClick={onPause}
            variant="outline"
            className="flex-1 border-[#E5E7EB] rounded-xl h-10"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        
        {isProcessing && isPaused && onResume && (
          <Button
            onClick={onResume}
            className="flex-1 bg-[#FF5A36] hover:bg-[#e04e2d] text-white rounded-xl h-10"
          >
            <Play className="h-4 w-4 mr-2" />
            Resume
          </Button>
        )}
        
        {isProcessing && onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl h-10 px-3"
          >
            <Square className="h-4 w-4" />
          </Button>
        )}

        {completedCount > 0 && onDownloadAll && (
          <Button
            onClick={onDownloadAll}
            variant="outline"
            className="flex-1 border-[#E5E7EB] rounded-xl h-10"
          >
            <Archive className="h-4 w-4 mr-2" />
            Download All ({completedCount})
          </Button>
        )}
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="w-full text-xs font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors py-2"
        >
          Clear completed items
        </button>
      )}
    </motion.div>
  )
}
