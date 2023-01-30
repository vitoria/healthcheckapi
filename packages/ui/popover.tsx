"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "./utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    combo?: boolean
  }
>(({ className, align = "center", sideOffset = 4, combo, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <span className={combo ? "combobox" : ""}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 shadow-big z-50 min-w-[200px] overflow-hidden rounded-md border-black/5 bg-white outline-none dark:border-slate-800 dark:bg-slate-800 sm:border sm:bg-white/50 sm:shadow-md sm:backdrop-blur-md",
          className
        )}
        {...props}
      />
    </span>
  </PopoverPrimitive.Portal>
))

PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
