import { NextPageWithLayout } from "@/types"

import ProjectLayout from "@/components/Project"

const ServicesPage: NextPageWithLayout = () => {
  return <div>Service list</div>
}

ServicesPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default ServicesPage
