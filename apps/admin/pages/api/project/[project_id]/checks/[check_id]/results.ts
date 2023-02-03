import { NextApiHandler } from "next"
import { CheckResult } from "@/types"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

const ProtectedRoute: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description: "The user is not authenticated",
    })
  }

  if (req.method == "GET") {
    const checkResults = await supabase
      .from("check_results")
      .select("*")
      .eq("check_id", req.query.check_id)
      .order("created_at", { ascending: true })

    if (checkResults.error) {
      return res.status(checkResults.status).json(checkResults.error)
    }

    const data = checkResults.data.map((item) => ({
      ...item,
      latency: item.latency ?? 0,
    })) as CheckResult[]
    const count = data.length
    const latency =
      data.reduce((total, item) => total + item.latency, 0) / count
    const uptime = Number(
      (
        (data.filter((item) => item.status === "OK").length / count) *
        100
      ).toFixed(2)
    )
    const coverage = Number(
      (
        (data.filter((item) => item.assertion_result === "MATCHED").length /
          count) *
        100
      ).toFixed(2)
    )
    return res.status(200).json({
      count,
      latency,
      uptime,
      coverage,
      data,
    })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
