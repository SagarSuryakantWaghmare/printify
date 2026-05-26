"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Aperture, X } from "lucide-react"
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
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Wizard has its own header
  if (pathname?.startsWith("/app")) return null

  const handleLinkClick = (href: string) => {
    setOpen(false)
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background,border,box-shadow] duration-200 safe-x",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/70 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-lg"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-[0_8px_18px_rgba(255,90,54,0.3)] group-hover:shadow-[0_10px_24px_rgba(255,90,54,0.4)] transition-shadow">
            <Aperture className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            PrintfY
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(link.href)
              }}
              className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/app">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-brand-50 hover:text-primary">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/app">
              <Button variant="cta" size="lg">Start Free</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button asChild variant="cta" size="lg">
              <Link href="/app">Generate Photo</Link>
            </Button>
            <div className="ml-1">
              <UserButton />
            </div>
          </Show>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-xs p-0 safe-right">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Aperture className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <span className="font-display text-lg font-bold">PrintfY</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="px-3 py-3 space-y-1 border-b border-border flex-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link.href)
                    }}
                    className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-foreground hover:bg-muted hover:text-primary transition-colors touch-target"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="px-4 py-4 space-y-2.5 safe-bottom">
                <Show when="signed-out">
                  <SignInButton mode="modal" fallbackRedirectUrl="/app">
                    <Button variant="outline" size="xl" className="w-full border-primary text-primary hover:bg-brand-50 hover:text-primary">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal" fallbackRedirectUrl="/app">
                    <Button variant="cta" size="xl" className="w-full">Start Free</Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Button asChild variant="cta" size="xl" className="w-full" onClick={() => setOpen(false)}>
                    <Link href="/app">Generate Photo</Link>
                  </Button>
                  <div className="flex items-center justify-center pt-2">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
