import type { BgColor } from "@/lib/hooks/useWizard"

/** Load an image URL into an HTMLImageElement */
export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = src
    })
}

/** Convert a Blob to a base64 data URL */
export function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

/** Convert a File/Blob to a base64 data URL */
export function fileToDataUrl(file: File): Promise<string> {
    return blobToDataUrl(file)
}

/**
 * Apply a background color behind a transparent PNG,
 * then center-crop to the target aspect ratio (widthMm / heightMm),
 * and apply mild enhancement (brightness + contrast + saturation).
 * Returns a JPEG data URL.
 */
export function applyBgAndCrop(options: {
    transparentDataUrl: string
    bgColor: BgColor
    widthMm: number
    heightMm: number
    outputWidth?: number
}): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            const targetAspect = options.widthMm / options.heightMm
            const outputW = options.outputWidth ?? 1050
            const outputH = Math.round(outputW / targetAspect)

            const canvas = document.createElement("canvas")
            canvas.width = outputW
            canvas.height = outputH
            const ctx = canvas.getContext("2d")!

            // Fill background color
            const colorMap: Record<BgColor, string> = {
                white: "#ffffff",
                black: "#1a1a1a",
                red: "#c0392b",
            }
            ctx.fillStyle = colorMap[options.bgColor]
            ctx.fillRect(0, 0, outputW, outputH)

            // Center-crop the image to fit outputW × outputH (cover)
            const imgAspect = img.width / img.height
            let sx = 0, sy = 0, sw = img.width, sh = img.height

            if (imgAspect > targetAspect) {
                // Image is wider than target — crop sides
                sw = Math.round(img.height * targetAspect)
                sx = Math.round((img.width - sw) / 2)
            } else {
                // Image is taller — keep top (face is usually near top), crop bottom
                sh = Math.round(img.width / targetAspect)
                sy = Math.round((img.height - sh) * 0.15) // slight top-bias for faces
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outputW, outputH)

            // Mild enhancement via pixel manipulation
            const imageData = ctx.getImageData(0, 0, outputW, outputH)
            const data = imageData.data
            const brightness = 8      // -255 to 255
            const contrast = 15       // -255 to 255
            const saturation = 0.12   // 0 = grey, 1 = original, >1 = more saturated

            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

            for (let i = 0; i < data.length; i += 4) {
                let r = data[i], g = data[i + 1], b = data[i + 2]

                // Brightness
                r += brightness; g += brightness; b += brightness

                // Contrast
                r = factor * (r - 128) + 128
                g = factor * (g - 128) + 128
                b = factor * (b - 128) + 128

                // Saturation — convert to HSL and boost S
                const max = Math.max(r, g, b), min = Math.min(r, g, b)
                const lum = (max + min) / 2 / 255
                if (max !== min) {
                    const factor2 = 1 + saturation * (1 - 2 * Math.abs(lum - 0.5)) * 0.5
                    r = 128 + (r - 128) * factor2
                    g = 128 + (g - 128) * factor2
                    b = 128 + (b - 128) * factor2
                }

                data[i] = Math.min(255, Math.max(0, r))
                data[i + 1] = Math.min(255, Math.max(0, g))
                data[i + 2] = Math.min(255, Math.max(0, b))
            }
            ctx.putImageData(imageData, 0, 0)

            resolve(canvas.toDataURL("image/jpeg", 0.95))
        }
        img.onerror = reject
        img.src = options.transparentDataUrl
    })
}

/**
 * Quick composite: transparent PNG + bg color, no enhancement, no crop.
 * Used for real-time BG color preview in PreviewStep.
 */
export function compositeWithBg(options: {
    transparentDataUrl: string
    bgColor: BgColor
    width: number
    height: number
}): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = options.width
            canvas.height = options.height
            const ctx = canvas.getContext("2d")!

            const colorMap: Record<BgColor, string> = {
                white: "#ffffff",
                black: "#1a1a1a",
                red: "#c0392b",
            }
            ctx.fillStyle = colorMap[options.bgColor]
            ctx.fillRect(0, 0, options.width, options.height)
            ctx.drawImage(img, 0, 0, options.width, options.height)

            resolve(canvas.toDataURL("image/jpeg", 0.92))
        }
        img.onerror = reject
        img.src = options.transparentDataUrl
    })
}
