import { NextApiHandler } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import protobuf from "protobufjs"

function getServicesDescriptor(file: any) {
  const keys = Object.keys(file)
  const serviceKeys = keys.filter((key) => file[key]["methods"])
  if (serviceKeys.length == 0) return null

  return serviceKeys.map((serviceKey) => ({
    methods: Object.keys(file[serviceKey].methods),
    name: serviceKey,
  }))
}

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
      .select("*")
      .eq("api_id", req.query.api_id)

    const PUBLIC_URLS: string[] = []

    if (files.data) {
      files.data.map((item) =>
        PUBLIC_URLS.push(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/protos/${item.url}`
        )
      )
    }

    const protos = new Map()

    await Promise.all(
      PUBLIC_URLS.map((url) =>
        fetch(url)
          .then((res) => res.text())
          .then((proto) =>
            protos.set(url, protobuf.parse(proto).root.toJSON().nested)
          )
      )
    )

    const parsedFiles = Array.from(protos, ([, value]) => value)

    const services = parsedFiles.reduce((total, item) => {
      const descriptors = getServicesDescriptor(item)

      descriptors?.forEach((descriptor) => {
        if (!total.some((i: any) => i.name === descriptor.name)) {
          total.push(descriptor)
        }
      })

      return total
    }, [])

    return res.status(200).json({
      services,
    })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

export default ProtectedRoute
