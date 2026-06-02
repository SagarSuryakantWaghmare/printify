import { NextRequest, NextResponse } from "next/server"

/**
 * Free AI photo enhancement using Hugging Face Inference API.
 * Model: CompVis/ldm-super-resolution-4x-openimages (SwinIR super-resolution)
 * - Sharpens + upscales the image 4×
 * - Does NOT change face, clothes, or composition
 * - 100% free with a Hugging Face account
 *
 * Get free token: https://huggingface.co/settings/tokens
 * Add to .env.local: HF_API_TOKEN=hf_...
 */
const HF_MODEL = "CompVis/ldm-super-resolution-4x-openimages"

const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp|jpg));base64,/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageDataUrl } = body as { imageDataUrl?: string }

    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const mimeMatch = DATA_URL_RE.exec(imageDataUrl)
    if (!mimeMatch) {
      return NextResponse.json({ error: "Invalid image data URL" }, { status: 400 })
    }

    const hfToken = process.env.HF_API_TOKEN

    // Graceful fallback — no HF token, return original unchanged
    if (!hfToken || hfToken === "hf_your_token_here") {
      return NextResponse.json({
        resultDataUrl: imageDataUrl,
        fallback: true,
        reason: "No HF_API_TOKEN in .env.local — skipping AI enhancement",
      })
    }

    const base64Data  = imageDataUrl.slice(mimeMatch[0].length)
    const imageBuffer = Buffer.from(base64Data, "base64")

    // Call HF Inference API — 90s timeout (LDM model can be slow on cold start)
    let response: Response
    try {
      response = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/octet-stream",
          },
          body: imageBuffer,
          signal: AbortSignal.timeout(90_000),
        }
      )
    } catch (fetchErr) {
      const isTimeout = fetchErr instanceof Error && fetchErr.name === "TimeoutError"
      console.error("HF enhance-ai fetch error:", fetchErr)
      return NextResponse.json({
        resultDataUrl: imageDataUrl,
        fallback: true,
        reason: isTimeout ? "HF model timed out." : "Network error reaching Hugging Face.",
      })
    }

    if (!response.ok) {
      // 503 = model loading (cold start) — tell client to retry
      if (response.status === 503) {
        return NextResponse.json({
          resultDataUrl: imageDataUrl,
          fallback: true,
          reason: "HF model is warming up (cold start). Try again in ~30 seconds.",
        })
      }
      const errText = await response.text().catch(() => "")
      console.error(`HF enhance-ai error (${response.status}):`, errText)
      return NextResponse.json({
        resultDataUrl: imageDataUrl,
        fallback: true,
        reason: `HF API error ${response.status}`,
      })
    }

    const resultBuffer = await response.arrayBuffer()
    const resultBase64  = Buffer.from(resultBuffer).toString("base64")

    // LDM super-resolution returns PNG — detect actual content-type from response headers
    const contentType   = response.headers.get("content-type") ?? "image/png"
    const outputMime    = contentType.startsWith("image/") ? contentType.split(";")[0].trim() : "image/png"
    const resultDataUrl = `data:${outputMime};base64,${resultBase64}`

    return NextResponse.json({ resultDataUrl, fallback: false })
  } catch (err) {
    console.error("enhance-ai route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
