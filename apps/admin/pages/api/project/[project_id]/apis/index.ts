import fs from "fs"
import { NextApiHandler } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import formidable from "formidable"

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
    const form = new formidable.IncomingForm({ multiples: true })

    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.status(err.httpCode || 400).json({ message: String(err) })
      }

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
        .insert([
          { name: fields.name, url: fields.url, org_id: project.data.org_id },
        ])
        .select("*")
        .single()

      if (api.error) {
        return res.status(api.status).json(api.error)
      }

      const newFiles = await Promise.all(
        (files.protos as any).map(async (file: formidable.File) =>
          supabase.storage
            .from("protos")
            .upload(
              `${api.data.id}/${file.originalFilename}`,
              fs.readFileSync(file.filepath)
            )
        )
      )

      const apiFiles = await supabase
        .from("files")
        .insert(
          newFiles.map((file) => ({ api_id: api.data.id, url: file.data.path }))
        )

      if (apiFiles.error) {
        return res.status(apiFiles.status).json(apiFiles.error)
      }

      return res.status(200).json(api.data)
    })
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

    if (apis.error) {
      return res.status(apis.status).json(apis.error)
    }

    return res.status(200).json(apis.data)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute

export const config = {
  api: {
    bodyParser: false,
  },
}
