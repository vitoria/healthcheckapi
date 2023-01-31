import { useMemo } from "react"
import { useRouter } from "next/router"
import { Projects } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from "ui"

const ProjectSelect = () => {
  const router = useRouter()
  const { data } = useSWR<Projects>("/api/projects", fetcher)

  const orgSelected = useMemo(
    () =>
      data?.projects.find(
        (project) => project.id === String(router.query.project_id)
      )?.organization,
    [data, router.query.project_id]
  )

  const getFirstProjectByOrg = (orgId: string) =>
    data?.projects.filter((project) => project.org_id === orgId)[0].id

  const projectSelected = useMemo(
    () =>
      data?.projects.find(
        (project) => project.id === String(router.query.project_id)
      ),
    [data, router.query.project_id]
  )

  const projects = useMemo(
    () =>
      data?.projects.filter((project) => project.org_id === orgSelected?.id),
    [data?.projects, orgSelected?.id]
  )

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-sm hover:opacity-60"
          disabled={!data}
        >
          {!data ? (
            <span className="block h-4 w-16 rounded-md bg-gray-100" />
          ) : (
            orgSelected?.name
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuRadioGroup
            value={orgSelected?.id}
            onValueChange={(org) =>
              router.push({
                pathname: "/project/[project_id]",
                query: { project_id: getFirstProjectByOrg(org) },
              })
            }
          >
            {data?.organizations.map((org) => (
              <DropdownMenuRadioItem key={org.id} value={org.id}>
                <Avatar alt={org.name} size={20} className="mr-2" />
                {org.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/new")}>
            <Icons.add className="mr-2 h-4 w-4" />
            <span>New organization</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="h-4 w-px rotate-12 bg-gray-300" />
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-sm hover:opacity-60"
          disabled={!data}
        >
          {!data ? (
            <span className="block h-4 w-24 rounded-md bg-gray-100" />
          ) : (
            projectSelected?.name
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuRadioGroup
            value={String(router.query.project_id)}
            onValueChange={(project_id) =>
              router.push({
                pathname: "/project/[project_id]",
                query: { project_id },
              })
            }
          >
            {projects?.map((project) => (
              <DropdownMenuRadioItem key={project.id} value={project.id}>
                <Avatar alt={project.name} size={20} className="mr-2" />
                {project.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push({
                pathname: "/new/[org_id]",
                query: { org_id: orgSelected?.id },
              })
            }
          >
            <Icons.add className="mr-2 h-4 w-4" />
            <span>New project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProjectSelect
