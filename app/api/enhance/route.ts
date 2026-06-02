import { NextRequest, NextResponse } from "next/server"

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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey    = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    // Graceful fallback: no Cloudinary config — return original unchanged
    if (!cloudName || !apiKey || !apiSecret || cloudName === "your_cloud") {
      return NextResponse.json({
        resultDataUrl: imageDataUrl,
        fallback: true,
        message: "No Cloudinary config — using original photo",
      })
    }

    const base64Data  = imageDataUrl.slice(mimeMatch[0].length)
    const timestamp   = Math.round(Date.now() / 1000)

    // Transformation: auto-improve, sharpen, brightness/contrast boost,
    // white bg, face-gravity crop to Indian passport ratio (35:45)
    const transformation = [
      "e_improve",
      "e_sharpen:60",
      "e_brightness_contrast:8:12",
      "b_white",
      "ar_35:45",
      "c_fill",
      "g_face",
      "w_1050",
      "h_1350",
    ].join(",")

    const paramsToSign = `timestamp=${timestamp}&transformation=${transformation}&upload_preset=passport_enhance`
    const crypto    = await import("crypto")
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex")

    const uploadFormData = new FormData()
    uploadFormData.append("file", `data:image/png;base64,${base64Data}`)
    uploadFormData.append("api_key", apiKey)
    uploadFormData.append("timestamp", String(timestamp))
    uploadFormData.append("signature", signature)
    uploadFormData.append("transformation", transformation)

    // Upload with 30s timeout
    let uploadRes: Response
    try {
      uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadFormData,
          signal: AbortSignal.timeout(30_000),
        }
      )
    } catch (fetchErr) {
      const isTimeout = fetchErr instanceof Error && fetchErr.name === "TimeoutError"
      console.error("Cloudinary upload error:", fetchErr)
      return NextResponse.json({
        resultDataUrl: imageDataUrl,
        fallback: true,
        message: isTimeout ? "Cloudinary timed out." : "Network error reaching Cloudinary.",
      })
    }

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "")
      console.error(`Cloudinary upload error (${uploadRes.status}):`, errText)
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    const uploadJson = await uploadRes.json()
    const resultUrl: string = uploadJson.secure_url

    // Fetch the enhanced image and proxy it back to avoid CORS issues
    let enhancedRes: Response
    try {
      enhancedRes = await fetch(resultUrl, { signal: AbortSignal.timeout(15_000) })
    } catch {
      console.error("Failed to fetch enhanced image from Cloudinary")
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    const enhancedBuffer = await enhancedRes.arrayBuffer()
    const enhancedBase64  = Buffer.from(enhancedBuffer).toString("base64")
    const resultDataUrl   = `data:image/jpeg;base64,${enhancedBase64}`

    return NextResponse.json({ resultDataUrl, fallback: false })
  } catch (error) {
    console.error("enhance route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
