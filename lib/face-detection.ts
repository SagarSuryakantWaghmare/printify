/**
 * Face Detection Library
 * 
 * Uses the browser's built-in FaceDetector API when available,
 * with a graceful fallback for browsers that don't support it.
 * 
 * Features:
 * - Real-time face detection for webcam capture
 * - Single photo validation
 * - Face position and size analysis
 * - Quality recommendations
 */

export interface FaceDetectionResult {
  detected: boolean
  faceCount: number
  faces: DetectedFace[]
  recommendations: string[]
  isValid: boolean
}

export interface DetectedFace {
  x: number
  y: number
  width: number
  height: number
  centerX: number
  centerY: number
  // Relative to image dimensions (0-1)
  relativeWidth: number
  relativeHeight: number
  relativeCenterX: number
  relativeCenterY: number
}

export interface FaceValidationConfig {
  // Minimum face size as percentage of image width
  minFaceSize?: number
  // Maximum face size as percentage of image width
  maxFaceSize?: number
  // How centered the face should be (0-0.5, 0 = exactly centered)
  maxCenterOffset?: number
  // Whether multiple faces are allowed
  allowMultipleFaces?: boolean
}

const DEFAULT_CONFIG: FaceValidationConfig = {
  minFaceSize: 0.15, // Face should be at least 15% of image width
  maxFaceSize: 0.85, // Face should be at most 85% of image width
  maxCenterOffset: 0.25, // Face center should be within 25% of image center
  allowMultipleFaces: false,
}

// Check if FaceDetector API is available
function isFaceDetectorSupported(): boolean {
  return typeof window !== "undefined" && "FaceDetector" in window
}

/**
 * Detect faces in an image using the browser's FaceDetector API
 */
export async function detectFaces(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap | HTMLVideoElement,
  config: FaceValidationConfig = {}
): Promise<FaceDetectionResult> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Get image dimensions
  let width: number, height: number
  if (imageSource instanceof HTMLImageElement) {
    width = imageSource.naturalWidth
    height = imageSource.naturalHeight
  } else if (imageSource instanceof HTMLCanvasElement) {
    width = imageSource.width
    height = imageSource.height
  } else if (imageSource instanceof HTMLVideoElement) {
    width = imageSource.videoWidth
    height = imageSource.videoHeight
  } else {
    width = imageSource.width
    height = imageSource.height
  }

  // If FaceDetector is not supported, return a placeholder result
  if (!isFaceDetectorSupported()) {
    return {
      detected: false,
      faceCount: 0,
      faces: [],
      recommendations: ["Face detection not available in this browser. Please ensure your face is clearly visible and centered."],
      isValid: true, // Allow proceeding without face detection
    }
  }

  try {
    // @ts-expect-error - FaceDetector is not in TypeScript types
    const detector = new FaceDetector({ fastMode: false, maxDetectedFaces: 5 })
    const detectedFaces = await detector.detect(imageSource)

    const faces: DetectedFace[] = detectedFaces.map((face: { boundingBox: DOMRectReadOnly }) => {
      const { x, y, width: faceWidth, height: faceHeight } = face.boundingBox
      return {
        x,
        y,
        width: faceWidth,
        height: faceHeight,
        centerX: x + faceWidth / 2,
        centerY: y + faceHeight / 2,
        relativeWidth: faceWidth / width,
        relativeHeight: faceHeight / height,
        relativeCenterX: (x + faceWidth / 2) / width,
        relativeCenterY: (y + faceHeight / 2) / height,
      }
    })

    const recommendations: string[] = []
    let isValid = true

    // Check face count
    if (faces.length === 0) {
      recommendations.push("No face detected. Please ensure your face is clearly visible and well-lit.")
      isValid = false
    } else if (faces.length > 1 && !mergedConfig.allowMultipleFaces) {
      recommendations.push("Multiple faces detected. Passport photos should contain only one person.")
      isValid = false
    }

    // Analyze the primary face (largest one)
    if (faces.length > 0) {
      const primaryFace = faces.reduce((largest, face) => 
        face.relativeWidth > largest.relativeWidth ? face : largest
      , faces[0])

      // Check face size
      if (primaryFace.relativeWidth < mergedConfig.minFaceSize!) {
        recommendations.push("Your face appears too small. Please move closer to the camera.")
        isValid = false
      } else if (primaryFace.relativeWidth > mergedConfig.maxFaceSize!) {
        recommendations.push("Your face appears too large. Please move back from the camera.")
        isValid = false
      }

      // Check face centering
      const horizontalOffset = Math.abs(primaryFace.relativeCenterX - 0.5)
      const verticalOffset = Math.abs(primaryFace.relativeCenterY - 0.5)
      
      if (horizontalOffset > mergedConfig.maxCenterOffset!) {
        if (primaryFace.relativeCenterX < 0.5) {
          recommendations.push("Please move slightly to the right to center your face.")
        } else {
          recommendations.push("Please move slightly to the left to center your face.")
        }
        isValid = false
      }

      if (verticalOffset > mergedConfig.maxCenterOffset!) {
        if (primaryFace.relativeCenterY < 0.5) {
          recommendations.push("Please move slightly down to center your face vertically.")
        } else {
          recommendations.push("Please move slightly up to center your face vertically.")
        }
        isValid = false
      }

      // Vertical centering - face should be in upper half
      if (primaryFace.relativeCenterY > 0.6) {
        recommendations.push("Please raise the camera or lower your position.")
        isValid = false
      } else if (primaryFace.relativeCenterY < 0.3) {
        recommendations.push("Please lower the camera or raise your position.")
        isValid = false
      }

      // Face aspect ratio check (should be roughly oval/vertical)
      const aspectRatio = primaryFace.relativeHeight / primaryFace.relativeWidth
      if (aspectRatio < 1.0) {
        recommendations.push("Please look directly at the camera, not tilted.")
      }
    }

    // Add positive feedback if valid
    if (isValid && faces.length === 1) {
      recommendations.push("✓ Face detected and positioned correctly!")
    }

    return {
      detected: faces.length > 0,
      faceCount: faces.length,
      faces,
      recommendations,
      isValid,
    }
  } catch (error) {
    console.error("Face detection error:", error)
    return {
      detected: false,
      faceCount: 0,
      faces: [],
      recommendations: ["Unable to analyze face. Please ensure good lighting and a clear view of your face."],
      isValid: true, // Allow proceeding on error
    }
  }
}

