"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { useToast } from "@/lib/hooks/useToast"
import { useBatchQueue } from "@/lib/hooks/useBatchQueue"
import { usePhotoHistory } from "@/lib/hooks/usePhotoHistory"
import type { BgColor } from "@/lib/hooks/useWizard"
import { RecentPhotosGrid } from "./RecentPhotosGrid"
import type { RecentPhoto } from "@/lib/photo-history"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Camera, Sun, UserRound, Ban, Smile, Star, Files, Video } from "lucide-react"
import { BatchQueuePanel } from "@/components/wizard/BatchQueuePanel"
import { WebcamCapture } from "@/components/wizard/WebcamCapture"
import { PassportIcon, ProfessionalIcon, EditIcon, CheckIcon, ArrowRightIcon } from "@/components/ui/icons"

const TIPS = [
  { icon: Sun, text: "Even, bright lighting" },
  { icon: UserRound, text: "Face centred, look straight" },
  { icon: Ban, text: "No cap or tinted glasses" },
  { icon: Smile, text: "Neutral expression" },
]

const PHOTO_TYPES = [
  {
    value: "passport",
    label: "Passport",
    size: "35 × 45 mm",
    badge: "India Standard",
    icon: PassportIcon,
    desc: "Indian Passport / Visa / Aadhaar",
  },
  {
    value: "professional",
    label: "Professional",
    size: "51 × 51 mm",
    badge: null,
    icon: ProfessionalIcon,
    desc: "LinkedIn / Resume / Corporate ID",
  },
  {
    value: "custom",
    label: "Custom",
    size: "Set manually",
    badge: null,
    icon: EditIcon,
    desc: "Any size you need",
  },
] as const

const BG_OPTIONS: { value: BgColor; label: string; hex: string }[] = [
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "red", label: "Red", hex: "#c0392b" },
  { value: "black", label: "Black", hex: "#1a1a1a" },
]

const COUNT_OPTIONS = [6, 8, 12] as const

