export {
    WizardProvider,
    useWizard,
    type WizardStep,
    type WizardContextType,
    type PhotoSizePreset,
    type PhotoCount,
    type BgColor,
    type PhotoSpec,
} from "./useWizard"

export {
    ToastProvider,
    useToast,
    type Toast,
    type ToastType,
} from "./useToast"

export {
    useHistory,
    type HistoryState,
} from "./useHistory"

// NOTE: useBatchQueue is NOT exported here to avoid SSR issues with onnxruntime-web
// Import directly from "@/lib/hooks/useBatchQueue" in client components
