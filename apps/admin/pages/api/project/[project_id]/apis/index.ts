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

  if (req.method == "POST") {
    const api = await supabase
      .from("apis")
      .insert([{ ...req.body, project_id: req.query.project_id }])
      .select("*")
      .single()

    if (api.error) {
      return res.status(api.status).json(api.error)
    }

    return res.status(200).json(api.data)
  } else if (req.method == "GET") {
    const apis = await supabase
      .from("apis")
      .select("*, files(*)")
      .eq("project_id", req.query.project_id)
      .order("created_at", { ascending: false })

    if (apis.error) {
      return res.status(apis.status).json(apis.error)
    }

    return res.status(200).json(apis.data)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
