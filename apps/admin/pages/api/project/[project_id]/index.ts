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
    const project = await supabase
      .from("projects")
      .select("*, organization: organizations(*)")
      .eq("id", req.query.project_id)
      .single()

    if (project.error) {
      return res.status(project.status).json(project.error)
    }

    return res.status(200).json(project.data)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
