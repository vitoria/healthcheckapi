import { NextPageWithLayout } from "@/types"

import ProjectLayout from "@/components/Project"

const ChecksPage: NextPageWithLayout = () => {
  return <div>Check list</div>
}

ChecksPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ChecksPage
