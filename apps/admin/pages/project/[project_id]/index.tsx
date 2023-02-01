import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/types"
import { Button } from "ui"

import ProjectLayout from "@/components/Project"

const ChecksPage: NextPageWithLayout = () => {
  const router = useRouter()
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-medium">Checks</h1>
        <Button
          onClick={() =>
            router.push({
              pathname: "/project/[project_id]/checks/new",
              query: router.query,
            })
          }
        >
          New
        </Button>
      </div>
      Check list
    </>
  )
}

ChecksPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ChecksPage
