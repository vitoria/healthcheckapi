import { useRouter } from "next/router"
import { User } from "@/types"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import useSWR, { SWRResponse } from "swr"

type Response = SWRResponse<User | null>

type Hook = () => Response

export const useProfile: Hook = () => {
  const { isReady } = useRouter()
  const supabaseClient = useSupabaseClient()
  const swr = useSWR<User | null>(
    isReady ? "profile" : null,
    isReady
      ? async () => {
          const {
            data: { user },
          } = await supabaseClient.auth.getUser()
          if (user) {
            const res = await supabaseClient
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single()
            if (res.data?.length === 0) return null
            return res.data
          }
          return null
        }
      : null
  )
  return swr
}
