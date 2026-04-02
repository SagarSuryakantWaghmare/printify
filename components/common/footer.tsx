"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Aperture, Mail } from "lucide-react"

// Custom SVG icons for social media (lucide-react removed brand icons)
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

interface SocialLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const productLinks = [
  { label: "Start Passport Photo", href: "/app" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
]

const resourceLinks = [
  { label: "Documentation", href: "/docs" },
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
]

const socialLinks: SocialLink[] = [
  { label: "Twitter", href: "https://twitter.com/printfy", icon: XIcon },
  { label: "GitHub", href: "https://github.com/printfy", icon: GitHubIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/printfy", icon: LinkedInIcon },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF5A36] shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <Aperture className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                PrintfY
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              AI-powered passport photo generator. Create professional, print-ready passport photos in under 60 seconds. 100% free forever.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#FF5A36] hover:border-[#FF5A36]/30 hover:shadow-md transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    className="text-sm text-slate-600 hover:text-[#FF5A36] transition-colors inline-block group" 
                    href={link.href}
                  >
                    <span className="group-hover:translate-x-1 inline-block transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    className="text-sm text-slate-600 hover:text-[#FF5A36] transition-colors inline-block group" 
                    href={link.href}
                  >
                    <span className="group-hover:translate-x-1 inline-block transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    className="text-sm text-slate-600 hover:text-[#FF5A36] transition-colors inline-block group" 
                    href={link.href}
                  >
                    <span className="group-hover:translate-x-1 inline-block transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter (Optional) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Stay updated</h3>
              <p className="text-sm text-slate-600">Get notified about new features and updates.</p>
            </div>
            <div className="flex gap-2 max-w-md w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 md:w-64 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 bg-[#FF5A36] text-white text-sm font-medium rounded-lg hover:bg-[#E24D2E] shadow-md hover:shadow-lg transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 bg-white/50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500">
            <p>
              © {currentYear} PrintfY. All rights reserved. Made with ❤️ for seamless passport photos.
            </p>
            <div className="flex items-center gap-6">
              <Link href="mailto:support@printfy.app" className="hover:text-[#FF5A36] transition-colors flex items-center gap-1">
                <Mail className="h-4 w-4" />
                support@printfy.app
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
