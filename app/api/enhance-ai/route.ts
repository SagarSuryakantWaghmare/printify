import { NextRequest, NextResponse } from "next/server"

/**
 * Free AI photo enhancement using Hugging Face Inference API.
 * Model: eugenesiow/super-image (SwinIR super-resolution)
 * - Sharpens + upscales the image
 * - Does NOT change face, clothes, or composition
 * - 100% free with a Hugging Face account
 *
 * Get free token: https://huggingface.co/settings/tokens
 * Add to .env: HF_API_TOKEN=hf_...
 */

const HF_MODEL = "eugenesiow/super-image"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { imageDataUrl } = body as { imageDataUrl: string }

        if (!imageDataUrl) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 })
        }

        const hfToken = process.env.HF_API_TOKEN

        // Graceful fallback — no HF token, return original
        if (!hfToken || hfToken === "hf_your_token_here") {
            return NextResponse.json({
                resultDataUrl: imageDataUrl,
                fallback: true,
                reason: "No HF_API_TOKEN in .env — skipping AI enhancement",
            })
        }

        // Convert data URL to binary buffer
        const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "")
        const imageBuffer = Buffer.from(base64Data, "base64")

        // Call HF Inference API — super-resolution model
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${hfToken}`,
                    "Content-Type": "application/octet-stream",
                },
                body: imageBuffer,
                signal: AbortSignal.timeout(60_000), // 60s timeout
            }
        )

        if (!response.ok) {
            // Model might be loading — 503 is common on cold start
            if (response.status === 503) {
                return NextResponse.json({
                    resultDataUrl: imageDataUrl,
                    fallback: true,
                    reason: "HF model is loading (cold start). Try again in 30 seconds.",
                })
            }
            const errText = await response.text()
            console.error("HF enhance error:", errText)
            return NextResponse.json({
                resultDataUrl: imageDataUrl,
                fallback: true,
                reason: `HF API error: ${response.status}`,
            })
        }

        const resultBuffer = await response.arrayBuffer()
        const resultBase64 = Buffer.from(resultBuffer).toString("base64")
        const resultDataUrl = `data:image/jpeg;base64,${resultBase64}`

        return NextResponse.json({ resultDataUrl, fallback: false })
    } catch (err) {
        console.error("enhance-ai route error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
