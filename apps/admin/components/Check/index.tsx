import { createContext, useContext, useState } from "react"
import { useRouter } from "next/router"
import { ApiDetails, Check, CheckResultResponse } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Block, Tab, TabList } from "@tremor/react"
import useSWR, { SWRResponse } from "swr"

import { useShell } from "../Shell"
import CheckChart from "./Chart"
import { CheckHeader } from "./Header"
import CheckTable from "./Table"

type Response = SWRResponse<Check> & {
  onUpdate: (values: Partial<Check>, cb?: () => void) => void
  results: SWRResponse<CheckResultResponse>
  details: SWRResponse<ApiDetails>
  updating: boolean
}

const CheckContext = createContext<Response>(null as any)

export const CheckProvider = () => {
  const {
    isReady,
    query: { project_id, check_id },
  } = useRouter()
  const { onToast } = useShell()
  const [selectedView, setSelectedView] = useState(1)
  const [updating, setUpdating] = useState(false)
  const supabaseClient = useSupabaseClient()

  const swr = useSWR<Check>(
    isReady ? `/api/project/${project_id}/checks/${check_id}` : null,
    fetcher
  )
  const details = useSWR<ApiDetails>(
    isReady && swr.data
      ? `/api/project/${project_id}/apis/${swr.data.api_id}/details`
      : null,
    fetcher
  )

  const results = useSWR<CheckResultResponse>(
    isReady ? `/api/project/${project_id}/checks/${check_id}/results` : null,
    fetcher
  )

  const onUpdate = async (values: Partial<Check>, callback: any) => {
    try {
      setUpdating(true)
      const check = await supabaseClient
        .from("checks")
        .update(values)
        .eq("id", check_id)
        .select("*")
        .single()
      callback()
      swr.mutate({ ...swr.data, ...(check.data as Check) })
    } catch (error: any) {
      onToast({
        title: "Error to update the Check",
        description: error.message,
        variant: "error",
      })
    } finally {
      setUpdating(false)
    }
  }

  const value = {
    ...swr,
    onUpdate,
    updating,
    results,
    details,
  }

  return (
    <CheckContext.Provider value={value}>
      <main className="flex flex-1 flex-col space-y-4 p-4">
        <CheckHeader />

        <TabList
          defaultValue={1}
          onValueChange={(value) => setSelectedView(value)}
          marginTop="mt-6"
        >
          <Tab value={1} text="Overview" />
          <Tab value={2} text="Results" />
        </TabList>

        {selectedView === 1 ? (
          <Block marginTop="mt-6">
            <CheckChart />
          </Block>
        ) : (
          <Block marginTop="mt-6">
            <CheckTable />
          </Block>
        )}
      </main>
    </CheckContext.Provider>
  )
}

export const useCheck = () => {
  const context = useContext(CheckContext)
  if (context === undefined) {
    throw new Error("useCheck must be used within a CheckProvider")
  }
  return context
}
