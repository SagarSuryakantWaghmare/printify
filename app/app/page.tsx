"use client"

import { WizardProvider } from "@/lib/hooks"
import { WizardLayout } from "@/components/wizard/WizardLayout"
import { WizardContent } from "@/components/wizard/WizardContent"
import { ProtectedRoute } from "@/components/wizard/ProtectedRoute"

export default function AppPage() {
  return (
    <ProtectedRoute>
      <WizardProvider>
        <WizardLayout>
          <WizardContent />
        </WizardLayout>
      </WizardProvider>
    </ProtectedRoute>
  )
}
