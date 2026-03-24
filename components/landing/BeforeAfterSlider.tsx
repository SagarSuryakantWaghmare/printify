"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

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
    <div className="w-full h-full rounded-3xl overflow-hidden bg-[#F7F7F8]">
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
          <div className="w-full h-full bg-linear-to-br from-blue-200 to-blue-100 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm font-600 text-blue-900">BEFORE</p>
              <p className="text-xs text-blue-700">Your original photo</p>
            </div>
          </div>
        </div>

        {/* After image */}
        <motion.div
          className="absolute inset-0 overflow-hidden bg-linear-to-br from-green-200 to-green-100"
          style={{ width: `${position}%` }}
          animate={{ width: `${position}%` }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm font-600 text-green-900">AFTER</p>
              <p className="text-xs text-green-700">AI-enhanced photo</p>
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
    </div>
  )
}
