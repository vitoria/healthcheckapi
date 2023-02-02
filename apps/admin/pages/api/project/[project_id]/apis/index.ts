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
    const project = await supabase
      .from("projects")
      .select("org_id")
      .eq("id", req.query.project_id)
      .single()

    if (project.error) {
      return res.status(project.status).json(project.error)
    }

    const api = await supabase
      .from("apis")
      .insert([{ ...req.body, org_id: project.data.org_id }])
      .select("*")
      .single()

    if (api.error) {
      return res.status(api.status).json(api.error)
    }

    return res.status(200).json(api.data)
  } else if (req.method == "GET") {
    const project = await supabase
      .from("projects")
      .select("org_id")
      .eq("id", req.query.project_id)
      .single()

    if (project.error) {
      return res.status(project.status).json(project.error)
    }

    const apis = await supabase
      .from("apis")
      .select("*, files(*)")
      .eq("org_id", project.data.org_id)
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
