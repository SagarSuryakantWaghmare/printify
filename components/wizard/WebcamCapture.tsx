"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Camera, 
  FlipHorizontal, 
  X, 
  Circle, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Timer,
  Maximize2,
  Sun,
  UserRound,
  AlertTriangle,
} from "lucide-react"
import { startRealtimeFaceDetection, calculateComplianceScore, type FaceDetectionResult } from "@/lib/face-detection"

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

type CameraState = "requesting" | "ready" | "countdown" | "captured" | "error"

const COUNTDOWN_SECONDS = 3

const TIPS = [
  { icon: Sun, text: "Find good lighting" },
  { icon: UserRound, text: "Center your face" },
]

export function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [cameraState, setCameraState] = useState<CameraState>("requesting")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  
  // Face detection state
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null)
  const [complianceScore, setComplianceScore] = useState(0)

  // Check for multiple cameras
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      const videoInputs = devices.filter(d => d.kind === "videoinput")
      setHasMultipleCameras(videoInputs.length > 1)
    }).catch(() => {})
  }, [])

  // Real-time face detection
  useEffect(() => {
    if (cameraState !== "ready" || !videoRef.current) return

    const cleanup = startRealtimeFaceDetection(
      videoRef.current,
      (result) => {
        setFaceResult(result)
        setComplianceScore(calculateComplianceScore(result))
      },
      300 // Check every 300ms
    )

    return cleanup
  }, [cameraState])

  // Start camera stream
  const startCamera = useCallback(async () => {
    setCameraState("requesting")
    setErrorMessage("")
    setFaceResult(null)

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraState("ready")
      }
    } catch (err) {
      console.error("Camera error:", err)
      setCameraState("error")
      
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setErrorMessage("Camera access denied. Please allow camera permissions in your browser settings.")
            break
          case "NotFoundError":
            setErrorMessage("No camera found. Please connect a camera and try again.")
            break
          case "NotReadableError":
            setErrorMessage("Camera is in use by another application. Please close other apps using the camera.")
            break
          default:
            setErrorMessage("Could not access camera. Please check your camera settings.")
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    }
  }, [facingMode])

  // Initialize camera on mount
  useEffect(() => {
    startCamera()
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [startCamera])

  // Handle countdown
  useEffect(() => {
    if (cameraState !== "countdown") return

    if (countdown === 0) {
      capturePhoto()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [cameraState, countdown])

  const startCountdown = () => {
    setCountdown(COUNTDOWN_SECONDS)
    setCameraState("countdown")
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Mirror for front camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0)
    
    const imageData = canvas.toDataURL("image/jpeg", 0.92)
    setCapturedImage(imageData)
    setCameraState("captured")

    // Stop the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [facingMode])

  const handleInstantCapture = () => {
    capturePhoto()
  }

  const handleRetake = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }

  // Re-start camera when facing mode changes
  useEffect(() => {
    if (cameraState === "ready" || cameraState === "requesting") {
      startCamera()
    }
  }, [facingMode])

  // Get status color based on compliance score
  const getScoreColor = () => {
    if (complianceScore >= 80) return "text-[#1D9E75]"
    if (complianceScore >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBgColor = () => {
    if (complianceScore >= 80) return "bg-[#1D9E75]/20"
    if (complianceScore >= 50) return "bg-yellow-400/20"
    return "bg-red-400/20"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 touch-target"
        >
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-white font-semibold text-lg">Take Photo</h2>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Error State */}
        {cameraState === "error" && (
          <div className="text-center text-white px-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-semibold mb-2">Camera Error</p>
            <p className="text-sm text-white/70 mb-6">{errorMessage}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={startCamera} className="bg-white text-black hover:bg-white/90">
                Try Again
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {cameraState === "requesting" && (
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
            <p className="text-lg">Accessing camera...</p>
            <p className="text-sm text-white/60 mt-2">Please allow camera access when prompted</p>
          </div>
        )}

        {/* Video Feed */}
        {(cameraState === "ready" || cameraState === "countdown") && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
            
            {/* Face guide overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Oval guide with dynamic border color */}
              <div 
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 sm:w-56 sm:h-72 border-2 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] transition-colors duration-300 ${
                  faceResult?.isValid ? "border-[#1D9E75]" : faceResult?.detected ? "border-yellow-400" : "border-white/50"
                }`} 
              />
              
              {/* Face detection feedback */}
              {faceResult && cameraState === "ready" && (
                <div className="absolute top-4 left-0 right-0 flex justify-center px-4">
                  <div className={`${getScoreBgColor()} backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2`}>
                    {faceResult.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-[#1D9E75]" />
                    ) : faceResult.detected ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${getScoreColor()}`}>
                      {faceResult.isValid 
                        ? "Ready to capture!" 
                        : faceResult.recommendations[0] || "Position your face in the oval"}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Compliance score indicator */}
              {faceResult?.detected && cameraState === "ready" && (
                <div className="absolute top-16 left-0 right-0 flex justify-center">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          complianceScore >= 80 ? "bg-[#1D9E75]" : complianceScore >= 50 ? "bg-yellow-400" : "bg-red-400"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${complianceScore}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${getScoreColor()}`}>{complianceScore}%</span>
                  </div>
                </div>
              )}
              
              {/* Tips */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                {TIPS.map((tip, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs">
                    <tip.icon className="h-3.5 w-3.5" />
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Countdown overlay */}
            {cameraState === "countdown" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40"
              >
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-9xl font-bold text-white drop-shadow-lg"
                >
                  {countdown}
                </motion.div>
              </motion.div>
            )}
          </>
        )}

        {/* Captured Image Preview */}
        {cameraState === "captured" && capturedImage && (
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-6 safe-bottom bg-gradient-to-t from-black to-transparent">
        {cameraState === "ready" && (
          <div className="flex items-center justify-center gap-6">
            {/* Timer capture */}
            <Button
              variant="ghost"
              size="icon"
              onClick={startCountdown}
              className="text-white hover:bg-white/20 h-14 w-14 rounded-full"
            >
              <Timer className="h-6 w-6" />
            </Button>

            {/* Main capture button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleInstantCapture}
              className={`relative h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                faceResult?.isValid ? "bg-[#1D9E75]" : "bg-white"
              }`}
            >
              <div className={`absolute inset-2 rounded-full border-4 ${
                faceResult?.isValid ? "border-white/30" : "border-black/10"
              }`} />
              {faceResult?.isValid ? (
                <CheckCircle2 className="h-10 w-10 text-white" />
              ) : (
                <Circle className="h-16 w-16 text-black/10 fill-current" />
              )}
            </motion.button>

            {/* Flip camera */}
            {hasMultipleCameras && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCamera}
                className="text-white hover:bg-white/20 h-14 w-14 rounded-full"
              >
                <FlipHorizontal className="h-6 w-6" />
              </Button>
            )}
            {!hasMultipleCameras && <div className="w-14" />}
          </div>
        )}

        {cameraState === "countdown" && (
          <div className="flex justify-center">
            <Button
              onClick={() => { setCameraState("ready"); setCountdown(COUNTDOWN_SECONDS) }}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        )}

        {cameraState === "captured" && (
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 max-w-32 h-12 rounded-xl border-white/30 text-white bg-white/10 hover:bg-white/20"
            >
              Retake
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 max-w-40 h-12 rounded-xl bg-[#1D9E75] hover:bg-[#178D67] text-white font-semibold"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Use Photo
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
