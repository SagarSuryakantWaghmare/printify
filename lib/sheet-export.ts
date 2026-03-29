export type SheetPreset = "4x6" | "a4"
export type ExportQuality = "standard" | "low-data"
export type ExportFormat = "jpg" | "pdf"

export interface ExportPhotoSpec {
  widthMm: number
  heightMm: number
  count: 6 | 8 | 12
}

interface SheetDimension {
  widthPx: number
  heightPx: number
  label: string
}

const SHEET_DIMENSIONS: Record<SheetPreset, SheetDimension> = {
  "4x6": {
    // 6x4 inch at ~300 DPI (landscape)
    widthPx: 1800,
    heightPx: 1200,
    label: "4x6 inch",
  },
  a4: {
    // A4 at ~300 DPI (portrait)
    widthPx: 2480,
    heightPx: 3508,
    label: "A4",
  },
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return canvas
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = src
  })
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const frameAspect = width / height
  const imageAspect = image.width / image.height

  if (imageAspect > frameAspect) {
    const drawWidth = height * imageAspect
    const offsetX = x - (drawWidth - width) / 2
    ctx.drawImage(image, offsetX, y, drawWidth, height)
    return
  }

  const drawHeight = width / imageAspect
  const offsetY = y - (drawHeight - height) / 2
  ctx.drawImage(image, x, offsetY, width, drawHeight)
}

function drawTrimGuides(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const corner = Math.max(6, Math.round(Math.min(width, height) * 0.08))

  ctx.save()
  ctx.strokeStyle = "#9ca3af"
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.9

  // top-left
  ctx.beginPath()
  ctx.moveTo(x, y + corner)
  ctx.lineTo(x, y)
  ctx.lineTo(x + corner, y)
  ctx.stroke()

  // top-right
  ctx.beginPath()
  ctx.moveTo(x + width - corner, y)
  ctx.lineTo(x + width, y)
  ctx.lineTo(x + width, y + corner)
  ctx.stroke()

  // bottom-right
  ctx.beginPath()
  ctx.moveTo(x + width, y + height - corner)
  ctx.lineTo(x + width, y + height)
  ctx.lineTo(x + width - corner, y + height)
  ctx.stroke()

  // bottom-left
  ctx.beginPath()
  ctx.moveTo(x + corner, y + height)
  ctx.lineTo(x, y + height)
  ctx.lineTo(x, y + height - corner)
  ctx.stroke()

  ctx.restore()
}

function getBestGrid(
  count: number,
  pageWidth: number,
  pageHeight: number,
  photoAspect: number,
  margin: number,
  gap: number
): { cols: number; rows: number; tileWidth: number; tileHeight: number } {
  let best = {
    cols: 1,
    rows: count,
    tileWidth: 0,
    tileHeight: 0,
  }

  for (let cols = 1; cols <= count; cols += 1) {
    const rows = Math.ceil(count / cols)

    const availableWidth = pageWidth - margin * 2 - gap * (cols - 1)
    const availableHeight = pageHeight - margin * 2 - gap * (rows - 1)

    if (availableWidth <= 0 || availableHeight <= 0) {
      continue
    }

    const maxTileWidthFromWidth = availableWidth / cols
    const maxTileWidthFromHeight = (availableHeight / rows) * photoAspect
    const tileWidth = Math.min(maxTileWidthFromWidth, maxTileWidthFromHeight)
    const tileHeight = tileWidth / photoAspect

    if (tileWidth <= 0 || tileHeight <= 0) {
      continue
    }

    if (tileWidth * tileHeight > best.tileWidth * best.tileHeight) {
      best = { cols, rows, tileWidth, tileHeight }
    }
  }

  return best
}

function getQualityConfig(quality: ExportQuality) {
  if (quality === "low-data") {
    return {
      scale: 0.72,
      jpgQuality: 0.82,
      label: "Low Data",
    }
  }

  return {
    scale: 1,
    jpgQuality: 0.95,
    label: "Standard",
  }
}

function formatSizeKb(kb: number) {
  if (kb < 1024) {
    return `~${Math.max(1, Math.round(kb))} KB`
  }

  return `~${(kb / 1024).toFixed(1)} MB`
}

export function estimateExportFileSize(options: {
  sheetPreset: SheetPreset
  quality: ExportQuality
  format: ExportFormat
}) {
  const sheet = SHEET_DIMENSIONS[options.sheetPreset]
  const qualityConfig = getQualityConfig(options.quality)

  const scaledWidth = Math.round(sheet.widthPx * qualityConfig.scale)
  const scaledHeight = Math.round(sheet.heightPx * qualityConfig.scale)
  const pixelCount = scaledWidth * scaledHeight

  // Lightweight heuristic tuned for camera photos on white-sheet layouts.
  const jpgPerPixel = options.quality === "low-data" ? 0.16 : 0.27
  const jpgBytes = pixelCount * jpgPerPixel

  if (options.format === "jpg") {
    return formatSizeKb(jpgBytes / 1024)
  }

  // PDF wraps JPG and adds metadata/structure overhead.
  const pdfBytes = jpgBytes * 1.1 + 110 * 1024
  return formatSizeKb(pdfBytes / 1024)
}