export function PhotoCaptureStep() {
  const { photoSpec, setPhotoSpec, setPhotoData, nextStep } = useWizard()
  const { success, error } = useToast()
  const batchQueue = useBatchQueue()
  const photoHistory = usePhotoHistory()
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMode, setUploadMode] = useState<"single" | "batch">("single")
  const [showWebcam, setShowWebcam] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
  const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

  const handleWebcamCapture = (imageData: string) => {
    setUploadedImage(imageData)
    setPhotoData({ original: imageData })
    success("Photo captured successfully!", 2000)
    photoHistory.addPhoto(imageData, false)
    setTimeout(() => setFaceDetected(true), 800)
    setShowWebcam(false)
  }

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        message: "Please upload a JPG, PNG, or WebP image"
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      return {
        valid: false,
        message: `File size ${sizeMB}MB exceeds 20MB limit`
      }
    }

    return { valid: true }
  }

  const handleBatchUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const validFiles: Array<{ fileName: string; photoData: string }> = []
    let successCount = 0
    let failureCount = 0

    Array.from(files).forEach((file) => {
      const validation = validateFile(file)
      if (!validation.valid) {
        failureCount++
        error(`${file.name}: ${validation.message}`, 3000)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        validFiles.push({ fileName: file.name, photoData: result })
        successCount++

        // Add to batch queue when all files are read
        if (successCount + failureCount === files.length && validFiles.length > 0) {
          batchQueue.addItems(validFiles)
          success(`Added ${validFiles.length} photo${validFiles.length > 1 ? "s" : ""} to queue`, 3000)
        }
      }
      reader.onerror = () => {
        failureCount++
        error(`Failed to read ${file.name}`, 3000)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleLoadFromHistory = async (photo: RecentPhoto) => {
    setUploadedImage(photo.originalData)
    setFaceDetected(true)
    success("Photo loaded from history!")
  }

  const handleFileUpload = (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      error(validation.message || "Invalid file", 4000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setPhotoData({ original: result })
      success("Photo uploaded successfully", 2000)
      // Save to history
      photoHistory.addPhoto(result, false)
      // Simulated face detection (real impl would use TensorFlow.js)
      setTimeout(() => setFaceDetected(true), 1200)
    }
    reader.onerror = () => {
      error("Failed to read file. Please try again.", 4000)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
          Upload Your Photo
        </h1>
        <p className="text-base text-[#6b7280]">
          Choose type, background colour, and count — then upload
        </p>
      </motion.div>

      {/* Config card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-5 space-y-5">

        {/* Photo type */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">Photo type</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PHOTO_TYPES.map((type) => {
              const IconComponent = type.icon
              return (
              <button
                key={type.value}
                onClick={() => setPhotoSpec({ preset: type.value })}
                className={`relative rounded-xl p-3 text-left border-2 transition-all duration-200 ${photoSpec.preset === type.value
                    ? "border-[#FF5A36] bg-[#FFF5F0]"
                    : "border-[#E5E7EB] bg-white hover:border-[#FF5A36]/40 hover:bg-[#FFF8F6]"
                  }`}
              >
                <div className="flex items-start gap-2">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#FF5A36]/10 to-[#FF5A36]/5">
                    <IconComponent className="h-5 w-5 text-[#FF5A36]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[#111827]">{type.label}</span>
                      {type.badge && (
                        <span className="text-[10px] font-bold text-[#FF5A36] flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-current" />{type.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6b7280] mt-0.5">{type.desc}</p>
                    <p className="text-[11px] font-semibold text-[#9ca3af] mt-0.5">{type.size}</p>
                  </div>
                  {photoSpec.preset === type.value && (
                    <CheckCircle2 className="h-4 w-4 text-[#FF5A36] shrink-0 mt-0.5" />
                  )}
                </div>
              </button>
            )
            })}
          </div>
        </div>

        {/* Custom dimensions */}
        {photoSpec.preset === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customWidth">Width (mm)</Label>
              <Input id="customWidth" type="number" min={10} max={150}
                value={photoSpec.customWidthMm}
                onChange={(e) => { const v = Number(e.target.value); if (v > 0) setPhotoSpec({ customWidthMm: v }) }} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customHeight">Height (mm)</Label>
              <Input id="customHeight" type="number" min={10} max={150}
                value={photoSpec.customHeightMm}
                onChange={(e) => { const v = Number(e.target.value); if (v > 0) setPhotoSpec({ customHeightMm: v }) }} />
            </div>
          </div>
        )}

        {/* Background colour */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">Background colour</p>
          <div className="flex gap-2">
            {BG_OPTIONS.map((bg) => (
              <button
                key={bg.value}
                onClick={() => setPhotoSpec({ bgColor: bg.value })}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border-2 transition-all duration-200 ${photoSpec.bgColor === bg.value
                    ? "border-[#FF5A36] shadow-sm"
                    : "border-[#E5E7EB] hover:border-[#FF5A36]/40"
                  }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-[#d1d5db] shrink-0"
                  style={{ background: bg.hex }}
                />
                <span className="text-[#111827]">{bg.label}</span>
                {photoSpec.bgColor === bg.value && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5A36]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#111827]">Photos per sheet</p>
          <Tabs value={String(photoSpec.count)}
            onValueChange={(v) => setPhotoSpec({ count: Number(v) as 6 | 8 | 12 })}>
            <TabsList className="grid h-auto w-full max-w-xs grid-cols-3 rounded-xl bg-[#F7F7F8] p-1 gap-1">
              {COUNT_OPTIONS.map((c) => (
                <TabsTrigger key={c} value={String(c)}
                  className="rounded-lg py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {c} photos
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Upload mode toggle */}
      <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F7F8] p-1 w-fit">
        <button
          onClick={() => setUploadMode("single")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            uploadMode === "single"
              ? "bg-white text-[#FF5A36] shadow-sm"
              : "text-[#6b7280] hover:text-[#111827]"
          }`}
        >
          <Camera className="h-4 w-4" />
          Single
        </button>
        <button
          onClick={() => setUploadMode("batch")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            uploadMode === "batch"
              ? "bg-white text-[#FF5A36] shadow-sm"
              : "text-[#6b7280] hover:text-[#111827]"
          }`}
        >
          <Files className="h-4 w-4" />
          Batch
        </button>
      </div>

      {/* Upload + Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Single upload mode */}
        {uploadMode === "single" && (
        <>
        {/* Upload area */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              <motion.div key="upload"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

                {/* Desktop drag drop */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click() } }}
                  aria-label="Upload photo. Drag and drop or click to browse files"
                  className={`hidden md:flex relative flex-col items-center justify-center h-72 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${isDragging
                      ? "border-[#FF5A36] bg-[#ffe7df] scale-[1.01]"
                      : "border-[#FF5A36]/60 bg-[#fff5f0] hover:border-[#FF5A36] hover:bg-[#ffeae0]"
                    } focus:outline-none focus:ring-2 focus:ring-[#FF5A36] focus:ring-offset-2`}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.1),transparent_55%)]" />
                  <motion.div animate={isDragging ? { scale: 1.2, rotate: 8 } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <Camera className="w-14 h-14 text-[#FF5A36] mb-3" />
                  </motion.div>
                  <p className="text-lg font-semibold text-[#1a1a1a]">
                    {isDragging ? "Drop it here!" : "Drag your photo here"}
                  </p>
                  <p className="text-sm text-[#6b7280] mt-1">or click to browse</p>
                  <p className="mt-2 text-xs text-[#9ca3af] font-semibold">JPG, PNG — up to 20 MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                </div>

                {/* Desktop webcam button */}
                <div className="hidden md:flex justify-center mt-4">
                  <Button
                    onClick={() => setShowWebcam(true)}
                    variant="outline"
                    className="border-[#E5E7EB] rounded-xl px-6 py-2.5 font-semibold hover:bg-[#F7F7F8] hover:border-[#FF5A36]/40 transition-all"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Use Webcam Instead
                  </Button>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  <div className="aspect-3/4 max-h-64 rounded-3xl bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-[#9ca3af] mx-auto mb-2" />
                      <p className="text-sm text-[#6b7280]">Take or upload your photo</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setShowWebcam(true)}
                      className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-4 text-sm font-semibold h-auto"
                    >
                      <Video className="w-4 h-4 mr-1.5" />
                      Take Photo
                    </Button>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-[#E5E7EB] rounded-2xl py-4 text-sm font-semibold h-auto hover:bg-[#F7F7F8]"
                    >
                      <Camera className="w-4 h-4 mr-1.5" />
                      Upload
                    </Button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="preview"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden bg-[#F7F7F8] aspect-3/4 max-h-80">
                  <Image src={uploadedImage} alt="Uploaded" fill className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/20 to-transparent" />
                  {faceDetected && (
                    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-3 right-3 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
                      <span className="text-xs font-semibold text-[#1D9E75]">Face detected</span>
                    </motion.div>
                  )}
                </div>
                <p className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3 text-sm text-[#4b5563]">
                  <span className="inline-flex items-center gap-1">
                    <CheckIcon className="w-4 h-4" />
                    Great! AI will remove background, apply <strong>{photoSpec.bgColor}</strong> colour, and crop to{" "}
                    {photoSpec.preset === "professional" ? "professional square" : "passport 35×45 mm"} spec.
                  </span>
                </p>
                <Button onClick={() => { setUploadedImage(null); setFaceDetected(false) }}
                  variant="outline"
                  className="w-full border border-[#E5E5E5] rounded-xl py-2.5 font-semibold hover:bg-[#F7F7F8]">
                  Change Photo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#1a1a1a] text-sm">Tips for Best Results</h3>
          {/* Mobile scroll */}
          <ScrollArea className="md:hidden w-full">
            <div className="flex gap-2 pb-2">
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
          {/* Desktop stacked */}
          <div className="hidden md:flex flex-col gap-2.5">
            {TIPS.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F8]">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                  <tip.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {/* Batch upload mode */}
        {uploadMode === "batch" && (
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-[#FF5A36] bg-[#FFF5F0] px-8 py-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white mb-4">
              <Files className="h-8 w-8 text-[#FF5A36]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">Upload Multiple Photos</h3>
            <p className="text-sm text-[#6b7280] mb-4">Select multiple JPG, PNG, or WebP files to process them all at once</p>
            <Button
              onClick={() => batchInputRef.current?.click()}
              className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-6 py-3 font-semibold"
            >
              <Files className="h-4 w-4 mr-2" />
              Choose Photos
            </Button>
            <input
              ref={batchInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBatchUpload(e.target.files)}
            />
          </div>

          {/* Batch queue panel inline */}
          {batchQueue.items.length > 0 && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <BatchQueuePanel
                items={batchQueue.items}
                onRemove={batchQueue.removeItem}
                onClearCompleted={batchQueue.clearCompleted}
                onClearAll={batchQueue.clearAll}
              />
            </div>
          )}
        </div>
        )}
      </div>

      {/* Recent photos */}
      {photoHistory.photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-4"
        >
          <RecentPhotosGrid
            photos={photoHistory.photos}
            onSelectPhoto={handleLoadFromHistory}
            onRemovePhoto={photoHistory.removePhoto}
            onClearHistory={photoHistory.clearHistory}
          />
        </motion.div>
      )}

      {uploadedImage && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={() => { if (uploadedImage) nextStep() }}
            disabled={!faceDetected}
            className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-6 text-base font-semibold h-auto shadow-[0_8px_24px_rgba(255,90,54,0.3)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.4)] transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {faceDetected ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full"></span>
                Start AI Processing
                <ArrowRightIcon className="w-4 h-4" stroke="white" />
              </span>
            ) : "Detecting face…"}
          </Button>
        </motion.div>
      )}

      {/* Webcam modal */}
      <AnimatePresence>
        {showWebcam && (
          <WebcamCapture
            onCapture={handleWebcamCapture}
            onClose={() => setShowWebcam(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
