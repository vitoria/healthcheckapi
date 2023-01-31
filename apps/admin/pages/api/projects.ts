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
    // verify if the user logged is member of any org
    const members = await supabase
      .from("members")
      .select("*")
      .eq("user_id", session.user.id)

    if (members.error) {
      return res.status(members.status).json(members.error)
    }

    if (members.data.length === 0) {
      return res.redirect(307, "/projects/new")
    }

    const projects = await supabase
      .from("projects")
      .select("*, organization: organizations(*)")
      .in(
        "org_id",
        members.data.map((item) => item.org_id)
      )

    if (projects.error) {
      return res.status(projects.status).json(projects.error)
    }

    const organizations = projects.data.reduce((total, item) => {
      if (total.some((i: any) => i.id === item.org_id)) return total
      total.push(item.organization)
      return total
    }, [])

    return res.status(200).json({ organizations, projects: projects.data })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
