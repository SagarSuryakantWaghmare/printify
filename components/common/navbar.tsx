"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Menu, Grid2x2, X } from "lucide-react"

const navLinks = [
  { label: "Home",         href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing",      href: "/#pricing" },
  { label: "Countries",    href: "/app" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36]">
            <Grid2x2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-700 text-[#1a1a1a]">
            PicID
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-500 text-[#6b7280] transition-colors hover:text-[#1a1a1a]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            asChild
            className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-5"
          >
            <Link href="/app">Start Free</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36]">
                  <Grid2x2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-600">PicID</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-500 text-[#6b7280] transition-colors hover:bg-[#f7f7f8] hover:text-[#1a1a1a]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Separator />

            <div className="px-6 py-4">
              <Button
                asChild
                className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl"
                onClick={() => setOpen(false)}
              >
                <Link href="/app">Start Free</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}