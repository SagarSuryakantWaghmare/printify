import Link from "next/link"

const productLinks = [
  { label: "Start passport photo", href: "/app" },
  { label: "Print packs", href: "/#print-packs" },
]

const supportLinks = [
  { label: "Contact", href: "mailto:support@printfy.app" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-[#ECECEF] bg-[#fbfcfd]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:px-8 md:py-14">
        <div className="space-y-3">
          <p className="font-display text-xl font-700 tracking-tight text-[#111827]">PrintfY</p>
          <p className="max-w-sm text-sm text-[#6b7280]">
            A premium AI passport photo platform for fast, compliant, and print-ready outputs.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-700 uppercase tracking-widest text-[#9ca3af]">Product</p>
          <ul className="space-y-2">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link className="text-sm text-[#4b5563] transition-colors hover:text-[#1a1a1a]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-700 uppercase tracking-widest text-[#9ca3af]">Support</p>
          <ul className="space-y-2">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link className="text-sm text-[#4b5563] transition-colors hover:text-[#1a1a1a]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#ECECEF] px-4 py-4 text-center text-xs text-[#9ca3af] sm:px-6 md:px-8">
        © {new Date().getFullYear()} PrintfY. All rights reserved.
      </div>
    </footer>
  )
}
