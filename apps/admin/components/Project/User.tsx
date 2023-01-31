import { useRouter } from "next/router"
import { useProfile } from "@/hooks/useProfile"
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from "ui"

import { siteName } from "../Logo"

const ProjectUser = () => {
  const { data } = useProfile()
  const router = useRouter()

  const name = data?.full_name ?? `User ${siteName}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 rounded-full p-0">
          {!data ? (
            <div className="h-6 w-6 rounded-full bg-gray-100" />
          ) : (
            <Avatar alt={name} url={data?.avatar_url} size={24} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" sideOffset={10}>
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push({ pathname: "/account/settings" })}
        >
          <Icons.settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push({ pathname: "/logout" })}>
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProjectUser
