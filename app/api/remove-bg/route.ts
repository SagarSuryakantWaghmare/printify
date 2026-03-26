import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageDataUrl } = body as { imageDataUrl: string }

    if (!imageDataUrl) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const apiKey = process.env.REMOVE_BG_API_KEY

    // Graceful fallback: if no API key, return original image
    if (!apiKey || apiKey === "your_key_here") {
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    // Convert data URL to binary buffer
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, "")
    const imageBuffer = Buffer.from(base64Data, "base64")

    const formData = new FormData()
    formData.append(
      "image_file",
      new Blob([imageBuffer], { type: "image/jpeg" }),
      "photo.jpg"
    )
    formData.append("size", "regular")
    formData.append("bg_color", "ffffff") // White background

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("remove.bg error:", errorText)
      // Fallback to original on API error
      return NextResponse.json({ resultDataUrl: imageDataUrl, fallback: true })
    }

    const resultBuffer = await response.arrayBuffer()
    const resultBase64 = Buffer.from(resultBuffer).toString("base64")
    const resultDataUrl = `data:image/png;base64,${resultBase64}`

    return NextResponse.json({ resultDataUrl, fallback: false })
  } catch (error) {
    console.error("remove-bg route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
