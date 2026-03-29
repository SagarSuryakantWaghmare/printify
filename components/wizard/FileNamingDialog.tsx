"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Check, FileText, AlertCircle, Calendar, Clock, Hash, Lightbulb } from "lucide-react"
import {
  FileNamingConfig,
  NamingPattern,
  getFileNamingPreview,
  getPatternDescription,
  validateFileNamingConfig,
} from "@/lib/file-naming"
import { EditIcon } from "@/components/ui/icons"

interface FileNamingDialogProps {
  value?: FileNamingConfig
  onChange?: (config: FileNamingConfig) => void
}

const PATTERNS: Array<{
  id: NamingPattern
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  {
    id: "date-index",
    label: "Date + Number",
    icon: Calendar,
    description: "YYYY-MM-DD_001, YYYY-MM-DD_002",
  },
  {
    id: "date-time",
    label: "Date + Time",
    icon: Clock,
    description: "YYYY-MM-DD_HH-MM-SS (unique per shot)",
  },
  {
    id: "custom-index",
    label: "Custom Prefix",
    icon: EditIcon,
    description: "MyPhotos_001, MyPhotos_002",
  },
  {
    id: "simple-index",
    label: "Simple Count",
    icon: Hash,
    description: "photo_001, photo_002",
  },
]

export function FileNamingDialog({ value, onChange }: FileNamingDialogProps) {
  const [config, setConfig] = useState<FileNamingConfig>(
    value || {
      pattern: "date-index",
      dateFormat: "YYYY-MM-DD",
      customPrefix: "photo",
      startIndex: 1,
    },
  )

  const [validationError, setValidationError] = useState<string | null>(null)

  const handlePatternChange = (pattern: NamingPattern) => {
    const newConfig = { ...config, pattern }
    const error = validateFileNamingConfig(newConfig)
    setValidationError(error)
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const handlePrefixChange = (prefix: string) => {
    const newConfig = { ...config, customPrefix: prefix }
    const error = validateFileNamingConfig(newConfig)
    setValidationError(error)
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const handleDateFormatChange = (format: "YYYY-MM-DD" | "DD-MM-YYYY" | "MMDDYYYY") => {
    const newConfig = { ...config, dateFormat: format }
    const error = validateFileNamingConfig(newConfig)
    setValidationError(error)
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const handleStartIndexChange = (index: string) => {
    const newConfig = { ...config, startIndex: Math.max(0, parseInt(index) || 1) }
    const error = validateFileNamingConfig(newConfig)
    setValidationError(error)
    setConfig(newConfig)
    onChange?.(newConfig)
  }

  const preview = getFileNamingPreview(config)

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-[#111827] mb-3">Naming Pattern</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PATTERNS.map((pattern) => (
            <motion.button
              key={pattern.id}
              onClick={() => handlePatternChange(pattern.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border-2 p-3 text-left relative transition-all ${
                config.pattern === pattern.id
                  ? "border-[#FF5A36] bg-[#FFF5F0] shadow-sm"
                  : "border-[#E5E7EB] hover:border-[#FF5A36]/40 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-[#FF5A36]/10 to-[#FF5A36]/5">
                      <pattern.icon className="h-4 w-4 text-[#FF5A36]" />
                    </div>
                    <span className="font-semibold text-sm text-[#111827]">{pattern.label}</span>
                  </div>
                  <p className="text-xs text-[#6b7280]">{pattern.description}</p>
                </div>
                {config.pattern === pattern.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2"
                  >
                    <Check className="h-5 w-5 text-[#FF5A36]" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pattern-specific options */}
      <AnimatePresence mode="wait">
        {(config.pattern === "date-index" || config.pattern === "date-time") && (
          <motion.div
            key="date-format"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div>
              <p className="text-sm font-semibold text-[#111827] mb-2">Date Format</p>
              <Tabs value={config.dateFormat || "YYYY-MM-DD"} onValueChange={(v) => handleDateFormatChange(v as "YYYY-MM-DD" | "DD-MM-YYYY" | "MMDDYYYY")}>
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-[#F8F9FA] p-1">
                  <TabsTrigger value="YYYY-MM-DD" className="rounded-lg py-2 text-xs font-semibold">
                    YYYY-MM-DD
                  </TabsTrigger>
                  <TabsTrigger value="DD-MM-YYYY" className="rounded-lg py-2 text-xs font-semibold">
                    DD-MM-YYYY
                  </TabsTrigger>
                  <TabsTrigger value="MMDDYYYY" className="rounded-lg py-2 text-xs font-semibold">
                    MMDDYYYY
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>
        )}

        {config.pattern === "custom-index" && (
          <motion.div
            key="custom-prefix"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div>
              <p className="text-sm font-semibold text-[#111827] mb-2">Custom Prefix</p>
              <Input
                type="text"
                value={config.customPrefix || ""}
                onChange={(e) => handlePrefixChange(e.target.value)}
                placeholder="e.g., passport, portrait, event-2024"
                className="rounded-xl border-[#E5E7EB] px-3.5 py-2.5 text-sm focus:border-[#FF5A36] focus:ring-[#FF5A36]"
                maxLength={30}
              />
              <p className="text-xs text-[#6b7280] mt-2">
                Alphanumeric and hyphens only (e.g., {config.customPrefix}-001)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start index */}
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-2">Start Index</p>
        <Input
          type="number"
          min="0"
          max="9999"
          value={config.startIndex || 1}
          onChange={(e) => handleStartIndexChange(e.target.value)}
          className="rounded-xl border-[#E5E7EB] px-3.5 py-2.5 text-sm focus:border-[#FF5A36] focus:ring-[#FF5A36]"
        />
        <p className="text-xs text-[#6b7280] mt-2">First file will be numbered {config.startIndex || 1}</p>
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{validationError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <Card className="border border-[#E5E7EB] bg-[#FBFCFD] p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-[#FF5A36] mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-2">
              File Name Preview
            </p>
            <p className="text-sm font-mono text-[#1a1a1a] break-all">{preview}.jpg</p>
            <p className="text-xs text-[#6b7280] mt-2">
              {getPatternDescription(config.pattern)}
            </p>
          </div>
        </div>
      </Card>

      {/* Suggestion */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
        <p className="text-xs text-blue-900 flex items-start gap-2">
          <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
          <span>
            <span className="font-semibold">Tip:</span> Use &quot;Date + Number&quot; for batch shoots,
            or &quot;Custom Prefix&quot; for organized collections.
          </span>
        </p>
      </div>
    </div>
  )
}
