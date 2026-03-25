"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Aperture, Sparkles } from "lucide-react"

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDrag = (event: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let clientX: number

    if (event instanceof TouchEvent) {
      clientX = event.touches[0].clientX
    } else {
      clientX = (event as MouseEvent).clientX
    }

    const percent = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(0, Math.min(100, percent)))
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-[#e6e7ea] bg-white shadow-[0_20px_34px_rgba(17,24,39,0.08)]">
      <div
        ref={containerRef}
        className="relative w-full aspect-square md:aspect-video cursor-col-resize select-none"
        onMouseMove={(e) => {
          if (e.buttons !== 1) return
          handleDrag(e.nativeEvent)
        }}
        onTouchMove={(e) => handleDrag(e.nativeEvent)}
      >
        {/* Before image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-linear-to-br from-[#dbeafe] via-[#e0ecff] to-[#f3f7ff] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-[#c4d3ef] text-[#39517a]">
                <Aperture className="h-4 w-4" />
              </div>
              <p className="text-sm font-700 tracking-wide text-[#243b64]">ORIGINAL</p>
              <p className="text-xs text-[#4f6489]">Unprocessed camera image</p>
            </div>
          </div>
        </div>

        {/* After image */}
        <motion.div
          className="absolute inset-0 overflow-hidden bg-linear-to-br from-[#ecfff6] via-[#ddf8ec] to-[#f3fffa]"
          style={{ width: `${position}%` }}
          animate={{ width: `${position}%` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-[#b8e5cf] text-[#1c7c57]">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm font-700 tracking-wide text-[#166344]">AI ENHANCED</p>
              <p className="text-xs text-[#2f7f5d]">Compliance-ready output</p>
            </div>
          </div>
        </motion.div>

        {/* Slider handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
          style={{ left: `${position}%` }}
          drag="x"
          dragElastic={0}
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={(event, info) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const newPosition = ((info.point.x - rect.left) / rect.width) * 100
            setPosition(Math.max(0, Math.min(100, newPosition)))
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#FF5A36]">
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-[#FF5A36] rounded-full" />
              <div className="w-1 h-3 bg-[#FF5A36] rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-between border-t border-[#eceef2] bg-[#fafbfc] px-4 py-3 text-xs sm:text-sm">
        <p className="font-600 text-[#4b5563]">Drag to compare before and after</p>
        <p className="font-700 text-[#111827]">Live compliance preview</p>
      </div>
    </div>
  )
}
