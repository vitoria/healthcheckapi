import { NextPageWithLayout } from "@/types"

import { ApiProvider } from "@/components/Api"
import ProjectLayout from "@/components/Project"

const ApiDetailsPage: NextPageWithLayout = () => {
  return <ApiProvider />
}

ApiDetailsPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ApiDetailsPage
