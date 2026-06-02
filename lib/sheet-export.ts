export type SheetPreset = "4x6" | "a4"
export type ExportQuality = "standard" | "low-data"
export type ExportFormat = "jpg" | "pdf"

export interface ExportPhotoSpec {
  widthMm: number
  heightMm: number
  count: 6 | 8 | 12
}

/** Physical sheet dimensions in mm (used for correct-DPI PDF export) */
const SHEET_MM: Record<SheetPreset, { widthMm: number; heightMm: number; label: string }> = {
  "4x6": { widthMm: 101.6, heightMm: 152.4, label: "4×6 inch" }, // 4"×6" photo paper
  a4:    { widthMm: 210,   heightMm: 297,   label: "A4" },
}

/**
 * Canvas pixel dimensions at 300 DPI.
 * 4×6 = 4"×6" → 1200×1800 px  (landscape = 1800 wide × 1200 tall)
 * A4  = 210×297 mm → 2480×3508 px  (portrait)
 *
 * NOTE: 4×6 is stored portrait-first here and we flip in orientation logic.
 */
const SHEET_DIMENSIONS_300DPI: Record<SheetPreset, { widthPx: number; heightPx: number }> = {
  "4x6": { widthPx: 1800, heightPx: 1200 }, // landscape
  a4:    { widthPx: 2480, heightPx: 3508 }, // portrait
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
  ctx.beginPath(); ctx.moveTo(x, y + corner); ctx.lineTo(x, y); ctx.lineTo(x + corner, y); ctx.stroke()
  // top-right
  ctx.beginPath(); ctx.moveTo(x + width - corner, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + corner); ctx.stroke()
  // bottom-right
  ctx.beginPath(); ctx.moveTo(x + width, y + height - corner); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width - corner, y + height); ctx.stroke()
  // bottom-left
  ctx.beginPath(); ctx.moveTo(x + corner, y + height); ctx.lineTo(x, y + height); ctx.lineTo(x, y + height - corner); ctx.stroke()

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
  let best = { cols: 1, rows: count, tileWidth: 0, tileHeight: 0 }

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols)
    const availableWidth  = pageWidth  - margin * 2 - gap * (cols - 1)
    const availableHeight = pageHeight - margin * 2 - gap * (rows - 1)
    if (availableWidth <= 0 || availableHeight <= 0) continue

    const maxTileWidthFromWidth  = availableWidth  / cols
    const maxTileWidthFromHeight = (availableHeight / rows) * photoAspect
    const tileWidth  = Math.min(maxTileWidthFromWidth, maxTileWidthFromHeight)
    const tileHeight = tileWidth / photoAspect

    if (tileWidth <= 0 || tileHeight <= 0) continue
    if (tileWidth * tileHeight > best.tileWidth * best.tileHeight) {
      best = { cols, rows, tileWidth, tileHeight }
    }
  }

  return best
}

function getQualityConfig(quality: ExportQuality) {
  if (quality === "low-data") {
    return { scale: 0.72, jpgQuality: 0.82, label: "Low Data" }
  }
  return { scale: 1, jpgQuality: 0.95, label: "Standard" }
}

function formatSizeKb(kb: number) {
  if (kb < 1024) return `~${Math.max(1, Math.round(kb))} KB`
  return `~${(kb / 1024).toFixed(1)} MB`
}

export function estimateExportFileSize(options: {
  sheetPreset: SheetPreset
  quality: ExportQuality
  format: ExportFormat
}) {
  const sheet = SHEET_DIMENSIONS_300DPI[options.sheetPreset]
  const qualityConfig = getQualityConfig(options.quality)
  const scaledWidth  = Math.round(sheet.widthPx  * qualityConfig.scale)
  const scaledHeight = Math.round(sheet.heightPx * qualityConfig.scale)
  const pixelCount   = scaledWidth * scaledHeight
  const jpgPerPixel  = options.quality === "low-data" ? 0.16 : 0.27
  const jpgBytes     = pixelCount * jpgPerPixel
  if (options.format === "jpg") return formatSizeKb(jpgBytes / 1024)
  const pdfBytes = jpgBytes * 1.1 + 110 * 1024
  return formatSizeKb(pdfBytes / 1024)
}

/**
 * Build the print-sheet canvas.
 *
 * FIX: all internal pixel math now uses canvasW/canvasH (scaled dimensions)
 * so the layout is correct for both "standard" (scale=1) and "low-data"
 * (scale=0.72) quality modes.
 */
