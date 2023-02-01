import { ComponentProps, PropsWithChildren } from "react"
import { cn } from "ui"

const PageInfo = (props: PropsWithChildren<ComponentProps<"div">>) => {
  return (
    <div
      className={cn(
        "flex h-1/4 items-center justify-center rounded-md border",
        props.className
      )}
    >
      <span className="text-sm text-gray-500">{props.children}</span>
    </div>
  )
}

export default PageInfo
