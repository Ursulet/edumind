"use client";
import * as React from "react"
import { cn } from "../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-forest-accent focus:ring-offset-2",
        {
          "border-transparent bg-primary-ink text-warm-surface hover:bg-deep-graphite": variant === "default",
          "border-transparent bg-muted-surface text-primary-text hover:bg-border": variant === "secondary",
          "border-transparent bg-danger text-warm-surface hover:bg-danger/80": variant === "destructive",
          "border-transparent bg-success text-warm-surface hover:bg-success/80": variant === "success",
          "border-transparent bg-warning text-warm-surface hover:bg-warning/80": variant === "warning",
          "border-transparent bg-info-neutral text-warm-surface hover:bg-info-neutral/80": variant === "info",
          "text-primary-text": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
