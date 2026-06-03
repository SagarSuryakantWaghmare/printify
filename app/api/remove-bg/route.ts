import { NextRequest, NextResponse } from "next/server"

/** Matches data:image/jpeg;base64, or data:image/png;base64, etc. */
const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp|jpg));base64,/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageDataUrl } = body as { imageDataUrl?: string }

    // ── Input validation ────────────────────────────────────────────────────
    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const mimeMatch = DATA_URL_RE.exec(imageDataUrl)
    if (!mimeMatch) {
      return NextResponse.json(
        { error: "Invalid image format. Must be a JPEG, PNG, or WebP data URL." },
        { status: 400 }
      )
    }
    const mimeType = mimeMatch[1] // e.g. "image/jpeg"

    const apiKey = process.env.REMOVE_BG_API_KEY

    // Graceful fallback: no API key configured — pass through original image
    if (!apiKey || apiKey === "your_key_here") {
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    // ── Build request ───────────────────────────────────────────────────────
    const base64Data  = imageDataUrl.slice(mimeMatch[0].length)
    const imageBuffer = Buffer.from(base64Data, "base64")

    const formData = new FormData()
    formData.append(
      "image_file",
      new Blob([imageBuffer], { type: mimeType }),
      `photo.${mimeType.split("/")[1]}`
    )
    formData.append("size", "regular")
    // Do NOT force bg_color — we want transparent PNG back for the crop step
    formData.append("type", "person")  // hint: subject is a person → better edge detection

    // ── Call remove.bg with a 25s timeout ───────────────────────────────────
    let response: Response
    try {
      response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": apiKey },
        body: formData,
        signal: AbortSignal.timeout(25_000),
      })
    } catch (fetchErr) {
      const isTimeout = fetchErr instanceof Error && fetchErr.name === "TimeoutError"
      console.error("remove.bg fetch error:", fetchErr)
      return NextResponse.json(
        { error: isTimeout ? "Background removal timed out. Please try again." : "Network error reaching remove.bg." },
        { status: 504 }
      )
    }

    // ── Handle API error codes specifically ────────────────────────────────
    if (!response.ok) {
      const errorText = await response.text().catch(() => "")

      if (response.status === 401) {
        console.error("remove.bg: invalid API key")
        return NextResponse.json({ error: "Background removal API key is invalid." }, { status: 502 })
      }
      if (response.status === 402) {
        console.error("remove.bg: credits exhausted")
        return NextResponse.json({ error: "Background removal credits exhausted. Please check your remove.bg account." }, { status: 502 })
      }
      if (response.status === 429) {
        console.error("remove.bg: rate limited")
        return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 })
      }

      console.error(`remove.bg error (${response.status}):`, errorText)
      // Generic fallback for other 4xx/5xx — return original so user isn't stuck
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    // ── Success — return transparent PNG ───────────────────────────────────
    const resultBuffer = await response.arrayBuffer()
    const resultBase64  = Buffer.from(resultBuffer).toString("base64")
    const resultDataUrl = `data:image/png;base64,${resultBase64}`

    return NextResponse.json({ resultDataUrl, fallback: false })
  } catch (error) {
    console.error("remove-bg route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
