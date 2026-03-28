"use client"

import { useState } from "react"
import Link from "next/link"
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Aperture, X } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ececef] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5A36] shadow-[0_10px_22px_rgba(255,90,54,0.35)]">
            <Aperture className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-700 tracking-tight text-[#111827]">
            PrintfY
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Sizes", href: "/#sizes" },
            { label: "Pricing", href: "/#pricing" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#4b5563] transition-colors hover:bg-[#F7F7F8] hover:text-[#111827]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/app">
              <Button className="bg-white text-[#FF5A36] border border-[#FF5A36] hover:bg-[#FFF5F0] rounded-xl px-5">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/app">
              <Button className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-5 shadow-[0_10px_22px_rgba(255,90,54,0.25)]">
                Start Passport Photo
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button
              asChild
              className="bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl px-5 shadow-[0_10px_22px_rgba(255,90,54,0.25)]"
            >
              <Link href="/app">Generate Photo</Link>
            </Button>
            <UserButton />
          </Show>
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
                  <Aperture className="h-4 w-4 text-white" />
                </div>
                <span className="font-display text-lg font-600">PrintfY</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-6 py-4 space-y-3">
              {/* Mobile nav links */}
              <nav className="space-y-1 pb-2 border-b border-[#F3F4F6]">
                {[
                  { label: "How It Works", href: "/#how-it-works" },
                  { label: "Sizes", href: "/#sizes" },
                  { label: "Pricing", href: "/#pricing" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#4b5563] transition-colors hover:bg-[#F7F7F8] hover:text-[#111827]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Show when="signed-out">
                <SignInButton mode="modal" fallbackRedirectUrl="/app">
                  <Button className="w-full bg-white text-[#FF5A36] border border-[#FF5A36] hover:bg-[#FFF5F0] rounded-xl">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl="/app">
                  <Button className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl">
                    Start Passport Photo
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Button
                  asChild
                  className="w-full bg-[#FF5A36] text-white hover:bg-[#e04e2d] rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/app">Generate Photo</Link>
                </Button>
                <div className="flex items-center justify-center pt-2">
                  <UserButton />
                </div>
              </Show>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}