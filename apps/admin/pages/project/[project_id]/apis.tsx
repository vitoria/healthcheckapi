import Link from "next/link"
import { useRouter } from "next/router"
import { Api, NextPageWithLayout } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"
import { Button } from "ui"

import ProjectLayout from "@/components/Project"

const ApisPage: NextPageWithLayout = () => {
  const router = useRouter()

  const { data, error } = useSWR<Api[]>(
    router.isReady ? `/api/project/${router.query.project_id}/apis` : null,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-medium">APIs</h1>
        <Button
          onClick={() =>
            router.push({
              pathname: "/project/[project_id]/api/new",
              query: router.query,
            })
          }
        >
          New
        </Button>
      </div>
      <div className="flex flex-col space-y-4">
        {data.map((item) => (
          <Link
            href={{
              pathname: "/project/[project_id]/api/[api_id]",
              query: {
                ...router.query,
                api_id: item.id,
              },
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  )
}

ApisPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ApisPage
