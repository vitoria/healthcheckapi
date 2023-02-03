import Link from "next/link"
import { useRouter } from "next/router"
import { Api, NextPageWithLayout } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"

import NewApi from "@/components/Api/New"
import PageInfo from "@/components/PageInfo"
import ProjectLayout from "@/components/Project"

const ChecksPage: NextPageWithLayout = () => {
  const router = useRouter()

  const { data, error } = useSWR<Api[]>(
    router.isReady ? `/api/project/${router.query.project_id}/checks` : null,
    fetcher
  )

  const render = () => {
    if (error) return <PageInfo className="mx-4">Failed to load</PageInfo>
    if (!data) return <PageInfo className="mx-4">Loading...</PageInfo>
    if (data.length === 0)
      return (
        <PageInfo className="mx-4">{`No API yet, click in "New" to create.`}</PageInfo>
      )

    return (
      <div className="mx-4 flex flex-col divide-y overflow-hidden rounded-md border bg-white">
        {data.map((item) => (
          <Link
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
            href={{
              pathname: "/project/[project_id]/api/[api_id]",
              query: { ...router.query, api_id: item.id },
            }}
          >
            <div className="flex items-center space-x-4">
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-gray-500">{item.url}</span>
            </div>
            <span className="text-sm text-gray-500">
              {item.files?.length}{" "}
              {(item.files?.length ?? 0) < 2 ? "file" : "files"}
            </span>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-medium">Checks</h1>
        <NewApi disabled={!data} />
      </div>
      {render()}
    </>
  )
}

ChecksPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ChecksPage
