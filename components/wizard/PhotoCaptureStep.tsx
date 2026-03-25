"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useWizard } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Camera, Upload, Sun, UserRound, Ban, Smile } from "lucide-react"

const TIPS = [
  { icon: Sun, text: "Use bright, even lighting" },
  { icon: UserRound, text: "Keep face centered" },
  { icon: Ban, text: "No cap or tinted glasses" },
  { icon: Smile, text: "Neutral expression" },
]

export function PhotoCaptureStep() {
  const { setPhotoData, nextStep } = useWizard()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
      setPhotoData({ original: result })

      // Simulate face detection (would be real ML in production)
      setTimeout(() => setFaceDetected(true), 1500)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) {
      handleFileUpload(file)
    }
  }

  const proceedToProcessing = () => {
    if (uploadedImage) {
      nextStep()
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-700 text-[#1a1a1a]">
          Capture Your Photo
        </h1>
        <p className="text-base md:text-lg text-[#6b7280]">
          Indian passport-size format
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Camera/Upload Area - Left/Main */}
        <div className="md:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!uploadedImage ? (
              <motion.div
                key="upload-ui"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
              {/* Desktop: Drag and drop area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  setIsDragging(false)
                  handleDrop(e)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative hidden md:flex flex-col items-center justify-center h-96 rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#FF5A36] bg-[#ffe7df]"
                    : "border-[#FF5A36] bg-[#fff5f0] hover:bg-[#ffeae0]"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(255,90,54,0.16),transparent_45%)]" />
                <Camera className="w-16 h-16 text-[#FF5A36] mb-4" />
                <p className="text-lg font-600 text-[#1a1a1a] mb-2">
                  Drag photo here
                </p>
                <p className="text-sm text-[#6b7280]">or click to upload</p>
                <p className="mt-2 text-xs font-600 text-[#9ca3af]">
                  JPG, PNG up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="mt-6 px-6 py-3 rounded-xl bg-[#FF5A36] text-white font-600 hover:bg-[#e04e2d] transition-colors"
                >
                  Select Photo
                </Button>
              </div>

              {/* Mobile: Simple upload */}
              <div className="md:hidden space-y-4">
                <div className="aspect-square rounded-3xl bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-[#6b7280] mx-auto mb-2" />
                    <p className="text-sm text-[#6b7280]">
                      Upload your photo below
                    </p>
                    <p className="mt-1 text-xs font-600 text-[#9ca3af]">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl py-6 text-base font-600 h-auto"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-[#1a1a1a] border border-[#E5E5E5] rounded-xl py-6 text-base font-600 h-auto hover:bg-[#F7F7F8]"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload from Gallery
                  </Button>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
                ref={fileInputRef}
              />
              </motion.div>
            ) : (
              <motion.div
                key="preview-ui"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
              <div className="relative rounded-3xl overflow-hidden bg-[#F7F7F8] aspect-square md:aspect-auto md:h-96">
                <Image
                  src={uploadedImage}
                  alt="Uploaded photo"
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 100vw"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/20 to-transparent" />

                {/* Face detected indicator */}
                {faceDetected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#1D9E75]" />
                    <span className="text-sm font-600 text-[#1D9E75]">
                      Face detected
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-sm text-[#4b5563]">
                Great start. Our AI will now remove background, optimize lighting, and format this photo for official standards.
              </div>

              <Button
                onClick={() => {
                  setUploadedImage(null)
                  setFaceDetected(false)
                }}
                variant="outline"
                className="w-full border border-[#E5E5E5] text-[#1a1a1a] rounded-xl py-3 font-600 hover:bg-[#F7F7F8]"
              >
                Change Photo
              </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips panel - Right */}
        <div className="space-y-4">
          <h3 className="font-600 text-[#1a1a1a]">Tips for Best Results</h3>

          {/* Mobile: Horizontal scroll */}
          <ScrollArea className="md:hidden w-full">
            <div className="flex gap-3 pb-4">
              {TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-24 rounded-xl bg-[#F7F7F8] p-3 text-center"
                >
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                    <tip.icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-600 text-[#1a1a1a] leading-tight">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Desktop: Stacked */}
          <div className="hidden md:space-y-3">
            {TIPS.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-[#F7F7F8]"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#6b7280]">
                  <tip.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-600 text-[#1a1a1a]">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {uploadedImage && (
        <div className="flex flex-col sm:flex-row gap-4 md:col-span-2">
          <Button
            onClick={proceedToProcessing}
            className="flex-1 bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl py-6 text-base font-600 h-auto"
          >
            Process Photo
          </Button>
        </div>
      )}
    </div>
  )
}
