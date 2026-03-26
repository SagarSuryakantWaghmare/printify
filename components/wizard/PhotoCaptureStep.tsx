"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Camera, Upload, Sun, UserRound, Ban, Smile, Star } from "lucide-react"

const TIPS = [
  { icon: Sun, text: "Even, bright lighting" },
  { icon: UserRound, text: "Face centred, forward-looking" },
  { icon: Ban, text: "No cap or tinted glasses" },
  { icon: Smile, text: "Neutral expression, mouth closed" },
]

const SIZE_PRESETS = [
  { value: "passport", label: "Passport", size: "35 × 45 mm", badge: "India Standard" },
  { value: "stamp", label: "Stamp", size: "25 × 35 mm", badge: null },
  { value: "custom", label: "Custom", size: "Set manually", badge: null },
] as const

const COUNT_OPTIONS = [6, 8, 12] as const

export function PhotoCaptureStep() {
  const { photoSpec, setPhotoSpec, setPhotoData, nextStep } = useWizard()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setPhotoData({ original: result })
      // Simulated face detection (real impl would use TensorFlow.js or API)
      setTimeout(() => setFaceDetected(true), 1200)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) handleFileUpload(file)
  }

  const proceedToProcessing = () => {
    if (uploadedImage) nextStep()
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a]">
          Upload Your Photo
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          Choose a clear, front-facing portrait — our AI handles the rest
        </p>
      </motion.div>

      {/* Size & Count selectors */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 md:p-6 space-y-6">
        {/* Size preset */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">Photo size</p>
          <Tabs
            value={photoSpec.preset}
            onValueChange={(v) => setPhotoSpec({ preset: v as typeof photoSpec.preset })}
          >
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-[#F7F7F8] p-1 gap-1">
              {SIZE_PRESETS.map((preset) => (
                <TabsTrigger
                  key={preset.value}
                  value={preset.value}
                  className="relative rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="font-semibold">{preset.label}</span>
                    <span className="text-[10px] text-[#6b7280]">{preset.size}</span>
                    {preset.badge && (
                      <span className="text-[9px] font-bold text-[#FF5A36] flex items-center gap-0.5">
                        <Star className="h-2 w-2 fill-current" />
                        {preset.badge}
                      </span>
                    )}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {photoSpec.preset === "passport" && (
            <p className="text-xs text-[#1D9E75] font-semibold px-1">
              ✓ Standard Indian Passport — 35×45 mm, white background, face-cropped by AI
            </p>
          )}
        </div>

        {photoSpec.preset === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customWidth">Width (mm)</Label>
              <Input
                id="customWidth"
                type="number"
                min={10}
                max={100}
                value={photoSpec.customWidthMm}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isFinite(v) && v > 0) setPhotoSpec({ customWidthMm: v })
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customHeight">Height (mm)</Label>
              <Input
                id="customHeight"
                type="number"
                min={10}
                max={100}
                value={photoSpec.customHeightMm}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (Number.isFinite(v) && v > 0) setPhotoSpec({ customHeightMm: v })
                }}
              />
            </div>
          </div>
        )}

        {/* Count selector */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">Number of photos on sheet</p>
          <Tabs
            value={String(photoSpec.count)}
            onValueChange={(v) => setPhotoSpec({ count: Number(v) as 6 | 8 | 12 })}
          >
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-[#F7F7F8] p-1 gap-1">
              {COUNT_OPTIONS.map((count) => (
                <TabsTrigger
                  key={count}
                  value={String(count)}
                  className="rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {count} Photos
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Upload area */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              <motion.div
                key="upload-ui"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Desktop drag-drop */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative hidden md:flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                      ? "border-[#FF5A36] bg-[#ffe7df] scale-[1.01]"
                      : "border-[#FF5A36]/60 bg-[#fff5f0] hover:border-[#FF5A36] hover:bg-[#ffeae0] hover:scale-[1.005]"
                    }`}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.12),transparent_50%)]" />
                  <motion.div
                    animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Camera className="w-16 h-16 text-[#FF5A36] mb-4" />
                  </motion.div>
                  <p className="text-lg font-semibold text-[#1a1a1a] mb-1">
                    {isDragging ? "Drop it here!" : "Drag photo here"}
                  </p>
                  <p className="text-sm text-[#6b7280]">or click to browse</p>
                  <p className="mt-2 text-xs font-semibold text-[#9ca3af]">JPG, PNG — up to 10 MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFileUpload(f)
                    }}
                  />
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  <div className="aspect-[35/45] max-h-72 w-full rounded-3xl bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-[#6b7280] mx-auto mb-2" />
                      <p className="text-sm text-[#6b7280]">Upload your photo below</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => mobileInputRef.current?.click()}
                    className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-5 text-base font-semibold h-auto"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take or Upload Photo
                  </Button>
                  <input
                    ref={mobileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFileUpload(f)
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="relative rounded-3xl overflow-hidden bg-[#F7F7F8] aspect-[35/45] max-h-96">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
                  {faceDetected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#1D9E75]" />
                      <span className="text-sm font-semibold text-[#1D9E75]">Face detected</span>
                    </motion.div>
                  )}
                </div>

                <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-sm text-[#4b5563]">
                  ✓ Looking good! AI will remove the background, enhance lighting, and crop to passport spec.
                </div>

                <Button
                  onClick={() => { setUploadedImage(null); setFaceDetected(false) }}
                  variant="outline"
                  className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-xl py-3 font-semibold hover:bg-[#F7F7F8]"
                >
                  Change Photo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[#1a1a1a]">Tips for Best Results</h3>
          <ScrollArea className="md:hidden w-full">
            <div className="flex gap-3 pb-3">
              {TIPS.map((tip, idx) => (
                <div key={idx} className="shrink-0 w-28 rounded-xl bg-[#F7F7F8] p-3 text-center">
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                    <tip.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-[#1a1a1a] leading-tight">{tip.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="hidden md:flex flex-col gap-3">
            {TIPS.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#F7F7F8]">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                  <tip.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={proceedToProcessing}
            disabled={!faceDetected}
            className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-6 text-base font-semibold h-auto glow-primary transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {faceDetected ? "✦ Apply AI Magic →" : "Detecting face…"}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
