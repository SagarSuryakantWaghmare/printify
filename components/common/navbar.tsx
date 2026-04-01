"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Aperture, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide the main navbar if we are in the app wizard, as it has its own header
  if (pathname?.startsWith("/app")) {
    return null
  }

  const handleLinkClick = (href: string) => {
    setOpen(false)
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 safe-x",
        scrolled 
          ? "border-[#e5e5e5] bg-white/95 backdrop-blur-xl shadow-sm" 
          : "border-transparent bg-white/85 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group touch-target">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36] shadow-[0_10px_22px_rgba(255,90,54,0.35)] group-hover:shadow-[0_12px_28px_rgba(255,90,54,0.45)] transition-shadow"
          >
            <Aperture className="h-4 w-4 text-white" />
          </motion.div>
          <span className="font-display text-lg font-700 tracking-tight text-[#111827] group-hover:text-[#FF5A36] transition-colors">
            PrintfY
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(link.href)
              }}
              className="text-sm font-medium text-slate-600 hover:text-[#FF5A36] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF5A36] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/app">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-white text-[#FF5A36] border border-[#FF5A36] hover:bg-[#FFF5F0] hover:shadow-md rounded-xl px-5 transition-all duration-300">
                  Sign In
                </Button>
              </motion.div>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/app">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-5 shadow-[0_10px_22px_rgba(255,90,54,0.25)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.35)] transition-all duration-300">
                  Start Passport Photo
                </Button>
              </motion.div>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-5 shadow-[0_10px_22px_rgba(255,90,54,0.25)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.35)] transition-all duration-300"
              >
                <Link href="/app">Generate Photo</Link>
              </Button>
            </motion.div>
            <div className="ml-2">
              <UserButton />
            </div>
          </Show>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 transition-colors touch-target">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-xs p-0 safe-right">
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36]">
                    <Aperture className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display text-lg font-600">PrintfY</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="hover:bg-slate-100 touch-target"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Nav Links - touch optimized */}
              <nav className="px-5 py-4 space-y-1 border-b flex-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link.href)
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center py-3 text-base font-medium text-slate-600 hover:text-[#FF5A36] active:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors touch-target"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile CTA buttons - safe area aware */}
              <div className="px-5 py-4 space-y-3 safe-bottom">
                <Show when="signed-out">
                  <SignInButton mode="modal" fallbackRedirectUrl="/app">
                    <Button className="w-full h-12 bg-white text-[#FF5A36] border border-[#FF5A36] hover:bg-[#FFF5F0] rounded-xl text-base font-semibold">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal" fallbackRedirectUrl="/app">
                    <Button className="w-full h-12 bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl shadow-lg text-base font-semibold">
                      Start Passport Photo
                    </Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Button
                    asChild
                    className="w-full h-12 bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl text-base font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/app">Generate Photo</Link>
                  </Button>
                  <div className="flex items-center justify-center pt-2">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </motion.div>
          </SheetContent>
        </Sheet>

      </div>
    </motion.header>
  )
}