/**
 * Detect faces from a base64 image string
 */
export async function detectFacesFromBase64(
  base64Image: string,
  config: FaceValidationConfig = {}
): Promise<FaceDetectionResult> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = async () => {
      const result = await detectFaces(img, config)
      resolve(result)
    }
    img.onerror = () => {
      resolve({
        detected: false,
        faceCount: 0,
        faces: [],
        recommendations: ["Failed to load image for face detection."],
        isValid: false,
      })
    }
    img.src = base64Image
  })
}

/**
 * Real-time face detection for video element (webcam)
 * Returns a cleanup function to stop detection
 */
export function startRealtimeFaceDetection(
  videoElement: HTMLVideoElement,
  onResult: (result: FaceDetectionResult) => void,
  intervalMs: number = 500,
  config: FaceValidationConfig = {}
): () => void {
  let isActive = true
  let timeoutId: ReturnType<typeof setTimeout>

  async function detect() {
    if (!isActive) return

    if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
      const result = await detectFaces(videoElement, config)
      if (isActive) {
        onResult(result)
      }
    }

    if (isActive) {
      timeoutId = setTimeout(detect, intervalMs)
    }
  }

  detect()

  return () => {
    isActive = false
    clearTimeout(timeoutId)
  }
}

/**
 * Calculate passport photo compliance score (0-100)
 */
export function calculateComplianceScore(result: FaceDetectionResult): number {
  if (!result.detected || result.faces.length === 0) {
    return 0
  }

  let score = 100
  const primaryFace = result.faces[0]

  // Deduct for multiple faces
  if (result.faceCount > 1) {
    score -= 30
  }

  // Score based on face size (optimal is 20-40% of image width)
  const sizeScore = primaryFace.relativeWidth
  if (sizeScore < 0.15) {
    score -= 20 * (0.15 - sizeScore) / 0.15
  } else if (sizeScore > 0.6) {
    score -= 20 * (sizeScore - 0.6) / 0.4
  }

  // Score based on horizontal centering
  const hOffset = Math.abs(primaryFace.relativeCenterX - 0.5)
  score -= hOffset * 40 // Up to 20 points off for being off-center

  // Score based on vertical positioning (face center should be around 0.4-0.5)
  const vOffset = Math.abs(primaryFace.relativeCenterY - 0.45)
  score -= vOffset * 30 // Up to 15 points off for bad vertical positioning

  return Math.max(0, Math.min(100, Math.round(score)))
}
