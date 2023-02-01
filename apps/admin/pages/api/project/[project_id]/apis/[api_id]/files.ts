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
    const files = await supabase
      .from("files")
      .select("*, api: apis(*)")
      .eq("api_id", req.query.api_id)

    if (files.error) {
      return res.status(files.status).json(files.error)
    }

    return res.status(200).json(files.data)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
