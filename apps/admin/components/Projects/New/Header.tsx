import Link from "next/link"
import { Icons, cn } from "ui"

import { logoEmoji } from "@/components/Logo"

const Divider = () => <Icons.chevron.right className="h-4 w-4 text-gray-500" />

type NewProjectHeaderProps = {
  step?: "organization" | "project"
}

const NewProjectHeader = ({ step = "organization" }: NewProjectHeaderProps) => (
  <div className="flex h-12 items-center space-x-2 border-b px-4 text-sm">
    <Link href="/" className="leading-none">
      {logoEmoji}
    </Link>
    <Divider />
    <span className="truncate text-black">Create an organization</span>
    <Divider />
    <span
      className={cn("truncate text-gray-500", {
        "text-black": step === "project",
      })}
    >
      Create a new project
    </span>
  </div>
)

export default NewProjectHeader
