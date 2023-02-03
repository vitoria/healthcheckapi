import { NextPageWithLayout } from "@/types"

import { CheckProvider } from "@/components/Check"
import ProjectLayout from "@/components/Project"

const CheckDetailsPage: NextPageWithLayout = () => {
  return <CheckProvider />
}

CheckDetailsPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default CheckDetailsPage
