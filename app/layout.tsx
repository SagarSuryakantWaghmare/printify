import type { Metadata } from "next"
import { Manrope, Sora } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Navbar } from "@/components/common/navbar"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "PrintfY — AI-Powered Passport Photo Generator",
  description: "Generate passport photos that get approved in 2 minutes. AI-powered photo enhancement for visa applications, student IDs, and official documents.",
  keywords: "passport photo, visa photo, student ID, AI photo generator, photo editor, India, AI tools",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} font-sans antialiased`}>
        <ClerkProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}