import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent text-sm font-semibold transition-colors duration-200 select-none outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-[#E63E1D] active:bg-[#C84426]",
        cta:
          "bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(255,90,54,0.25)] hover:bg-[#E63E1D] hover:shadow-[0_14px_30px_rgba(255,90,54,0.35)] active:translate-y-px active:shadow-[0_6px_16px_rgba(255,90,54,0.25)]",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))]",
        secondary:
          "bg-muted text-foreground hover:bg-[#EFEFF2]",
        ghost:
          "text-foreground hover:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#DC2626] active:bg-[#B91C1C]",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-lg [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 text-xs rounded-lg",
        default: "h-10 px-4",
        lg: "h-11 px-5 text-base rounded-xl",
        xl: "h-12 px-6 text-base rounded-2xl",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? undefined}
      data-size={size ?? undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