export async function buildPrintSheetCanvas(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}): Promise<HTMLCanvasElement> {
  const { imageDataUrl, photoSpec, sheetPreset, quality = "standard" } = options
  const sheet = SHEET_DIMENSIONS[sheetPreset]
  const qualityConfig = getQualityConfig(quality)
  const image = await loadImage(imageDataUrl)

  const canvas = createCanvas(
    Math.round(sheet.widthPx * qualityConfig.scale),
    Math.round(sheet.heightPx * qualityConfig.scale)
  )
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Canvas context not available")
  }

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, sheet.widthPx, sheet.heightPx)

  const margin = sheetPreset === "4x6" ? 48 : 72
  const gap = sheetPreset === "4x6" ? 22 : 28
  const photoAspect = photoSpec.widthMm / photoSpec.heightMm

  const grid = getBestGrid(photoSpec.count, sheet.widthPx, sheet.heightPx, photoAspect, margin, gap)

  const totalGridWidth = grid.cols * grid.tileWidth + (grid.cols - 1) * gap
  const totalGridHeight = grid.rows * grid.tileHeight + (grid.rows - 1) * gap

  const startX = (sheet.widthPx - totalGridWidth) / 2
  const startY = (sheet.heightPx - totalGridHeight) / 2

  for (let index = 0; index < photoSpec.count; index += 1) {
    const row = Math.floor(index / grid.cols)
    const col = index % grid.cols

    const x = startX + col * (grid.tileWidth + gap)
    const y = startY + row * (grid.tileHeight + gap)

    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, grid.tileWidth, grid.tileHeight)
    ctx.clip()
    drawCoverImage(ctx, image, x, y, grid.tileWidth, grid.tileHeight)
    ctx.restore()

    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, grid.tileWidth, grid.tileHeight)

    drawTrimGuides(ctx, x, y, grid.tileWidth, grid.tileHeight)
  }

  return canvas
}

function triggerDownload(url: string, fileName: string) {
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export async function downloadSheetAsJpg(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}) {
  const { quality = "standard" } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  triggerDownload(
    dataUrl,
    `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${qualityConfig.label.toLowerCase().replace(" ", "-")}.jpg`
  )
}

export async function downloadSheetAsPdf(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}) {
  const { quality = "standard" } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)

  const { jsPDF } = await import("jspdf")

  const orientation = canvas.width > canvas.height ? "landscape" : "portrait"
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [canvas.width, canvas.height],
    compress: true,
  })

  pdf.addImage(dataUrl, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST")
  pdf.save(
    `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${qualityConfig.label.toLowerCase().replace(" ", "-")}.pdf`
  )
}

export async function buildSheetJpgFile(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}) {
  const { quality = "standard" } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas = await buildPrintSheetCanvas(options)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (fileBlob) => {
        if (!fileBlob) {
          reject(new Error("Could not create export file"))
          return
        }

        resolve(fileBlob)
      },
      "image/jpeg",
      qualityConfig.jpgQuality
    )
  })

  return new File(
    [blob],
    `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${qualityConfig.label.toLowerCase().replace(" ", "-")}.jpg`,
    { type: "image/jpeg" }
  )
}

export function getPresetDimensionsMm(preset: "passport" | "stamp" | "custom", customWidthMm: number, customHeightMm: number) {
  if (preset === "passport") {
    return { widthMm: 35, heightMm: 45, label: "Passport 35 x 45 mm" }
  }

  if (preset === "stamp") {
    return { widthMm: 25, heightMm: 35, label: "Stamp 25 x 35 mm" }
  }

  return {
    widthMm: customWidthMm,
    heightMm: customHeightMm,
    label: `Custom ${customWidthMm} x ${customHeightMm} mm`,
  }
}

export function buildPrintInstructionMessage(options: {
  sizeLabel: string
  count: number
  sheetPreset: SheetPreset
}) {
  const sheetLabel = SHEET_DIMENSIONS[options.sheetPreset].label

  return [
    "Print instructions:",
    `Use ${sheetLabel} photo paper.`,
    `Photo size: ${options.sizeLabel}`,
    `Total photos on sheet: ${options.count}`,
    "Keep colors natural and use corner marks for clean trimming.",
    "",
    "English:",
    `Please print on ${sheetLabel} photo paper.`,
    `Photo size: ${options.sizeLabel}`,
    `Total photos on sheet: ${options.count}`,
    "Please keep colors natural and cut neatly using the corner marks.",
    "Thank you.",
  ].join("\n")
}

// Backward-compatible alias for older imports.
export const buildWhatsAppStudioMessage = buildPrintInstructionMessage

/**
 * Download sheet as JPG with custom file naming
 */
export async function downloadSheetAsJpgWithNaming(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
  fileName?: string
}) {
  const { quality = "standard", fileName } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  const defaultFileName = `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${qualityConfig.label.toLowerCase().replace(" ", "-")}.jpg`
  triggerDownload(dataUrl, fileName || defaultFileName)
}

/**
 * Download sheet as PDF with custom file naming
 */
export async function downloadSheetAsPdfWithNaming(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
  fileName?: string
}) {
  const { quality = "standard", fileName } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)

  const { jsPDF } = await import("jspdf")

  const orientation = canvas.width > canvas.height ? "landscape" : "portrait"
  const pdf = new jsPDF({
    orientation,
    unit: "px",
    format: [canvas.width, canvas.height],
    compress: true,
  })

  pdf.addImage(dataUrl, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST")
  
  const defaultFileName = `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${qualityConfig.label.toLowerCase().replace(" ", "-")}.pdf`
  pdf.save(fileName || defaultFileName)
}
