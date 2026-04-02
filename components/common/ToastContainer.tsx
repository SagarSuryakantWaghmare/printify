"use client"

import { useToast, type ToastType } from "@/lib/hooks/useToast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-[#10B981]" />,
  error: <AlertCircle className="h-5 w-5 text-[#EF4444]" />,
  info: <Info className="h-5 w-5 text-[#3B82F6]" />,
  warning: <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />,
}

const BG_MAP: Record<ToastType, string> = {
  success: "bg-[#ECFDF5] border-[#D1FAE5]",
  error: "bg-[#FEF2F2] border-[#FECACA]",
  info: "bg-[#EFF6FF] border-[#BFDBFE]",
  warning: "bg-[#FFFBEB] border-[#FED7AA]",
}

const TEXT_MAP: Record<ToastType, string> = {
  success: "text-[#065F46]",
  error: "text-[#991B1B]",
  info: "text-[#1E3A8A]",
  warning: "text-[#92400E]",
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex items-start gap-3 rounded-xl border p-4 ${BG_MAP[toast.type]} pointer-events-auto`}
          >
            <div className="shrink-0 pt-0.5">{ICON_MAP[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${TEXT_MAP[toast.type]}`}>
                {toast.message}
              </p>
            </div>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick()
                  removeToast(toast.id)
                }}
                className={`text-xs font-semibold whitespace-nowrap hover:underline ${TEXT_MAP[toast.type]}`}
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              className={`shrink-0 text-[#6B7280] hover:text-[#111827]`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
