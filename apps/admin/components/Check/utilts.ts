import { Color } from "@tremor/react"

export const statusColors: { [key: string]: Color } = {
  OK: "emerald",
  CANCELLED: "amber",
  UNKNOWN: "amber",
  INVALID_ARGUMENT: "amber",
  DEADLINE_EXCEEDED: "amber",
  NOT_FOUND: "amber",
  ALREADY_EXISTS: "amber",
  PERMISSION_DENIED: "amber",
  RESOURCE_EXHAUSTED: "amber",
  FAILED_PRECONDITION: "amber",
  ABORTED: "amber",
  OUT_OF_RANGE: "amber",
  UNIMPLEMENTED: "amber",
  INTERNAL: "amber",
  UNAVAILABLE: "rose",
  DATA_LOSS: "amber",
  UNAUTHENTICATED: "amber",
}

export const assertionColors: { [key: string]: Color } = {
  MATCHED: "emerald",
  UNMATCHED: "amber",
  null: "gray",
}

export const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}s`
