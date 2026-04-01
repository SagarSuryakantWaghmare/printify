import type { Metadata, Viewport } from "next"
import { Manrope, Sora } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Navbar } from "@/components/common/navbar"
import { ToastProvider } from "@/lib/hooks"
import { ToastContainer } from "@/components/common/ToastContainer"
import { SkipToContent } from "@/components/common/accessibility"

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

export const viewport: Viewport = {
  themeColor: "#FF5A36",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "PrintfY — AI-Powered Passport Photo Generator",
  description: "Generate passport photos that get approved in 2 minutes. AI-powered photo enhancement for visa applications, student IDs, and official documents.",
  keywords: "passport photo, visa photo, student ID, AI photo generator, photo editor, India, AI tools",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrintfY",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "PrintfY — AI Passport Photo Generator",
    description: "Upload once. AI removes background, sharpens the photo, and creates a print-ready sheet in 60 seconds. 100% free.",
    url: "https://printfy.app",
    siteName: "PrintfY",
    images: [{ url: "https://printfy.app/og-image.png", width: 1200, height: 630, alt: "PrintfY — AI Passport Photo" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintfY — AI Passport Photo Generator",
    description: "Free AI passport photo — background removed, enhanced, and print-ready in 60 seconds.",
    images: ["https://printfy.app/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${manrope.variable} ${sora.variable} font-sans antialiased`}>
        <ClerkProvider>
          <ToastProvider>
            <SkipToContent />
            <Navbar />
            <main id="main-content" className="min-h-screen" role="main">
              {children}
            </main>
            <ToastContainer />
          </ToastProvider>
        </ClerkProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}