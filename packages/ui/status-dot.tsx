import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "./utils"

export const statusDotVariants = cva("rounded-full border-2", {
  variants: {
    variant: {
      CONFIRMED: "border-green-500",
      WAITING: "border-yellow-500",
      DONE: "border-blue-500",
      CANCELED: "border-red-500",
    },
    size: {
      default: "w-3 h-3",
      lg: "w-4 h-4",
    },
  },
  defaultVariants: {
    variant: "CONFIRMED",
    size: "default",
  },
})

export interface StatusDotProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof statusDotVariants> {}

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      className={cn(statusDotVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)

StatusDot.displayName = "StatusDot"
