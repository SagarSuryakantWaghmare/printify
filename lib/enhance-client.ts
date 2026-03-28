/**
 * Client-side image enhancement using canvas convolution.
 * Applies an unsharp mask (sharpen) + subtle contrast boost.
 * No API calls — runs entirely in the browser, always works.
 */

/** Load a data-URL into an HTMLImageElement */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = dataUrl
    })
}

/**
 * Apply a 3×3 convolution kernel to ImageData in-place.
 * Returns new pixel array (does not mutate input).
 */
function convolve(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    kernel: number[],  // 3×3 row-major
    divisor = 1,
    bias = 0
): Uint8ClampedArray {
    const result = new Uint8ClampedArray(data.length)
    const kw = 3

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const sy = Math.min(Math.max(y + ky, 0), height - 1)
                    const sx = Math.min(Math.max(x + kx, 0), width - 1)
                    const si = (sy * width + sx) * 4
                    const ki = (ky + 1) * kw + (kx + 1)
                    r += data[si] * kernel[ki]
                    g += data[si + 1] * kernel[ki]
                    b += data[si + 2] * kernel[ki]
                }
            }
            const di = (y * width + x) * 4
            result[di] = Math.min(255, Math.max(0, r / divisor + bias))
            result[di + 1] = Math.min(255, Math.max(0, g / divisor + bias))
            result[di + 2] = Math.min(255, Math.max(0, b / divisor + bias))
            result[di + 3] = data[di + 3] // preserve alpha
        }
    }
    return result
}

/**
 * Boost contrast & brightness pixel-by-pixel.
 * contrast: 0 = none, 1 = double. brightness: negative darkens.
 */
function adjustContrastBrightness(
    data: Uint8ClampedArray,
    contrast: number,   // e.g. 0.08
    brightness: number  // e.g. 6  (out of 255)
): Uint8ClampedArray {
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))
    const result = new Uint8ClampedArray(data.length)
    for (let i = 0; i < data.length; i += 4) {
        result[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + brightness))
        result[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + brightness))
        result[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + brightness))
        result[i + 3] = data[i + 3]
    }
    return result
}

/**
 * Enhances a photo data-URL client-side:
 *  1. Unsharp-mask sharpen (edges become crisper without AI artifacts)
 *  2. Subtle contrast + brightness boost for vibrant print output
 *
 * Returns a new data-URL (JPEG quality 0.96).
 */
export async function enhanceClientSide(dataUrl: string): Promise<string> {
    const img = await loadImage(dataUrl)

    const canvas = document.createElement("canvas")
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { data, width, height } = imageData

    // --- Step 1: Sharpen via unsharp kernel ---
    // Standard sharpening kernel  (centre = 5, neighbours = -1)
    const sharpened = convolve(
        data, width, height,
        [0, -1, 0,
            -1, 5, -1,
            0, -1, 0],
        1, 0
    )

    // --- Step 2: Contrast & brightness ---
    const boosted = adjustContrastBrightness(sharpened, 0.06, 5)

    // Write result back — copy into a plain ArrayBuffer to satisfy TS overload
    const plainBuffer = new ArrayBuffer(boosted.byteLength)
    new Uint8ClampedArray(plainBuffer).set(boosted)
    const outImageData = new ImageData(new Uint8ClampedArray(plainBuffer), width, height)
    ctx.putImageData(outImageData, 0, 0)

    return canvas.toDataURL("image/jpeg", 0.96)
}
