import { useState } from "react"
import { useRouter } from "next/router"
import { NextPageWithLayout } from "@/types"
import { useFormik } from "formik"
import { useDropzone } from "react-dropzone"
import { Button, Input, Label, cn } from "ui"
import * as Yup from "yup"

import ProjectLayout from "@/components/Project"
import { useShell } from "@/components/Shell"

const validationSchema = Yup.object().shape({
  name: Yup.string().required("obrigatório"),
})

function validator(file: File) {
  if (!file.name.endsWith(".proto")) {
    return {
      code: "type-wrong",
      message: `File should be a proto type`,
    }
  }

  return null
}

const NewApiPage: NextPageWithLayout = () => {
  const { onToast } = useShell()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)

      const body = new FormData()

      body.append("name", values.name)
      body.append("url", values.url)

      for (let i = 0; i < values.protos.length; i++) {
        body.append("protos", values.protos[i])
      }

      const api = await fetch(`/api/project/${router.query.project_id}/apis`, {
        method: "POST",
        body,
      }).then((res) => res.json())

      router.push({
        pathname: "/project/[project_id]/api/[api_id]",
        query: { ...router.query, api_id: api.id },
      })
    } catch (error: any) {
      onToast({
        title: "Error to create a new API",
        description: error.message,
        variant: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: { name: "", url: "", protos: "" },
    validationSchema,
    onSubmit,
  })

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    acceptedFiles,
  } = useDropzone({
    onDrop: (acceptedFiles) => formik.setFieldValue("protos", acceptedFiles),
    validator,
  })

  return (
    <div className="flex flex-1 flex-col items-center bg-gray-100 p-4 sm:pt-12">
      <div className="w-full max-w-4xl rounded-md border bg-white p-4 shadow-lg">
        <h3 className="font-medium">Create a new API</h3>
        <span className="text-sm text-gray-500">
          Some description about that
        </span>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 py-8">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                autoFocus
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="protos">Files</Label>
              <div className="col-span-3 flex flex-col space-y-4">
                <div
                  className={cn(
                    "flex min-h-[96px] select-none items-center justify-center rounded-md border border-slate-300 p-4 focus:outline-none",
                    {
                      "ring-2 ring-slate-400 ring-offset-2":
                        isFocused || isDragAccept,
                    }
                  )}
                  {...getRootProps()}
                >
                  <input id="protos" {...getInputProps()} />
                  <p className="text-sm text-gray-500">
                    Drop the proto files here, or click to choose files
                  </p>
                </div>
                <aside>
                  <ul>
                    {acceptedFiles.map((file) => (
                      <li key={file.name} className="text-sm text-gray-500">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" type="button" onClick={router.back}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formik.values.name ||
                !formik.values.url ||
                !formik.values.protos
              }
            >
              {loading ? "Loading..." : "Create project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

NewApiPage.getLayout = function getLayout(page) {
  return <ProjectLayout>{page}</ProjectLayout>
}

export default NewApiPage
