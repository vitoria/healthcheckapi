import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export interface Organization {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  org_id: string
  organization?: Organization
}

export interface Projects {
  organizations: Organization[]
  projects: Project[]
}
