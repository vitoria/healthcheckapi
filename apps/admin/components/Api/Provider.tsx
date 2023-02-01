import { ChangeEventHandler, createContext, useContext, useState } from "react"
import { useRouter } from "next/router"
import { Api } from "@/types"
import { fetcher } from "@/utilts/fetcher"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import useSWR, { SWRResponse, mutate } from "swr"

import { useShell } from "../Shell"
import ApiFiles from "./Files"
import ApiHeader from "./Header"

type Response = SWRResponse<Api> & {
  onUpdate: (values: Partial<Api>, cb?: () => void) => void
  onUpload: ChangeEventHandler<HTMLInputElement>
  onSelectFiles: (id: string) => void
  onToggleSelectedFiles: () => void
  onDeleteFiles: () => void
  selectedFiles: string[]
  updating: boolean
  uploading: boolean
  deleting: boolean
}

const ApiContext = createContext<Response>(null as any)

export const ApiProvider = () => {
  const {
    isReady,
    query: { project_id, api_id },
  } = useRouter()
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const supabaseClient = useSupabaseClient()
  const { onToast } = useShell()

  const key = `/api/project/${project_id}/apis/${api_id}`

  const swr = useSWR<Api>(isReady ? key : null, fetcher)

  const onSelectFiles = (id: string) => {
    setSelectedFiles(
      selectedFiles.includes(id)
        ? selectedFiles.filter((item) => item !== id)
        : [...selectedFiles, id]
    )
  }

  const onUpdate = async (values: Partial<Api>, callback: any) => {
    try {
      setUpdating(true)
      const api = await supabaseClient
        .from("apis")
        .update(values)
        .eq("id", api_id)
        .select("name, url")
        .single()
      callback()
      swr.mutate({ ...swr.data, ...(api.data as Api) })
    } catch (error: any) {
      onToast({
        title: "Error to update the API",
        description: error.message,
        variant: "error",
      })
    } finally {
      setUpdating(false)
    }
  }

  const onToggleSelectedFiles = () =>
    selectedFiles.length > 0
      ? setSelectedFiles([])
      : setSelectedFiles(swr.data?.files?.map((item) => item.id) ?? [])

  const onDeleteFiles = async () => {
    const paths: string[] = selectedFiles.map(
      (id) => swr.data?.files?.find((item) => item.id === id)?.url ?? ""
    )
    if (paths.length > 0) {
      setDeleting(true)
      await supabaseClient.storage.from("protos").remove(paths)
      await Promise.all(
        selectedFiles.map((item) =>
          supabaseClient.from("files").delete().eq("id", item)
        )
      )
      mutate(key)
      setSelectedFiles([])
      onToast({
        title: `${selectedFiles.length} ${
          selectedFiles.length === 1 ? "file has been" : "files were"
        } deleted`,
        variant: "success",
      })
      setDeleting(false)
    }
  }

  const onUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target.files) {
      try {
        setUploading(true)
        const body = new FormData()
        for (let i = 0; i < e.target.files.length; i++) {
          body.append("protos", e.target.files[i])
        }
        const response = await fetch(
          `/api/project/${project_id}/apis/${api_id}/upload`,
          { method: "POST", body }
        ).then((res) => res.json())
        mutate(key)
        onToast({
          title: `${response.length} ${
            response.length === 1 ? "file has been" : "files were"
          } uploaded`,
          variant: "success",
        })
      } catch (error: any) {
        onToast({
          title: "Error to upload files",
          description: error.message,
          variant: "error",
        })
      } finally {
        setUploading(false)
        e.target.value = ""
      }
    }
  }

  const value = {
    ...swr,
    uploading,
    onUpload,
    deleting,
    onUpdate,
    onToggleSelectedFiles,
    onSelectFiles,
    selectedFiles,
    onDeleteFiles,
    updating,
  }

  return (
    <ApiContext.Provider value={value}>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <ApiHeader />
        <ApiFiles />
      </div>
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within a ApiProvider")
  }
  return context
}
