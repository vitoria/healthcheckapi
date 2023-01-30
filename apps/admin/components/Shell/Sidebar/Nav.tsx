import { createElement } from "react"
import { useRouter } from "next/router"
import { Button, Icons, ScrollArea, ScrollBar } from "ui"

const LINKS = [
  {
    pathname: "/admin",
    label: "Home",
    icon: Icons.home,
  },
]

const Nav = () => {
  const router = useRouter()

  return (
    <ScrollArea>
      <nav className="flex flex-1 flex-col space-y-1 overflow-y-auto py-2 px-4">
        {LINKS.map((link) => {
          const isActive = router.pathname === link.pathname
          return (
            <Button
              key={link.pathname}
              disabled={isActive}
              variant={isActive ? "subtle" : "ghost"}
              className="flex items-center justify-start space-x-2 px-2 disabled:opacity-100"
              onClick={() => {
                router.push({
                  pathname: link.pathname,
                })
              }}
            >
              {createElement(link.icon, { className: "w-4 h-4" })}
              <span className="text-sm">{link.label}</span>
            </Button>
          )
        })}
      </nav>
      <ScrollBar />
    </ScrollArea>
  )
}

export default Nav
