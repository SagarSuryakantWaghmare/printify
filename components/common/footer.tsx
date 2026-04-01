"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Aperture, Mail, Twitter, Github, Linkedin } from "lucide-react"

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

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com/printfy", icon: Twitter },
  { label: "GitHub", href: "https://github.com/printfy", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/company/printfy", icon: Linkedin },
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
