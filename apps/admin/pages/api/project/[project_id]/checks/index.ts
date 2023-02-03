import { NextApiHandler } from "next"
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
    const checks = await supabase
      .from("checks")
      .select("*, api:apis(*)")
      .eq('apis.project_id', req.query.project_id)
      .order("created_at", { ascending: false })

    if (checks.error) {
      return res.status(checks.status).json(checks.error)
    }

    return res.status(200).json(checks.data)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
