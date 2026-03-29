"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Printer, Award, Zap, Lightbulb } from "lucide-react"
import { PRINTER_PROFILES, getProfileById } from "@/lib/printer-profiles"
import type { PrinterProfile } from "@/lib/printer-profiles"

interface PrinterProfileSelectorProps {
  value?: string
  onValueChange?: (profileId: string) => void
}

const categoryIcons = {
  "inkjet": <Printer className="h-5 w-5" />,
  "laser": <Zap className="h-5 w-5" />,
  "dye-sub": <Award className="h-5 w-5" />,
}

const categoryLabels = {
  "inkjet": "Inkjet",
  "laser": "Laser",
  "dye-sub": "Dye-Sub",
}

export function PrinterProfileSelector({ value, onValueChange }: PrinterProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<PrinterProfile | null>(
    value ? getProfileById(value) || null : null,
  )

  const handleValueChange = (profileId: string) => {
    const profile = getProfileById(profileId)
    if (profile) {
      setSelectedProfile(profile)
      onValueChange?.(profileId)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#111827]">Printer Profile</p>
          <p className="text-xs text-[#6b7280]">Optimize output for your printer type</p>
        </div>
        <Select value={value || ""} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Select your printer..." />
          </SelectTrigger>
          <SelectContent>
            {/* Group by category */}
            {(["inkjet", "laser", "dye-sub"] as const).map((category) => {
              const categoryProfiles = PRINTER_PROFILES.filter((p) => p.category === category)
              if (categoryProfiles.length === 0) return null

              return (
                <div key={category}>
                  {/* Category header */}
                  <div className="py-1.5 px-2 text-xs font-bold uppercase text-[#6b7280] tracking-wider">
                    {categoryLabels[category]}
                  </div>

                  {/* Category items */}
                  {categoryProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      <div className="flex items-center gap-2">
                        <span>{profile.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Profile details card */}
      <AnimatePresence mode="wait">
        {selectedProfile && (
          <motion.div
            key={selectedProfile.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border border-[#E5E7EB] bg-[#FBFCFD] p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6b7280]">
                      {categoryIcons[selectedProfile.category]}
                    </span>
                    <h4 className="text-sm font-bold text-[#111827]">
                      {selectedProfile.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#6b7280]">
                    {selectedProfile.description}
                  </p>
                </div>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-2 gap-2">
                {/* DPI */}
                <div className="rounded-lg bg-white p-2.5 border border-[#E8EAEE]">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">DPI</p>
                  <p className="text-sm font-bold text-[#111827]">
                    {selectedProfile.recommendedDpi}
                  </p>
                </div>

                {/* Color Space */}
                <div className="rounded-lg bg-white p-2.5 border border-[#E8EAEE]">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Color Space</p>
                  <p className="text-sm font-bold text-[#111827] uppercase">
                    {selectedProfile.colorSpace}
                  </p>
                </div>
              </div>

              {/* Color space note */}
              <div className="text-xs text-[#6b7280] bg-white rounded-lg p-2.5 border border-[#E8EAEE]">
                <span className="font-semibold block mb-1">Recommended color space:</span>
                {selectedProfile.colorSpaceDescription}
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                  Capabilities
                </p>
                <ul className="space-y-1">
                  {selectedProfile.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#4B5563]">
                      <span className="text-[#FF5A36] font-bold mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special note */}
              {selectedProfile.maxMoisture && (
                <div className="text-xs text-[#D97706] bg-[#FEF3C7] rounded-lg p-2.5 border border-[#FCD34D]">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <Lightbulb className="h-4 w-4" />
                    <span>Handling tip:</span>
                  </div>
                  {selectedProfile.maxMoisture}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      {!selectedProfile && (
        <p className="text-xs text-[#9CA3AF] italic">
          Select your printer to optimize output quality and color space settings.
        </p>
      )}
    </div>
  )
}
