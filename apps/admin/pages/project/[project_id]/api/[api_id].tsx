import { useRouter } from "next/router"
import { Api, NextPageWithLayout } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import useSWR from "swr"

import ProjectLayout from "@/components/Project"

const ApiDetailsPage: NextPageWithLayout = () => {
  const router = useRouter()

  const api = useSWR<Api>(
    router.isReady
      ? `/api/project/${router.query.project_id}/apis/${router.query.api_id}`
      : null,
    fetcher
  )

  if (api.error) return <div>failed to load</div>
  if (!api.data) return <div>loading...</div>

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-medium">{api.data.name}</h1>
      </div>
      <div>
        <p>{JSON.stringify(api.data, null, 4)}</p>
      </div>
    </>
  )
}

ApiDetailsPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ApiDetailsPage
