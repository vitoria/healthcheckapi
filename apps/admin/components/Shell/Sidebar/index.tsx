import { useEffect } from "react"
import { useRouter } from "next/router"
import useSiderbarStore from "@/stores/sidebar"
import { Button, Icons, cn } from "ui"
import { useBreakpoint } from "use-breakpoint"

import Nav from "./Nav"

const BREAKPOINTS = { mobile: 0, tablet: 640, desktop: 1024 }

const Sidebar = () => {
  const router = useRouter()
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "desktop")
  const opened = useSiderbarStore((state) => state.opened)
  const onToggle = useSiderbarStore((state) => state.onChange)

  useEffect(() => {
    onToggle(breakpoint !== "mobile")
  }, [breakpoint, onToggle])

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 flex bg-white/60 sm:sticky sm:border-r",
        {
          "translate-x-0": opened,
          "-translate-x-full sm:translate-x-0": !opened,
        }
      )}
    >
      <div
        className={cn(
          "z-50 flex h-screen flex-col bg-white transition-all duration-200",
          {
            "translate-x-0 w-full max-w-[240px] shadow-xl sm:shadow-none":
              opened,
            "-translate-x-full sm:translate-x-0": !opened,
          }
        )}
      >
        <div className="block h-[53px] sm:hidden" />
        <div className="flex items-center space-x-4 px-4 py-2">
          <Button onClick={() => router.push({ pathname: "/admin/novo" })} className="w-full">
            <Icons.add className="mr-2 h-4 w-4" />
            <span>Novo</span>
          </Button>
        </div>
        <Nav />
      </div>
      <div className="flex flex-1 sm:hidden" onClick={() => onToggle(false)} />
    </div>
  )
}

export default Sidebar
