import Link from "next/link"
import { useRouter } from "next/router"
import { Projects } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from "ui"

export default function ProjectsPage() {
  const router = useRouter()
  const { data, error } = useSWR<Projects>("/api/projects", fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div className="flex flex-1 flex-col bg-gray-100 p-4">
      <div className="mb-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>New project</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Choose organization</DropdownMenuLabel>
            <DropdownMenuGroup>
              {data?.organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() =>
                    router.push({
                      pathname: "/new/[org_id]",
                      query: { org_id: org.id },
                    })
                  }
                >
                  <span>{org.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/new")}>
              <Icons.add className="mr-2 h-4 w-4" />
              <span>New organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col space-y-8">
        {data?.organizations.map((org) => (
          <div key={org.id}>
            <h3 className="mb-4 font-medium">{org.name}</h3>
            <div className="flex space-x-2">
              {data?.projects
                .filter((project) => project.org_id === org.id)
                .map((project) => (
                  <Link
                    key={project.id}
                    href={{
                      pathname: "/project/[project_id]",
                      query: { project_id: project.id },
                    }}
                    className="flex w-full max-w-xs items-center justify-between rounded-md border bg-white p-4 text-sm hover:shadow-lg"
                  >
                    <span>{project.name}</span>
                    <Icons.chevron.right className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
