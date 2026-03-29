/**
 * Custom SVG Icons Component Library
 * Replaces emoji usage with proper scalable SVG icons
 * All icons are fully responsive and sized for their context
 */

interface IconProps {
  className?: string
  size?: number | string
  strokeWidth?: number
  fill?: string
  stroke?: string
}

// Checkmark success icon
export const CheckIcon = ({
  className = "w-5 h-5",
  stroke = "#10B981",
  strokeWidth = 2.5,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Checkmark in circle (success indicator)
export const CheckCircleIcon = ({
  className = "w-5 h-5",
  fill = "#10B981",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <circle cx="12" cy="12" r="11" fill="none" stroke={fill} strokeWidth="2" />
    <path
      d="M7 12.5l3 3 7-7"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Passport icon
export const PassportIcon = ({
  className = "w-6 h-6",
  fill = "#1F2937",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <rect x="3" y="2" width="18" height="20" rx="2" ry="2" fill="none" stroke={fill} strokeWidth="2" />
    <circle cx="12" cy="9" r="3" fill="none" stroke={fill} strokeWidth="2" />
    <path d="M7 17c0-2.5 2.5-4 5-4s5 1.5 5 4" fill="none" stroke={fill} strokeWidth="2" />
    <line x1="6" y1="5" x2="18" y2="5" stroke={fill} strokeWidth="1.5" />
  </svg>
)

// Professional/Briefcase icon
export const ProfessionalIcon = ({
  className = "w-6 h-6",
  fill = "#1F2937",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <rect x="2" y="7" width="20" height="13" rx="2" fill="none" stroke={fill} strokeWidth="2" />
    <path d="M6 7V5c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2" fill="none" stroke={fill} strokeWidth="2" />
    <line x1="9" y1="12" x2="9" y2="16" stroke={fill} strokeWidth="1.5" />
    <line x1="15" y1="12" x2="15" y2="16" stroke={fill} strokeWidth="1.5" />
  </svg>
)

// Edit/Pencil icon
export const EditIcon = ({
  className = "w-6 h-6",
  fill = "#1F2937",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <path
      d="M3 17.25V21h3.75L17.81 9.94M21 7.04c.5-.5.5-1.31 0-1.81l-2.23-2.23c-.5-.5-1.31-.5-1.81 0L15.5 5.5"
      fill="none"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Sparkle/Star icon
export const SparkleIcon = ({
  className = "w-5 h-5",
  fill = "#FF5A36",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Arrow right icon
export const ArrowRightIcon = ({
  className = "w-5 h-5",
  stroke = "#FF5A36",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// Download icon
export const DownloadIcon = ({
  className = "w-5 h-5",
  stroke = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// Share icon
export const ShareIcon = ({
  className = "w-5 h-5",
  stroke = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

// Copy icon
export const CopyIcon = ({
  className = "w-5 h-5",
  stroke = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

// Loading spinner
export const SpinnerIcon = ({
  className = "w-5 h-5",
  stroke = "#FF5A36",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <circle
      cx="12"
      cy="12"
      r="10"
      strokeDasharray="15.7 47.1"
      strokeLinecap="round"
      style={{
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </svg>
)

// Face detection icon
export const FaceCheckIcon = ({
  className = "w-6 h-6",
  fill = "#1D9E75",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
  >
    <circle cx="12" cy="12" r="10" fill="none" stroke={fill} strokeWidth="2" />
    <circle cx="9" cy="10" r="1.5" fill={fill} />
    <circle cx="15" cy="10" r="1.5" fill={fill} />
    <path
      d="M9 15c1.5 1.5 3 1.5 6 0"
      fill="none"
      stroke={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M14 6l2-2" stroke={fill} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Complete/Check badge
export const CompleteBadge = ({
  className = "w-6 h-6",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="#10B981"
  >
    <circle cx="12" cy="12" r="11" />
    <polyline points="7 13 10 16 17 9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// Camera icon (already from lucide but as SVG option)
export const CameraCustomIcon = ({
  className = "w-6 h-6",
  stroke = "#FF5A36",
  fill = "none",
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={fill}
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
)

// Plus icon
export const PlusIcon = ({
  className = "w-5 h-5",
  stroke = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

// X/Close icon
export const CloseIcon = ({
  className = "w-5 h-5",
  stroke = "currentColor",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
