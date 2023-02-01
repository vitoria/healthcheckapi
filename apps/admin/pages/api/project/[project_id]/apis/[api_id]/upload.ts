import crypto from "crypto"
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

  const upload = (file: formidable.File) =>
    supabase.storage
      .from("protos")
      .upload(
        `${req.query.api_id}/${crypto.randomUUID()}-${file.originalFilename}`,
        fs.readFileSync(file.filepath)
      )

  if (req.method == "POST") {
    const form = new formidable.IncomingForm({ multiples: true })

    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.status(err.httpCode || 400).json({ message: String(err) })
      }

      const FILES: string[] = []

      if (!(files.protos as any).length) {
        const file = files.protos as formidable.File
        const newFile = await upload(file)
        if (newFile.data) {
          FILES.push(newFile.data.path)
        }
      } else {
        const newFiles = await Promise.all(
          (files.protos as any).map(async (file: formidable.File) =>
            upload(file)
          )
        )
        newFiles.forEach((item) => FILES.push(item.data.path))
      }

      const apiFiles = await supabase
        .from("files")
        .insert(FILES.map((url) => ({ api_id: req.query.api_id, url })))
        .select("*")

      if (apiFiles.error) {
        return res.status(apiFiles.status).json(apiFiles.error)
      }

      return res.status(200).json(apiFiles.data)
    })
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
