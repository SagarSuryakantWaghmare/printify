"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useWizard, useHistory } from "@/lib/hooks"
import type { BgColor } from "@/lib/hooks/useWizard"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    RotateCcw, RotateCw, ZoomIn, ZoomOut,
    RefreshCw, Check, Move, Undo2, Redo2, Lightbulb,
} from "lucide-react"

const BG_HEX: Record<BgColor, string> = {
    white: "#ffffff",
    black: "#1a1a1a",
    red: "#c0392b",
}

const FRAME_PADDING_RATIO = 0.12 // frame fills ~76% of canvas height

function getFrameAspect(preset: string, cwMm: number, chMm: number): number {
    if (preset === "professional") return 51 / 51 // square
    if (preset === "custom") return cwMm / chMm
    return 35 / 45 // passport portrait
}

export function CropStep() {
    const { photoData, photoSpec, setPhotoData, nextStep } = useWizard()

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)

    // Transform state with undo/redo
    const transformHistory = useHistory({
        scale: 1,
        rotation: 0,
        offset: { x: 0, y: 0 }
    })

    const [baseScale, setBaseScale] = useState(1)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isApplying, setIsApplying] = useState(false)
    const [canvasSize, setCanvasSize] = useState({ w: 600, h: 520 })
    const [showGuides, setShowGuides] = useState(true)
    const [guideType, setGuideType] = useState<"grid" | "thirds" | "center">("thirds")

    // Shorthand for current transform state
    const scale = transformHistory.state.scale
    const rotation = transformHistory.state.rotation
    const offset = transformHistory.state.offset

    const setScale = useCallback((value: number | ((prev: number) => number)) => {
        const newScale = typeof value === "function" ? value(scale) : value
        transformHistory.setState({
            scale: newScale,
            rotation,
            offset
        })
    }, [scale, rotation, offset, transformHistory])

    const setRotation = useCallback((value: number | ((prev: number) => number)) => {
        const newRotation = typeof value === "function" ? value(rotation) : value
        transformHistory.setState({
            scale,
            rotation: newRotation,
            offset
        })
    }, [scale, rotation, offset, transformHistory])

    const setOffset = useCallback((value: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => {
        const newOffset = typeof value === "function" ? value(offset) : value
        transformHistory.setState({
            scale,
            rotation,
            offset: newOffset
        })
    }, [scale, rotation, offset, transformHistory])

    const frameAspect = getFrameAspect(
        photoSpec.preset,
        photoSpec.customWidthMm,
        photoSpec.customHeightMm
    )

    const dragRef = useRef({ active: false, lastX: 0, lastY: 0 })
    const pinchRef = useRef({ lastDist: 0 })

    /** Compute frame rect from current canvas size */
    const getFrame = useCallback((cw: number, ch: number) => {
        const pad = ch * FRAME_PADDING_RATIO
        const fh = ch - pad * 2
        const fw = fh * frameAspect
        const fx = (cw - fw) / 2
        const fy = pad
        return { fw, fh, fx, fy }
    }, [frameAspect])

    /** Main draw function */
    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const img = imgRef.current
        if (!canvas || !img) return
        const ctx = canvas.getContext("2d")!
        const { w: cw, h: ch } = canvasSize
        const { fw, fh, fx, fy } = getFrame(cw, ch)

        canvas.width = cw
        canvas.height = ch

        ctx.clearRect(0, 0, cw, ch)

        // Checkerboard bg (shows transparency)
        const tileSize = 18
        for (let row = 0; row * tileSize < ch; row++) {
            for (let col = 0; col * tileSize < cw; col++) {
                ctx.fillStyle = (row + col) % 2 === 0 ? "#e8e8e8" : "#d0d0d0"
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize)
            }
        }

        // Draw image centered on canvas center + offset
        const cx = cw / 2
        const cy = ch / 2
        ctx.save()
        ctx.translate(cx + offset.x, cy + offset.y)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(scale, scale)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        ctx.restore()

        // Dark overlay — 4 rects around the frame (leaves frame clear)
        ctx.fillStyle = "rgba(0,0,0,0.62)"
        ctx.fillRect(0, 0, cw, fy)
        ctx.fillRect(0, fy + fh, cw, ch - fy - fh)
        ctx.fillRect(0, fy, fx, fh)
        ctx.fillRect(fx + fw, fy, cw - fx - fw, fh)

        // Orange frame border
        ctx.strokeStyle = "#FF5A36"
        ctx.lineWidth = 2.5
        ctx.strokeRect(fx, fy, fw, fh)

        // Corner brackets
        const corner = Math.min(20, fw * 0.12)
        ctx.lineWidth = 3.5
        // TL
        ctx.beginPath(); ctx.moveTo(fx, fy + corner); ctx.lineTo(fx, fy); ctx.lineTo(fx + corner, fy); ctx.stroke()
        // TR
        ctx.beginPath(); ctx.moveTo(fx + fw - corner, fy); ctx.lineTo(fx + fw, fy); ctx.lineTo(fx + fw, fy + corner); ctx.stroke()
        // BR
        ctx.beginPath(); ctx.moveTo(fx + fw, fy + fh - corner); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx + fw - corner, fy + fh); ctx.stroke()
        // BL
        ctx.beginPath(); ctx.moveTo(fx + corner, fy + fh); ctx.lineTo(fx, fy + fh); ctx.lineTo(fx, fy + fh - corner); ctx.stroke()

        // Composition guides (if enabled)
        if (showGuides) {
            ctx.strokeStyle = "rgba(255,255,255,0.25)"
            ctx.lineWidth = 0.8

            if (guideType === "thirds") {
                // Rule-of-thirds lines
                ctx.setLineDash([5, 5])
                ctx.beginPath(); ctx.moveTo(fx + fw / 3, fy); ctx.lineTo(fx + fw / 3, fy + fh); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(fx + fw * 2 / 3, fy); ctx.lineTo(fx + fw * 2 / 3, fy + fh); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(fx, fy + fh / 3); ctx.lineTo(fx + fw, fy + fh / 3); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(fx, fy + fh * 2 / 3); ctx.lineTo(fx + fw, fy + fh * 2 / 3); ctx.stroke()
                ctx.setLineDash([])
            } else if (guideType === "grid") {
                // Grid pattern (9x9)
                ctx.setLineDash([3, 3])
                const gridCellW = fw / 9
                const gridCellH = fh / 9
                for (let i = 1; i < 9; i++) {
                    // Vertical lines
                    ctx.beginPath(); ctx.moveTo(fx + gridCellW * i, fy); ctx.lineTo(fx + gridCellW * i, fy + fh); ctx.stroke()
                    // Horizontal lines
                    ctx.beginPath(); ctx.moveTo(fx, fy + gridCellH * i); ctx.lineTo(fx + fw, fy + gridCellH * i); ctx.stroke()
                }
                ctx.setLineDash([])
            } else if (guideType === "center") {
                // Center crosshair
                ctx.lineWidth = 1
                ctx.strokeStyle = "rgba(255,255,255,0.4)"
                const centerX = fx + fw / 2
                const centerY = fy + fh / 2
                const crossSize = Math.min(fw, fh) * 0.08
                ctx.setLineDash([4, 4])
                ctx.beginPath(); ctx.moveTo(centerX - crossSize, centerY); ctx.lineTo(centerX + crossSize, centerY); ctx.stroke()
                ctx.beginPath(); ctx.moveTo(centerX, centerY - crossSize); ctx.lineTo(centerX, centerY + crossSize); ctx.stroke()
                ctx.setLineDash([])
                // Small center dot
                ctx.fillStyle = "rgba(255,255,255,0.6)"
                ctx.beginPath(); ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2); ctx.fill()
            }
        }

        // Dimension label
        const label = photoSpec.preset === "professional"
            ? "51 × 51 mm"
            : photoSpec.preset === "custom"
                ? `${photoSpec.customWidthMm} × ${photoSpec.customHeightMm} mm`
                : "35 × 45 mm"
        ctx.fillStyle = "rgba(0,0,0,0.55)"
        ctx.fillRect(fx, fy + fh + 4, fw, 20)
        ctx.fillStyle = "#ffffff"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(label, fx + fw / 2, fy + fh + 18)
    }, [canvasSize, offset, rotation, scale, getFrame, frameAspect, photoSpec, showGuides, guideType])

    // Load image + set initial scale
    useEffect(() => {
        const src = photoData.transparent ?? photoData.original
        if (!src) return

        const img = new Image()
        img.onload = () => {
            imgRef.current = img

            const container = containerRef.current
            const cw = container?.clientWidth ?? 600
            const ch = Math.min(window.innerHeight * 0.6, 520)
            setCanvasSize({ w: cw, h: ch })

            // Calculate auto-scale: image covers the frame
            const { fw, fh } = getFrame(cw, ch)
            const imgAspect = img.width / img.height
            const bs = imgAspect > frameAspect
                ? (fh / img.height) * 1.08
                : (fw / img.width) * 1.08
            setBaseScale(bs)
            setScale(bs)
            setImageLoaded(true)
        }
        img.src = src
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Redraw when anything changes
    useEffect(() => { draw() }, [draw])

    // Resize handler
    useEffect(() => {
        const onResize = () => {
            if (!containerRef.current) return
            const cw = containerRef.current.clientWidth
            const ch = Math.min(window.innerHeight * 0.6, 520)
            setCanvasSize({ w: cw, h: ch })
        }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    // Mouse events
    const onMouseDown = (e: React.MouseEvent) => {
        dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY }
    }
    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragRef.current.active) return
        const dx = e.clientX - dragRef.current.lastX
        const dy = e.clientY - dragRef.current.lastY
        dragRef.current.lastX = e.clientX; dragRef.current.lastY = e.clientY
        setOffset((p) => ({ x: p.x + dx, y: p.y + dy }))
    }
    const onMouseUp = () => { dragRef.current.active = false }
    const onWheel = (e: React.WheelEvent) => {
        e.preventDefault()
        const factor = e.deltaY < 0 ? 1.06 : 0.94
        setScale((s) => Math.max(0.2, Math.min(8, s * factor)))
    }

    // Touch events
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            dragRef.current = { active: true, lastX: e.touches[0].clientX, lastY: e.touches[0].clientY }
        }
        if (e.touches.length === 2) {
            const dx = e.touches[1].clientX - e.touches[0].clientX
            const dy = e.touches[1].clientY - e.touches[0].clientY
            pinchRef.current.lastDist = Math.sqrt(dx * dx + dy * dy)
        }
    }
    const onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault()
        if (e.touches.length === 1 && dragRef.current.active) {
            const dx = e.touches[0].clientX - dragRef.current.lastX
            const dy = e.touches[0].clientY - dragRef.current.lastY
            dragRef.current.lastX = e.touches[0].clientX; dragRef.current.lastY = e.touches[0].clientY
            setOffset((p) => ({ x: p.x + dx, y: p.y + dy }))
        }
        if (e.touches.length === 2) {
            const dx = e.touches[1].clientX - e.touches[0].clientX
            const dy = e.touches[1].clientY - e.touches[0].clientY
            const dist = Math.sqrt(dx * dx + dy * dy)
            const factor = dist / pinchRef.current.lastDist
            pinchRef.current.lastDist = dist
            setScale((s) => Math.max(0.2, Math.min(8, s * factor)))
        }
    }
    const onTouchEnd = () => { dragRef.current.active = false }

    // Export the crop
    const applyCrop = useCallback(async () => {
        const img = imgRef.current
        if (!img) return
        setIsApplying(true)
        try {
            const { w: cw, h: ch } = canvasSize
            const { fw, fh } = getFrame(cw, ch)
            const OUTPUT_W = 1050
            const OUTPUT_H = Math.round(OUTPUT_W / frameAspect)

            const off = document.createElement("canvas")
            off.width = OUTPUT_W; off.height = OUTPUT_H
            const ctx = off.getContext("2d")!

            // Fill chosen BG color
            ctx.fillStyle = BG_HEX[photoSpec.bgColor]
            ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H)

            // Map transforms: frame center → output center
            // frame center in canvas = (cw/2, ch/2) because frame is always centered
            // Image center in canvas = (cw/2 + offset.x, ch/2 + offset.y)
            // Relative image center from frame center = (offset.x, offset.y)
            const scaleRatio = OUTPUT_W / fw // pixels per mm → output pixels

            ctx.save()
            ctx.translate(OUTPUT_W / 2 + offset.x * scaleRatio, OUTPUT_H / 2 + offset.y * scaleRatio)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.scale(scale * scaleRatio, scale * scaleRatio)
            ctx.drawImage(img, -img.width / 2, -img.height / 2)
            ctx.restore()

            const croppedUrl = off.toDataURL("image/jpeg", 0.95)
            setPhotoData({ processed: croppedUrl })
            nextStep()
        } finally {
            setIsApplying(false)
        }
    }, [canvasSize, frameAspect, offset, rotation, scale, photoSpec.bgColor, setPhotoData, nextStep, getFrame])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const step = 15 // pixels to pan
            const zoomFactor = 1.15

            // Undo/Redo
            if (e.ctrlKey || e.metaKey) {
                if (e.key === "z" && !e.shiftKey) {
                    e.preventDefault()
                    transformHistory.undo()
                    return
                }
                if ((e.key === "z" && e.shiftKey) || e.key === "y") {
                    e.preventDefault()
                    transformHistory.redo()
                    return
                }
            }

            switch (e.key) {
                case "ArrowLeft":
                    if (!e.shiftKey) {
                        e.preventDefault()
                        setOffset((p) => ({ ...p, x: p.x + step }))
                    }
                    break
                case "ArrowRight":
                    if (!e.shiftKey) {
                        e.preventDefault()
                        setOffset((p) => ({ ...p, x: p.x - step }))
                    }
                    break
                case "ArrowUp":
                case "w":
                    e.preventDefault()
                    setOffset((p) => ({ ...p, y: p.y + step }))
                    break
                case "ArrowDown":
                case "s":
                    e.preventDefault()
                    setOffset((p) => ({ ...p, y: p.y - step }))
                    break
                case "+":
                case "=":
                case "[":
                    e.preventDefault()
                    setScale((s) => Math.max(0.2, Math.min(8, s * zoomFactor)))
                    break
                case "-":
                case "_":
                case "]":
                    e.preventDefault()
                    setScale((s) => Math.max(0.2, Math.min(8, s / zoomFactor)))
                    break
                case "r":
                case "R":
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault()
                        reset()
                    }
                    break
                case "Enter":
                    e.preventDefault()
                    applyCrop()
                    break
                // Rotation with Shift+Arrow keys
                case "ArrowLeft":
                    if (e.shiftKey) {
                        e.preventDefault()
                        setRotation((r) => (r - 5 + 360) % 360)
                    }
                    break
                case "ArrowRight":
                    if (e.shiftKey) {
                        e.preventDefault()
                        setRotation((r) => (r + 5) % 360)
                    }
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [applyCrop, transformHistory])

    const reset = () => {
        transformHistory.setState({
            scale: baseScale,
            rotation: 0,
            offset: { x: 0, y: 0 }
        })
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                    Adjust & Crop
                </h1>
                <p className="text-sm text-[#6b7280] space-y-1">
                    <div><Move className="inline h-3.5 w-3.5 mr-1" />Drag to reposition · Scroll/pinch to zoom · Use buttons to rotate</div>
                    <div className="text-xs text-[#9ca3af]">Keyboard: Arrow keys pan · +/- zoom · R reset · Shift+Arrow rotate · Enter confirm</div>
                </p>
            </motion.div>

            {/* Canvas editor */}
            <div ref={containerRef} className="w-full">
                <canvas
                    ref={canvasRef}
                    className={`w-full rounded-2xl border border-slate-200 shadow-md touch-none ${imageLoaded ? "cursor-move" : "cursor-wait"}`}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onWheel={onWheel}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                />
            </div>

            {/* Controls */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-4">
                {/* Zoom slider */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#6b7280]">
                        <span>Zoom</span>
                        <span>{Math.round(scale / baseScale * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setScale((s) => Math.max(0.2, s * 0.92))}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6b7280] hover:bg-[#F7F7F8] transition-colors"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <input
                            type="range"
                            min={0.2}
                            max={Math.max(baseScale * 4, 5)}
                            step={0.01}
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            className="flex-1 h-2 appearance-none rounded-full bg-[#E5E7EB] accent-[#FF5A36] cursor-pointer"
                        />
                        <button
                            onClick={() => setScale((s) => Math.min(8, s * 1.08))}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6b7280] hover:bg-[#F7F7F8] transition-colors"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Rotate + Reset */}
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-[#6b7280] mr-1">Rotate:</p>
                    <button
                        onClick={() => setRotation((r) => r - 1)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8] transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> −1°
                    </button>
                    <button
                        onClick={() => setRotation((r) => r + 1)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8] transition-colors"
                    >
                        <RotateCw className="h-3.5 w-3.5" /> +1°
                    </button>
                    <button
                        onClick={() => setRotation((r) => r - 5)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8] transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> −5°
                    </button>
                    <button
                        onClick={() => setRotation((r) => r + 5)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8] transition-colors"
                    >
                        <RotateCw className="h-3.5 w-3.5" /> +5°
                    </button>
                    <span className="text-xs text-[#9ca3af] px-1">{rotation}°</span>
                </div>

                {/* Composition guides */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#6b7280]">Composition Guides</label>
                        <button
                            onClick={() => setShowGuides(!showGuides)}
                            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${showGuides ? "bg-[#FF5A36]" : "bg-[#E5E7EB]"}`}
                        >
                            <motion.div
                                initial={false}
                                animate={{ x: showGuides ? 20 : 2 }}
                                className="h-5 w-5 rounded-full bg-white shadow-sm"
                            />
                        </button>
                    </div>
                    {showGuides && (
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { value: "thirds", label: "Rule of Thirds", desc: "Balanced composition" },
                                { value: "grid", label: "Grid", desc: "Precise alignment" },
                                { value: "center", label: "Center", desc: "Centered focus" },
                            ].map((guide) => (
                                <button
                                    key={guide.value}
                                    onClick={() => setGuideType(guide.value as typeof guideType)}
                                    className={`rounded-lg border-2 px-2 py-1.5 text-center transition-all ${
                                        guideType === guide.value
                                            ? "border-[#FF5A36] bg-[#FFF5F0]"
                                            : "border-[#E5E7EB] hover:border-[#FF5A36]/40"
                                    }`}
                                >
                                    <p className="text-xs font-semibold text-[#111827]">{guide.label}</p>
                                    <p className="text-[10px] text-[#6b7280] mt-0.5">{guide.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Undo/Redo + Reset */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => transformHistory.undo()}
                        disabled={!transformHistory.canUndo}
                        className="flex items-center justify-center h-8 w-8 rounded-lg border border-[#E5E7EB] text-[#6b7280] hover:bg-[#F7F7F8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => transformHistory.redo()}
                        disabled={!transformHistory.canRedo}
                        className="flex items-center justify-center h-8 w-8 rounded-lg border border-[#E5E7EB] text-[#6b7280] hover:bg-[#F7F7F8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo2 className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                        onClick={reset}
                        className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-semibold text-[#6b7280] hover:bg-[#F7F7F8] transition-colors"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Reset
                    </button>
                </div>
            </div>

            {/* Tip */}
            <p className="text-xs text-[#9ca3af] px-1 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                Tip: Use the orange frame as your crop guide. Face should be centred and eyes level.
            </p>

            {/* Apply button */}
            <Button
                onClick={applyCrop}
                disabled={!imageLoaded || isApplying}
                className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-2xl py-6 text-base font-semibold h-auto shadow-[0_8px_24px_rgba(255,90,54,0.3)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.4)] transition-all hover:scale-[1.01] disabled:opacity-60"
            >
                {isApplying ? (
                    <><RefreshCw className="mr-2 h-5 w-5 animate-spin" />Applying crop…</>
                ) : (
                    <><Check className="mr-2 h-5 w-5" />Apply Crop & Enhance →</>
                )}
            </Button>
        </div>
    )
}
