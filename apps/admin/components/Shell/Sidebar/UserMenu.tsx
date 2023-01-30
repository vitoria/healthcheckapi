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

const UserMenu = () => {
  const { data } = useProfile()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-6 w-6 rounded-full p-0">
          {!data ? (
            <div className="h-6 w-6 rounded-full bg-gray-100" />
          ) : (
            <Avatar alt={data.full_name} url={data?.avatar_url} size={24} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" sideOffset={10}>
        <DropdownMenuLabel className="truncate">
          {data?.full_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push({ pathname: "/configuracoes" })}
        >
          <Icons.settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push({ pathname: "/sair" })}>
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
