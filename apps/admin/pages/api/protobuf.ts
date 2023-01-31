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
    console.log("request: ", req.body)

    const data = req.body

    console.log("data: ", data)

    // TODO: Validate proto

    const file = await supabase.storage
      .from("protos")
      .upload(`test.proto`, data, { upsert: true })

    if (file.error) {
      res.status(500).json({ error: file.error })
      return
    }

    return res.status(200).json({ data: file.data.path })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