export async function buildPrintSheetCanvas(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}): Promise<HTMLCanvasElement> {
  const { imageDataUrl, photoSpec, sheetPreset, quality = "standard" } = options
  const sheet        = SHEET_DIMENSIONS_300DPI[sheetPreset]
  const qualityConfig = getQualityConfig(quality)
  const image        = await loadImage(imageDataUrl)

  // Canvas dimensions after quality scale
  const canvasW = Math.round(sheet.widthPx  * qualityConfig.scale)
  const canvasH = Math.round(sheet.heightPx * qualityConfig.scale)

  const canvas = createCanvas(canvasW, canvasH)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context not available")

  // White sheet background — use actual canvas dims, not raw sheet dims
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvasW, canvasH)

  // Scale margins and gaps to match the canvas resolution
  const baseMargin = sheetPreset === "4x6" ? 48 : 72
  const baseGap    = sheetPreset === "4x6" ? 22 : 28
  const margin     = Math.round(baseMargin * qualityConfig.scale)
  const gap        = Math.round(baseGap    * qualityConfig.scale)
  const photoAspect = photoSpec.widthMm / photoSpec.heightMm

  // Grid computed against actual canvas dimensions
  const grid = getBestGrid(photoSpec.count, canvasW, canvasH, photoAspect, margin, gap)

  const totalGridWidth  = grid.cols * grid.tileWidth  + (grid.cols - 1) * gap
  const totalGridHeight = grid.rows * grid.tileHeight + (grid.rows - 1) * gap

  // Centre the grid on the canvas
  const startX = (canvasW - totalGridWidth)  / 2
  const startY = (canvasH - totalGridHeight) / 2

  for (let index = 0; index < photoSpec.count; index++) {
    const row = Math.floor(index / grid.cols)
    const col = index % grid.cols
    const x = startX + col * (grid.tileWidth  + gap)
    const y = startY + row * (grid.tileHeight + gap)

    ctx.save()
    ctx.beginPath()
    ctx.rect(x, y, grid.tileWidth, grid.tileHeight)
    ctx.clip()
    drawCoverImage(ctx, image, x, y, grid.tileWidth, grid.tileHeight)
    ctx.restore()

    // Thin border drawn outside the clip so it isn't cropped
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
  const canvas  = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  const label   = qualityConfig.label.toLowerCase().replace(" ", "-")
  triggerDownload(dataUrl, `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${label}.jpg`)
}

/**
 * PDF export — uses mm dimensions so the sheet is printed at the correct
 * physical size (A4 = 210×297 mm, 4×6 = 101.6×152.4 mm) at 300 DPI.
 *
 * FIX: was using unit:"px" which caused printers to interpret the sheet
 * at 72 DPI, making it ~4× too large on paper.
 */
export async function downloadSheetAsPdf(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
}) {
  const { quality = "standard" } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas  = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  const sheet   = SHEET_MM[options.sheetPreset]

  const { jsPDF } = await import("jspdf")

  // Physical dimensions in mm — printers will produce the correct physical size
  const isLandscape = canvas.width > canvas.height
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: isLandscape
      ? [sheet.heightMm, sheet.widthMm]   // jsPDF wants [w, h] for custom formats
      : [sheet.widthMm,  sheet.heightMm],
    compress: true,
  })

  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  pdf.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH, undefined, "FAST")

  const label = qualityConfig.label.toLowerCase().replace(" ", "-")
  pdf.save(`printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${label}.pdf`)
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
  const label  = qualityConfig.label.toLowerCase().replace(" ", "-")

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (fileBlob) => {
        if (!fileBlob) { reject(new Error("Could not create export file")); return }
        resolve(fileBlob)
      },
      "image/jpeg",
      qualityConfig.jpgQuality
    )
  })

  return new File(
    [blob],
    `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${label}.jpg`,
    { type: "image/jpeg" }
  )
}

export function getPresetDimensionsMm(
  preset: "passport" | "stamp" | "custom",
  customWidthMm: number,
  customHeightMm: number
) {
  if (preset === "passport") return { widthMm: 35,  heightMm: 45, label: "Passport 35 × 45 mm" }
  if (preset === "stamp")    return { widthMm: 25,  heightMm: 35, label: "Stamp 25 × 35 mm" }
  return { widthMm: customWidthMm, heightMm: customHeightMm, label: `Custom ${customWidthMm} × ${customHeightMm} mm` }
}

export function buildPrintInstructionMessage(options: {
  sizeLabel: string
  count: number
  sheetPreset: SheetPreset
}) {
  const sheetLabel = SHEET_MM[options.sheetPreset].label
  return [
    "Print instructions:",
    `Use ${sheetLabel} photo paper.`,
    `Photo size: ${options.sizeLabel}`,
    `Total photos on sheet: ${options.count}`,
    "Keep colours natural and use corner marks for clean trimming.",
    "",
    `Please print on ${sheetLabel} photo paper.`,
    `Photo size: ${options.sizeLabel}, ${options.count} photos per sheet.`,
    "Please keep colours natural and cut along the corner trim marks.",
    "Thank you.",
  ].join("\n")
}

// Backward-compatible alias
export const buildWhatsAppStudioMessage = buildPrintInstructionMessage

/** Download JPG with a custom file name */
export async function downloadSheetAsJpgWithNaming(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
  fileName?: string
}) {
  const { quality = "standard", fileName } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas  = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  const label   = qualityConfig.label.toLowerCase().replace(" ", "-")
  const defaultName = `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${label}.jpg`
  triggerDownload(dataUrl, fileName || defaultName)
}

/** Download PDF with a custom file name — correct physical mm dimensions */
export async function downloadSheetAsPdfWithNaming(options: {
  imageDataUrl: string
  photoSpec: ExportPhotoSpec
  sheetPreset: SheetPreset
  quality?: ExportQuality
  fileName?: string
}) {
  const { quality = "standard", fileName } = options
  const qualityConfig = getQualityConfig(quality)
  const canvas  = await buildPrintSheetCanvas(options)
  const dataUrl = canvas.toDataURL("image/jpeg", qualityConfig.jpgQuality)
  const sheet   = SHEET_MM[options.sheetPreset]

  const { jsPDF } = await import("jspdf")

  const isLandscape = canvas.width > canvas.height
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: isLandscape
      ? [sheet.heightMm, sheet.widthMm]
      : [sheet.widthMm,  sheet.heightMm],
    compress: true,
  })

  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  pdf.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH, undefined, "FAST")

  const label = qualityConfig.label.toLowerCase().replace(" ", "-")
  const defaultName = `printify-${options.sheetPreset}-${options.photoSpec.count}-photos-${label}.pdf`
  pdf.save(fileName || defaultName)
}
