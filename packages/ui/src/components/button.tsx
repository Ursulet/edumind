"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary-ink text-warm-surface hover:bg-deep-graphite": variant === "default",
            "border border-border bg-warm-surface text-primary-text hover:bg-muted-surface": variant === "outline",
            "hover:bg-muted-surface text-primary-text": variant === "ghost",
            "text-primary-ink underline-offset-4 hover:underline": variant === "link",
            "bg-danger text-warm-surface hover:bg-danger/90": variant === "danger",
            "h-11 px-5": size === "default",
            "h-9 px-3": size === "sm",
            "h-12 px-8": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
