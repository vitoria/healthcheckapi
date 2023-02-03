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

export interface User {
  id: string
  created_at: string
  updated_at: string
  username: string
  full_name: string
  avatar_url?: string
}

export interface ApiFile {
  id: string
  created_at: string
  api_id: string
  url: string
}

export interface Api {
  id: string
  org_id: string
  name: string
  url: string
  files?: ApiFile[]
}

export interface ApiDetails {
  services: Service[]
}

export interface Service {
  methods: string[]
  name: string
}

export interface Check {
  id: string
  api_id: string
  name: string
  service: string
  method: string
  interval: number
  request: unknown
  assertion: unknown[]
  created_at: string
  api?: Api
}

export type CheckResultStatus =
  | "OK"
  | "CANCELLED"
  | "UNKNOWN"
  | "INVALID_ARGUMENT"
  | "DEADLINE_EXCEEDED"
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "PERMISSION_DENIED"
  | "RESOURCE_EXHAUSTED"
  | "FAILED_PRECONDITION"
  | "ABORTED"
  | "OUT_OF_RANGE"
  | "UNIMPLEMENTED"
  | "INTERNAL"
  | "UNAVAILABLE"
  | "DATA_LOSS"
  | "UNAUTHENTICATED"

export interface CheckResult {
  id: string
  created_at: string
  check_id: string
  latency: number
  status: CheckResultStatus
  response?: unknown
  assertion_result?: unknown
  error?: unknown
}

export interface CheckResultResponse {
  count: number
  latency: number
  uptime: number
  coverage: number
  data: CheckResult[]
}
