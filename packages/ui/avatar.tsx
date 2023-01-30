"use client"

import * as React from "react"
import * as AvatarPrimivite from "@radix-ui/react-avatar"

import { cn } from "./utils"

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimivite.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimivite.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimivite.Root
    ref={ref}
    className={cn(
      "inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle",
      className
    )}
    {...props}
  />
))

AvatarRoot.displayName = AvatarPrimivite.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimivite.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimivite.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimivite.Image
    ref={ref}
    className={cn("h-full w-full object-cover", className)}
    {...props}
  />
))

AvatarImage.displayName = AvatarPrimivite.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimivite.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimivite.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimivite.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center leading-none",
      className
    )}
    {...props}
  />
))

AvatarFallback.displayName = AvatarPrimivite.Fallback.displayName

export type AvatarProps = {
  url?: string
  size?: number
  alt?: string
  className?: string
}

function getInitials(name: string) {
  const hasTokens = name.indexOf(" ") !== -1
  return (
    name.substring(0, hasTokens ? 1 : 2) +
    (hasTokens ? name.charAt(name.lastIndexOf(" ") + 1) : "")
  )
}

const getHashOfString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)
  return hash
}

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min)
}

const hRange = [0, 360]
const sRange = [50, 100]
const lRange = [50, 100]

const generateHSL = (name: string): number[] => {
  const hash = getHashOfString(name)
  const h = normalizeHash(hash, hRange[0], hRange[1])
  const s = normalizeHash(hash, sRange[0], sRange[1])
  const l = normalizeHash(hash, lRange[0], lRange[1])
  return [h, s, l]
}

const HSLtoString = (hsl: number[]) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
}

export const Avatar = ({
  url,
  size = 24,
  alt = "",
  className,
}: AvatarProps) => {
  const backgroundColor = React.useMemo(
    () => HSLtoString(generateHSL(getInitials(alt))),
    [alt]
  )
  return (
    <AvatarRoot
      className={className}
      style={{ height: size, width: size, backgroundColor }}
    >
      <AvatarImage style={{ borderRadius: "inherit" }} src={url} alt={alt} />
      <AvatarFallback style={{ fontSize: size * 0.4, backgroundColor }}>
        {getInitials(alt)}
      </AvatarFallback>
    </AvatarRoot>
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback }
