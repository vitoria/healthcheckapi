import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Project } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"

import { logoEmoji, siteName } from "@/components/Logo"
import ProjectSelect from "./Select"
import ProjectUser from "./User"

const ProjectHeader = () => {
  const router = useRouter()
  const { data } = useSWR<Project>(
    router.isReady ? `/api/project/${router.query.project_id}` : null,
    fetcher
  )

  return (
    <>
      <Head>
        <title>{data ? `${data?.name} • ${siteName}` : siteName}</title>
      </Head>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between py-2 px-3">
        <div className="flex items-center space-x-4">
          <Link href="/projects" className="text-2xl leading-none">
            {logoEmoji}
          </Link>
          <ProjectSelect />
        </div>
        <ProjectUser />
      </header>
    </>
  )
}
export default ProjectHeader
