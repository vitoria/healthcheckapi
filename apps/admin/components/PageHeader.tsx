import { PropsWithChildren } from "react"
import Link, { LinkProps } from "next/link"
import { cn } from "ui"

type PageHeaderProps = {
  link: LinkProps["href"] & {
    label: string
  }
  label?: string
}

const PageHeader = ({
  link,
  label,
  children,
}: PropsWithChildren<PageHeaderProps>) => {
  return (
    <div
      className={cn(
        "flex h-[53px] items-center justify-between border-b py-2 pr-4 pl-12 sm:px-8",
        { "space-x-2": children }
      )}
    >
      <div
        className={cn(
          "flex items-center overflow-hidden text-sm leading-4 sm:max-w-none",
          { "space-x-2": label }
        )}
      >
        <Link
          href={{
            pathname: (link as any).pathname,
            query: (link as any).query,
          }}
          className="truncate hover:opacity-75"
        >
          {link.label}
        </Link>
        {label && (
          <>
            <div className="text-gray-500">›</div>
            <span className="truncate whitespace-nowrap text-gray-500">{label}</span>
          </>
        )}
      </div>
      {children}
    </div>
  )
}

export default PageHeader
