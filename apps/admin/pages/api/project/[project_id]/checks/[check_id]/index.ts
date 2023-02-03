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
    const check = await supabase
      .from("checks")
      .select("*, api: apis(*)")
      .eq("id", req.query.check_id)
      .single()

    if (check.error) {
      return res.status(check.status).json(check.error)
    }

    // const files = await supabase
    //   .from("files")
    //   .select("*")
    //   .order("created_at", { ascending: false })
    //   .eq("api_id", req.query.api_id)

    // if (files.error) {
    //   return res.status(files.status).json(files.error)
    // }

    return res.status(200).json({ ...check.data })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
