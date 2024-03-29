import { PropsWithChildren } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "ui"

import ProjectHeader from "./Header"

const NAV_ITEMS: { [key: string]: string } = {
  "/project/[project_id]": "Checks",
  "/project/[project_id]/apis": "APIs",
}

const ProjectLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter()

  return (
    <>
      <ProjectHeader />
      <div className="border-b">
        <div className="mx-auto flex w-full max-w-6xl">
          {Object.keys(NAV_ITEMS).map((pathname) => (
            <Link
              key={pathname}
              href={{
                pathname,
                query: { project_id: router.query.project_id },
              }}
              className={cn(
                "relative flex h-10 items-center justify-center px-4 text-sm text-gray-500 hover:text-black",
                { "text-black nav-selected": router.pathname === pathname }
              )}
            >
              {NAV_ITEMS[pathname]}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col">
          {children}
        </div>
      </div>
    </>
  )
}
export default ProjectLayout
