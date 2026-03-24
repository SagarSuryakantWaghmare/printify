"use client"

import { WizardProvider } from "@/lib/hooks"
import { WizardLayout } from "@/components/wizard/WizardLayout"
import { WizardContent } from "@/components/wizard/WizardContent"

export default function AppPage() {
  return (
    <WizardProvider>
      <WizardLayout>
        <WizardContent />
      </WizardLayout>
    </WizardProvider>
  )
}
